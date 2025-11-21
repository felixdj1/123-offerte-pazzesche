import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
             <h3 className="font-heading font-bold text-xl text-brand-dark mb-4">123<span className="text-brand-red">Offerte</span></h3>
             <p className="text-gray-500 text-sm leading-relaxed mb-6">
               Il portale n.1 per il risparmio online. Selezioniamo manualmente le migliori promozioni da Amazon, eBay e dai principali store internazionali.
             </p>
             <div className="flex gap-4">
                <a href="#" className="bg-gray-100 p-2 rounded-full hover:bg-brand-orange hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="bg-gray-100 p-2 rounded-full hover:bg-brand-orange hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="bg-gray-100 p-2 rounded-full hover:bg-brand-orange hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
             </div>
          </div>

          {/* Links */}
          <div>
             <h4 className="font-bold text-brand-dark mb-6">Esplora</h4>
             <ul className="space-y-3 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-brand-red">Offerte del Giorno</a></li>
                <li><a href="#" className="hover:text-brand-red">Codici Sconto</a></li>
                <li><a href="#" className="hover:text-brand-red">Guide all'acquisto</a></li>
                <li><a href="#" className="hover:text-brand-red">Black Friday 2024</a></li>
             </ul>
          </div>

           <div>
             <h4 className="font-bold text-brand-dark mb-6">Categorie Top</h4>
             <ul className="space-y-3 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-brand-red">Elettronica</a></li>
                <li><a href="#" className="hover:text-brand-red">Casa & Cucina</a></li>
                <li><a href="#" className="hover:text-brand-red">Moda Uomo/Donna</a></li>
                <li><a href="#" className="hover:text-brand-red">Sport & Fitness</a></li>
             </ul>
          </div>

           <div>
             <h4 className="font-bold text-brand-dark mb-6">Info Legali</h4>
             <ul className="space-y-3 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-brand-red">Chi Siamo</a></li>
                <li><a href="#" className="hover:text-brand-red">Contatti</a></li>
                <li><a href="#" className="hover:text-brand-red">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-brand-red">Disclaimer Affiliazioni</a></li>
             </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 text-center text-xs text-gray-400">
           <p className="mb-2">&copy; 2026 123 Offerte Pazzesche. Tutti i diritti riservati.</p>
           <p>
             In qualità di Affiliato Amazon, ebay ed altre commerce tuteliamo i nostri inscritti dagli acquisti idonei. I prezzi e la disponibilità dei prodotti sono accurati alla data/ora indicata e sono soggetti a modifica.
           </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;