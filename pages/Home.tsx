import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Smartphone, Home as HomeIcon, Shirt, Gamepad2, Sparkles, Dumbbell, ChevronRight, Flame } from 'lucide-react';
import { CATEGORIES, PRODUCTS, PROMO_BANNER } from '../mockData';
import DealCard from '../components/DealCard';

const CategoryIconMap: Record<string, React.ElementType> = {
  'Smartphone': Smartphone,
  'Home': HomeIcon,
  'Shirt': Shirt,
  'Gamepad2': Gamepad2,
  'Sparkles': Sparkles,
  'Dumbbell': Dumbbell
};

const Home: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 30 });

  // Fake countdown logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return { h: 12, m: 0, s: 0 }; // Reset
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashDeals = PRODUCTS.filter(p => p.isFlashDeal);
  const regularDeals = PRODUCTS.filter(p => !p.isFlashDeal);

  return (
    <main>
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-brand-dark via-gray-900 to-brand-red text-white pt-12 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-brand-yellow text-sm font-bold mb-6 animate-bounce">
            💥 Aggiornato in tempo reale
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold leading-tight mb-6 tracking-tight">
            123 Offerte Pazzesche <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-brand-orange">
              Sconti fino al 70%
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Scopri i super sconti su tecnologia, casa, moda e gaming. Selezioniamo manualmente solo le offerte reali, verificate e sicure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button className="bg-brand-red hover:bg-red-600 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg shadow-brand-red/30 transition-transform hover:scale-105 flex items-center justify-center gap-2">
                Vedi offerte del giorno <ArrowRight className="w-5 h-5" />
             </button>
             <button className="bg-white text-brand-dark hover:bg-gray-100 font-bold text-lg px-8 py-4 rounded-full shadow-lg transition-transform hover:scale-105">
                Sfoglia Categorie
             </button>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-12 bg-white -mt-10 rounded-t-[40px] relative z-20 shadow-lg mx-2 md:mx-0">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8">
              {CATEGORIES.map((cat) => {
                 const Icon = CategoryIconMap[cat.iconName] || HomeIcon;
                 return (
                   <div key={cat.id} className="flex flex-col items-center group cursor-pointer">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gray-50 group-hover:bg-brand-orange/10 border border-gray-100 group-hover:border-brand-orange text-gray-500 group-hover:text-brand-orange flex items-center justify-center transition-all duration-300 mb-3">
                         <Icon className="w-8 h-8" />
                      </div>
                      <span className="font-bold text-sm text-gray-700 group-hover:text-brand-orange">{cat.name}</span>
                   </div>
                 )
              })}
           </div>
        </div>
      </section>

      {/* FLASH DEALS */}
      <section className="py-16 bg-brand-gray">
         <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end md:items-center justify-between mb-8 gap-4">
               <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-brand-red p-1.5 rounded text-white">
                      <Flame className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-dark">Offerte Lampo</h2>
                  </div>
                  <p className="text-gray-500">Sconti a tempo limitato, approfittane ora!</p>
               </div>
               
               {/* Timer */}
               <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full border border-red-100 shadow-sm">
                  <Clock className="w-5 h-5 text-brand-red animate-pulse" />
                  <span className="text-gray-600 font-medium text-sm uppercase mr-2">Scade in:</span>
                  <div className="flex gap-1 font-mono font-bold text-brand-dark text-lg">
                     <span className="bg-brand-dark text-white px-1.5 rounded">{String(timeLeft.h).padStart(2, '0')}</span>:
                     <span className="bg-brand-dark text-white px-1.5 rounded">{String(timeLeft.m).padStart(2, '0')}</span>:
                     <span className="bg-brand-red text-white px-1.5 rounded">{String(timeLeft.s).padStart(2, '0')}</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {flashDeals.map(product => (
                  <DealCard key={product.id} product={product} />
               ))}
            </div>
         </div>
      </section>

      {/* BANNER PROMO */}
      <section className="py-8">
        <div className="container mx-auto px-4">
           <div className={`rounded-3xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-orange-200 relative overflow-hidden ${PROMO_BANNER.bgGradient}`}>
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 max-w-2xl">
                 <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-white mb-4 leading-tight">
                   {PROMO_BANNER.title}
                 </h2>
                 <p className="text-white/90 font-medium text-lg">{PROMO_BANNER.subtitle}</p>
              </div>
              
              <div className="relative z-10">
                 <button className="bg-white text-brand-red font-extrabold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-lg">
                    {PROMO_BANNER.ctaText}
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* OTHER DEALS */}
      <section className="py-16 bg-white">
         <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-heading font-bold text-brand-dark">Ultimi Arrivi</h2>
               <Link to="#" className="text-brand-orange font-bold flex items-center gap-1 hover:underline">
                  Vedi tutti <ChevronRight className="w-4 h-4" />
               </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {regularDeals.map(product => (
                  <DealCard key={product.id} product={product} />
               ))}
               {/* Fill grid if needed */}
               {regularDeals.length < 4 && flashDeals.slice(0, 4 - regularDeals.length).map(product => (
                 <DealCard key={`extra-${product.id}`} product={product} />
               ))}
            </div>
         </div>
      </section>

      {/* NEWSLETTER / FOOTER PREVIEW */}
      <section className="py-20 bg-brand-dark text-white text-center">
        <div className="container mx-auto px-4 max-w-2xl">
           <span className="text-brand-yellow font-bold tracking-widest uppercase text-sm mb-4 block">Non perdere mai un affare</span>
           <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8">Ricevi le 5 migliori offerte del giorno via email</h2>
           <div className="flex flex-col sm:flex-row gap-3">
              <input type="email" placeholder="La tua email..." className="flex-1 px-6 py-4 rounded-full text-gray-900 outline-none focus:ring-4 focus:ring-brand-orange/50" />
              <button className="bg-brand-orange hover:bg-brand-red px-8 py-4 rounded-full font-bold text-white transition-colors">
                 Iscriviti Gratis
              </button>
           </div>
           <p className="text-gray-500 text-xs mt-6">Nessuno spam. Cancellazione in un click. Privacy Policy.</p>
        </div>
      </section>
    </main>
  );
};

export default Home;