import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../mockData';
import { Star, Check, ShieldCheck, TrendingDown, ArrowLeft, Share2, Sparkles } from 'lucide-react';
import { analyzeDeal } from '../services/geminiService';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find(p => p.id === id);
  
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const handleAnalyze = async () => {
      if (!product) return;
      setIsLoadingAi(true);
      const result = await analyzeDeal(product);
      setAiAnalysis(result);
      setIsLoadingAi(false);
  };

  useEffect(() => {
     // Reset state on navigation
     setAiAnalysis(null);
  }, [id]);

  if (!product) {
    return <div className="py-20 text-center font-bold text-xl">Prodotto non trovato! <Link to="/" className="text-brand-red underline">Torna alla home</Link></div>;
  }

  return (
    <div className="bg-brand-gray min-h-screen pb-20">
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex items-center text-sm text-gray-500">
           <Link to="/" className="hover:text-brand-red flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Home</Link>
           <span className="mx-2">/</span>
           <span className="capitalize">{product.category}</span>
           <span className="mx-2">/</span>
           <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">
             
             {/* Left: Image */}
             <div className="p-8 lg:p-12 bg-gray-50 flex items-center justify-center relative">
                <div className="absolute top-6 left-6 z-10">
                   <span className="bg-brand-yellow text-brand-dark font-extrabold px-4 py-2 rounded-lg shadow-sm text-lg block">
                      -{product.discountPercentage}%
                   </span>
                </div>
                <img src={product.imageUrl} alt={product.title} className="w-full max-w-md object-contain hover:scale-105 transition-transform duration-500" />
             </div>

             {/* Right: Info */}
             <div className="p-8 lg:p-12 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                   <div className="flex text-brand-yellow">
                     {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`} />
                     ))}
                   </div>
                   <span className="text-sm font-bold text-gray-600">{product.rating}/5 ({product.reviews} recensioni)</span>
                </div>

                <h1 className="text-2xl md:text-4xl font-heading font-bold text-brand-dark mb-6 leading-tight">
                   {product.title}
                </h1>

                {/* Price Block */}
                <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-8">
                   <div className="flex items-end gap-4 mb-2">
                      <span className="text-4xl font-extrabold text-brand-red">€{product.discountPrice.toFixed(2)}</span>
                      <span className="text-lg text-gray-400 line-through mb-1.5">€{product.originalPrice.toFixed(2)}</span>
                   </div>
                   <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
                      <TrendingDown className="w-4 h-4" />
                      Prezzo più basso degli ultimi 30 giorni
                   </div>
                </div>

                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                   {product.description}
                </p>

                {/* Features */}
                <div className="mb-8">
                   <h3 className="font-bold text-brand-dark mb-3">Caratteristiche Principali:</h3>
                   <ul className="space-y-2">
                      {product.features.map((feat, idx) => (
                         <li key={idx} className="flex items-center gap-2 text-gray-600">
                            <div className="bg-green-100 p-1 rounded-full text-green-600"><Check className="w-3 h-3" /></div>
                            {feat}
                         </li>
                      ))}
                   </ul>
                </div>
                
                {/* CTA Buttons */}
                <div className="mt-auto space-y-4">
                   <a 
                     href={product.affiliateLink} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="w-full block bg-brand-orange hover:bg-brand-red text-white text-center font-bold text-xl py-4 rounded-xl shadow-lg shadow-orange-200 transition-all transform hover:-translate-y-1"
                   >
                      Vai all'offerta su {product.retailer}
                   </a>
                   <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                      <ShieldCheck className="w-4 h-4" /> Transazione sicura · Verificato dallo staff
                   </div>
                </div>
             </div>
          </div>

          {/* AI Analysis Section */}
          <div className="border-t border-gray-100 p-8 lg:p-12 bg-gradient-to-b from-white to-gray-50">
             <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                   <div className="bg-brand-dark p-2 rounded-lg text-brand-yellow">
                      <Sparkles className="w-6 h-6" />
                   </div>
                   <h2 className="text-2xl font-heading font-bold">L'Opinione dell'Esperto IA</h2>
                </div>

                {!aiAnalysis ? (
                  <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
                     <p className="text-gray-500 mb-4">Vuoi sapere se è davvero un affare? Chiedi alla nostra IA.</p>
                     <button 
                        onClick={handleAnalyze}
                        disabled={isLoadingAi}
                        className="bg-gray-900 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors flex items-center gap-2 mx-auto"
                     >
                        {isLoadingAi ? 'Analisi in corso...' : 'Analizza Prezzo e Qualità'}
                        {!isLoadingAi && <Sparkles className="w-4 h-4 text-brand-yellow" />}
                     </button>
                  </div>
                ) : (
                   <div className="bg-white border-l-4 border-brand-yellow p-6 rounded-r-xl shadow-sm animate-fade-in">
                      <p className="text-gray-800 italic text-lg leading-relaxed whitespace-pre-line">
                         "{aiAnalysis}"
                      </p>
                      <div className="mt-4 flex justify-end text-xs font-bold text-gray-400 uppercase">
                         Powered by Gemini
                      </div>
                   </div>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;