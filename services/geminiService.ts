import { GoogleGenAI } from "@google/genai";
import { Product } from '../types';

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
};

export const analyzeDeal = async (product: Product): Promise<string | null> => {
    const ai = getClient();
    if (!ai) return "API Key non configurata. Impossibile analizzare l'offerta.";

    try {
        const prompt = `
        Agisci come un esperto di shopping online e risparmio per il portale "123 Offerte Pazzesche".
        Analizza questa offerta in italiano in massimo 3 frasi brevi e persuasive:
        
        Prodotto: ${product.title}
        Prezzo Originale: €${product.originalPrice}
        Prezzo Scontato: €${product.discountPrice}
        Sconto: ${product.discountPercentage}%
        Venditore: ${product.retailer}
        
        Dimmi se è un buon affare (Best Buy, Buon Prezzo, o Standard) e perché l'utente dovrebbe comprarlo ora. Usa emoji.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Errore Gemini:", error);
        return "Impossibile analizzare l'offerta al momento. Riprova più tardi.";
    }
};