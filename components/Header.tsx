import React, { useState } from 'react';
import { Search, Menu, ShoppingBag, Zap, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
      {/* Top Bar */}
      <div className="bg-brand-dark text-white text-xs py-2 text-center hidden sm:block">
        🚀 Spedizione gratuita su tutti gli ordini oltre i 50€ | Offerte verificate al 100%
      </div>

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
             <div className="relative">
                <ShoppingBag className="w-8 h-8 text-brand-red transform group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 bg-brand-yellow text-brand-dark text-[10px] font-bold px-1 rounded-full">
                  %
                </span>
             </div>
             <div className="flex flex-col leading-tight">
                <span className="font-heading font-bold text-xl text-brand-dark tracking-tight">
                  123<span className="text-brand-red">Offerte</span>
                </span>
                <span className="text-[10px] font-medium text-brand-orange tracking-widest uppercase">Pazzesche</span>
             </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl relative mx-8">
            <input 
              type="text" 
              placeholder="Cerca offerte, brand o categorie..." 
              className="w-full pl-4 pr-12 py-2.5 rounded-full border-2 border-gray-200 focus:border-brand-orange focus:outline-none transition-colors text-sm"
            />
            <button className="absolute right-1 top-1 bottom-1 bg-brand-orange hover:bg-brand-red text-white px-4 rounded-full transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
             <button className="hidden md:flex items-center gap-2 text-brand-dark font-medium hover:text-brand-red transition-colors">
               <Zap className="w-5 h-5 fill-brand-yellow text-brand-dark" />
               <span>Flash Deals</span>
             </button>
             <button 
               className="md:hidden p-2 text-brand-dark"
               onClick={() => setIsMenuOpen(!isMenuOpen)}
             >
               {isMenuOpen ? <X /> : <Menu />}
             </button>
             <button className="bg-brand-red hover:bg-red-700 text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow-lg shadow-red-200 transition-all hidden md:block">
                Iscriviti
             </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-100 space-y-4 animate-fade-in">
             <input 
              type="text" 
              placeholder="Cerca..." 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50"
            />
            <nav className="flex flex-col space-y-3 font-medium text-gray-700">
              <Link to="/" className="hover:text-brand-red" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/" className="hover:text-brand-red" onClick={() => setIsMenuOpen(false)}>Categorie</Link>
              <Link to="/" className="hover:text-brand-red" onClick={() => setIsMenuOpen(false)}>Flash Sales 🔥</Link>
              <Link to="/" className="hover:text-brand-red" onClick={() => setIsMenuOpen(false)}>Blog</Link>
              <Link to="/" className="hover:text-brand-red" onClick={() => setIsMenuOpen(false)}>Chi Siamo</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;