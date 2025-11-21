import React from 'react';
import { Star, ExternalLink, Clock } from 'lucide-react';
import { Product } from '../types';
import { Link } from 'react-router-dom';

interface DealCardProps {
  product: Product;
}

const DealCard: React.FC<DealCardProps> = ({ product }) => {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full relative">
      
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isFlashDeal && (
          <span className="bg-brand-red text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm animate-pulse">
            <Clock className="w-3 h-3" /> FLASH
          </span>
        )}
        <span className="bg-brand-yellow text-brand-dark text-xs font-extrabold px-2 py-1 rounded shadow-sm">
          -{product.discountPercentage}%
        </span>
      </div>

      {/* Image Area */}
      <div className="aspect-square overflow-hidden p-6 bg-white flex items-center justify-center relative">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="object-contain w-full h-full transform group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow bg-white">
        <div className="flex items-center gap-1 text-brand-yellow mb-2 text-xs font-medium">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-gray-500 ml-1">({product.reviews})</span>
            <span className="text-gray-300 ml-auto text-[10px] uppercase tracking-wider">{product.retailer}</span>
        </div>

        <Link to={`/product/${product.id}`} className="block mb-2">
          <h3 className="font-heading font-bold text-gray-800 text-sm leading-tight line-clamp-2 group-hover:text-brand-red transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="mt-auto pt-3 border-t border-gray-50">
          <div className="flex items-end justify-between mb-3">
             <div className="flex flex-col">
                <span className="text-xs text-gray-400 line-through decoration-red-400">€{product.originalPrice.toFixed(2)}</span>
                <span className="text-xl font-extrabold text-brand-dark">€{product.discountPrice.toFixed(2)}</span>
             </div>
          </div>

          <Link 
            to={`/product/${product.id}`}
            className="w-full flex items-center justify-center gap-2 bg-brand-dark text-white hover:bg-brand-orange font-bold py-2.5 rounded-lg text-sm transition-colors"
          >
            Vai all'offerta <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DealCard;