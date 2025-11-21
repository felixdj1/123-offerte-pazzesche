import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, X, MessageSquareQuote, Volume2, Loader2, Send, Keyboard, Minimize2, User, Bot, AlertCircle } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality, Chat } from "@google/genai";
import { createPcmBlob, decodeBase64ToUint8Array, decodeAudioData } from '../utils/audioHelpers';

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
};

const SYSTEM_INSTRUCTION = `
Sei "Max", l'assistente virtuale di "123 Offerte Pazzesche".
Parli con una voce maschile profonda (Fenrir). Il tuo tono è energico, professionale e disponibile.
Appena la connessione inizia, PRESENTATI SUBITO brevemente dicendo chi sei e che puoi aiutare a trovare le migliori offerte.
Rispondi alle domande in modo conciso e diretto, ideale per una conversazione vocale.
Non aspettare che l'utente parli per primo: inizia tu salutando.
`;

const VoiceAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'text' | 'voice'>('text'); // Default to text to allow writing immediately
  
  // Voice State
  const [voiceStatus, setVoiceStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [volume, setVolume] = useState(0);
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'model', text: 'Ciao! Sono Max. Posso aiutarti a trovare l\'offerta perfetta o spiegarti i dettagli di un prodotto. Scrivimi o parlami!' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Refs for Voice
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Refs for Chat
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, mode]);

  // --- VOICE LOGIC ---

  const stopVoiceSession = () => {
    if (sessionRef.current) sessionRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (inputContextRef.current) {
      inputContextRef.current.close();
      inputContextRef.current = null;
    }
    if (outputContextRef.current) {
      outputContextRef.current.close();
      outputContextRef.current = null;
    }
    sourcesRef.current.forEach(source => {
        try { source.stop(); } catch (e) {}
    });
    sourcesRef.current.clear();

    setVoiceStatus('disconnected');
    setVolume(0);
    nextStartTimeRef.current = 0;
  };

  const startVoiceSession = async () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        setErrorMessage("API Key non configurata.");
        setVoiceStatus('error');
        return;
    }

    setVoiceStatus('connecting');
    setErrorMessage('');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Il tuo browser non supporta l'accesso al microfono.");
      }

      // Initialize AudioContexts AFTER getting stream to ensure hardware availability
      let stream: MediaStream;
      try {
        // Request microphone access with specific constraints for voice assistant
        stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                channelCount: 1,
                sampleRate: 16000,
                echoCancellation: true,     // Important for speakers
                noiseSuppression: true,     // Clearer voice
                autoGainControl: true
            } 
        });
      } catch (err: any) {
          if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
              throw new Error("Nessun microfono trovato. Collega un microfono.");
          } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
              throw new Error("Permesso microfono negato.");
          } else {
              throw err;
          }
      }

      streamRef.current = stream;
      
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const ai = new GoogleGenAI({ apiKey });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { 
              prebuiltVoiceConfig: { 
                voiceName: 'Fenrir' // Configured for Male voice (Fenrir)
              } 
            },
          },
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        callbacks: {
          onopen: async () => {
            setVoiceStatus('connected');
            
            // 1. Setup Audio Input Pipeline (Recording & Sending)
            if (inputContextRef.current && streamRef.current) {
                const source = inputContextRef.current.createMediaStreamSource(streamRef.current);
                sourceRef.current = source;
                
                // Use ScriptProcessor to capture raw PCM audio from the microphone
                // Buffer size 4096 gives ~256ms latency at 16kHz, which is good for streaming
                const processor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
                processorRef.current = processor;

                processor.onaudioprocess = (e) => {
                  const inputData = e.inputBuffer.getChannelData(0);
                  
                  // Calculate volume for visualizer
                  let sum = 0;
                  for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
                  setVolume(Math.min(Math.sqrt(sum / inputData.length) * 5, 1));

                  // Convert raw float32 audio to PCM16 blob and send to Gemini immediately
                  const pcmBlob = createPcmBlob(inputData);
                  sessionPromise.then(session => {
                      session.sendRealtimeInput({ media: pcmBlob });
                  });
                };

                source.connect(processor);
                processor.connect(inputContextRef.current.destination);
            }

            // 2. Trigger Introduction immediately
            sessionPromise.then(session => {
                // Send initial text to force the model to introduce itself immediately
                (session as any).send({
                    clientContent: {
                        turns: [{ role: 'user', parts: [{ text: "Presentati ora." }] }],
                        turnComplete: true
                    }
                });
            });

            // 3. Resume Output Context to ensure autoplay works
            if (outputContextRef.current?.state === 'suspended') {
               await outputContextRef.current.resume();
            }
          },
          onmessage: async (msg: LiveServerMessage) => {
            const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputContextRef.current) {
              const ctx = outputContextRef.current;
              const audioBytes = decodeBase64ToUint8Array(base64Audio);
              const audioBuffer = await decodeAudioData(audioBytes, ctx, 24000, 1);
              
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (msg.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
            }
          },
          onclose: () => stopVoiceSession(),
          onerror: (err) => {
            console.error("Session error:", err);
            setErrorMessage("Connessione interrotta.");
            setVoiceStatus('error');
            stopVoiceSession();
          }
        }
      });
      sessionRef.current = sessionPromise;
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Impossibile avviare la voce.");
      setVoiceStatus('error');
      stopVoiceSession();
    }
  };

  // --- CHAT LOGIC ---

  const getChatSession = () => {
    if (!chatSessionRef.current) {
      const apiKey = process.env.API_KEY;
      if (!apiKey) return null;
      
      const ai = new GoogleGenAI({ apiKey });
      chatSessionRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction: SYSTEM_INSTRUCTION }
      });
    }
    return chatSessionRef.current;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const chat = getChatSession();
      if (chat) {
        const result = await chat.sendMessageStream({ message: userMsg.text });
        
        let fullResponse = "";
        const responseId = (Date.now() + 1).toString();
        
        // Placeholder for streaming response
        setMessages(prev => [...prev, { id: responseId, role: 'model', text: '' }]);

        for await (const chunk of result) {
            const text = chunk.text;
            if (text) {
                fullResponse += text;
                setMessages(prev => prev.map(m => m.id === responseId ? { ...m, text: fullResponse } : m));
            }
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Scusa, ho avuto un problema. Riprova." }]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- UI HANDLERS ---

  const toggleMode = () => {
    if (mode === 'text') {
      setMode('voice');
      startVoiceSession();
    } else {
      stopVoiceSession();
      setMode('text');
    }
  };

  const handleClose = () => {
    stopVoiceSession();
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-brand-dark text-white p-4 rounded-full shadow-2xl hover:bg-brand-red transition-all duration-300 hover:scale-110 flex items-center gap-2 group"
      >
        <div className="relative">
             <MessageSquareQuote className="w-6 h-6" />
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-brand-dark"></div>
        </div>
        <span className="font-bold pr-1 hidden group-hover:inline-block animate-fade-in">Chiedi a Max</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-[360px] sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in flex flex-col font-sans h-[600px] max-h-[80vh]">
      
      {/* Header */}
      <div className="bg-brand-dark text-white p-4 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
           <div className="relative">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center border-2 border-white shadow-md">
                <Bot className="w-6 h-6 text-white" />
             </div>
             {mode === 'voice' && voiceStatus === 'connected' && (
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-red"></span>
                </span>
             )}
           </div>
           <div>
             <h3 className="font-bold text-lg leading-tight">Max</h3>
             <p className="text-[10px] uppercase tracking-widest text-gray-300 opacity-80">
                {mode === 'voice' ? 'Modo Vocale' : 'Assistente Online'}
             </p>
           </div>
        </div>
        <div className="flex gap-1">
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <Minimize2 className="w-4 h-4" />
            </button>
            <button onClick={handleClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow bg-gray-50 relative overflow-hidden flex flex-col">
        
        {/* VOICE MODE UI */}
        {mode === 'voice' && (
            <div className="absolute inset-0 z-10 bg-gray-50 flex flex-col items-center justify-center text-center p-6 animate-fade-in">
                {voiceStatus === 'connecting' && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-brand-orange animate-spin" />
                        <p className="font-medium text-gray-500">Connessione a Max in corso...</p>
                    </div>
                )}
                
                {voiceStatus === 'connected' && (
                    <>
                        <div className="relative mb-8">
                            {/* Visualizer Rings */}
                            <div className="absolute inset-0 bg-blue-500 rounded-full opacity-10 animate-ping" style={{ transform: `scale(${1 + volume * 2})` }}></div>
                            <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-pulse" style={{ transform: `scale(${1 + volume})` }}></div>
                            
                            <div className="relative w-24 h-24 bg-gradient-to-br from-brand-dark to-gray-800 rounded-full flex items-center justify-center shadow-xl transition-transform duration-100" style={{ transform: `scale(${1 + (volume * 0.1)})` }}>
                                <Mic className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h4 className="text-xl font-bold text-brand-dark mb-2">Ti ascolto...</h4>
                        <p className="text-sm text-gray-500 max-w-[200px]">Chiedimi delle offerte o consigli sui prodotti.</p>
                    </>
                )}

                {voiceStatus === 'error' && (
                    <div className="flex flex-col items-center gap-4 px-4 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-brand-red" />
                        </div>
                        <h4 className="font-bold text-gray-800">Si è verificato un errore</h4>
                        <p className="text-sm text-gray-600">{errorMessage}</p>
                        <button 
                            onClick={() => startVoiceSession()} 
                            className="mt-2 bg-brand-dark text-white px-6 py-2 rounded-full text-sm hover:bg-brand-red transition-colors shadow-lg"
                        >
                            Riprova
                        </button>
                    </div>
                )}

                <div className="absolute bottom-6 left-0 right-0 px-6">
                    <button 
                        onClick={toggleMode} 
                        className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                    >
                        <Keyboard className="w-5 h-5" /> Passa alla tastiera
                    </button>
                </div>
            </div>
        )}

        {/* TEXT MODE UI */}
        {mode === 'text' && (
            <div className="flex flex-col h-full">
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && (
                                <div className="w-8 h-8 rounded-full bg-brand-dark flex-shrink-0 flex items-center justify-center mr-2 mt-1">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                            )}
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-brand-red text-white rounded-tr-none' 
                                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                            }`}>
                                {msg.text}
                            </div>
                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center ml-2 mt-1">
                                    <User className="w-5 h-5 text-gray-500" />
                                </div>
                            )}
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="w-8 h-8 rounded-full bg-brand-dark flex-shrink-0 flex items-center justify-center mr-2">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                    <button 
                        onClick={toggleMode}
                        className="p-3 bg-brand-dark hover:bg-gray-800 text-white rounded-full transition-colors flex-shrink-0"
                        title="Parla con Max"
                    >
                        <Mic className="w-5 h-5" />
                    </button>
                    <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Scrivi un messaggio..."
                        className="flex-grow bg-gray-100 border-transparent focus:bg-white focus:border-brand-orange border-2 rounded-full px-4 py-2.5 text-sm outline-none transition-all"
                    />
                    <button 
                        onClick={handleSendMessage}
                        disabled={!inputText.trim() || isTyping}
                        className="p-3 bg-brand-orange hover:bg-brand-red text-white rounded-full transition-colors disabled:opacity-50 flex-shrink-0"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;