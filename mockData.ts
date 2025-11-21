import { Product, Category, Promotion } from './types';

export const CATEGORIES: Category[] = [
  { id: 'tech', name: 'Tecnologia', iconName: 'Smartphone', imageUrl: 'https://picsum.photos/400/400?random=1' },
  { id: 'home', name: 'Casa & Cucina', iconName: 'Home', imageUrl: 'https://picsum.photos/400/400?random=2' },
  { id: 'fashion', name: 'Moda', iconName: 'Shirt', imageUrl: 'https://picsum.photos/400/400?random=3' },
  { id: 'gaming', name: 'Gaming', iconName: 'Gamepad2', imageUrl: 'https://picsum.photos/400/400?random=4' },
  { id: 'beauty', name: 'Beauty', iconName: 'Sparkles', imageUrl: 'https://picsum.photos/400/400?random=5' },
  { id: 'sport', name: 'Sport', iconName: 'Dumbbell', imageUrl: 'https://picsum.photos/400/400?random=6' },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Sony WH-1000XM5 Cuffie Wireless',
    description: 'Le migliori cuffie con cancellazione del rumore sul mercato. Batteria 30h, design leggero.',
    originalPrice: 420.00,
    discountPrice: 349.00,
    discountPercentage: 17,
    imageUrl: 'https://picsum.photos/600/600?random=10',
    category: 'tech',
    rating: 4.8,
    reviews: 1240,
    isFlashDeal: true,
    features: ['Noise Cancelling Attivo', '30 Ore Autonomia', 'Microfono HD', 'Alexa Integrato'],
    affiliateLink: '#',
    retailer: 'Amazon'
  },
  {
    id: '2',
    title: 'Robot Aspirapolvere Roomba j7+',
    description: 'Aspirapolvere intelligente con svuotamento automatico. Mappa la tua casa e evita ostacoli.',
    originalPrice: 899.00,
    discountPrice: 599.00,
    discountPercentage: 33,
    imageUrl: 'https://picsum.photos/600/600?random=11',
    category: 'home',
    rating: 4.6,
    reviews: 850,
    isFlashDeal: false,
    features: ['Svuotamento Automatico', 'Mappatura Smart', 'Controllo App', 'Ideale per Peli Animali'],
    affiliateLink: '#',
    retailer: 'Amazon'
  },
  {
    id: '3',
    title: 'Nike Air Zoom Pegasus 40',
    description: 'Scarpe da running reattive per allenamento quotidiano. Supporto neutro e ammortizzazione elastica.',
    originalPrice: 129.99,
    discountPrice: 89.99,
    discountPercentage: 31,
    imageUrl: 'https://picsum.photos/600/600?random=12',
    category: 'sport',
    rating: 4.7,
    reviews: 320,
    isFlashDeal: true,
    features: ['Schiuma React', 'Mesh Traspirante', 'Supporto Arco Plantare', 'Leggerezza'],
    affiliateLink: '#',
    retailer: 'eBay'
  },
  {
    id: '4',
    title: 'Nintendo Switch OLED - Edizione Mario',
    description: 'Console ibrida con schermo OLED da 7 pollici, colori vivaci e stand regolabile.',
    originalPrice: 349.99,
    discountPrice: 299.99,
    discountPercentage: 14,
    imageUrl: 'https://picsum.photos/600/600?random=13',
    category: 'gaming',
    rating: 4.9,
    reviews: 5600,
    isFlashDeal: false,
    features: ['Schermo OLED 7"', '64GB Memoria', 'Dock con LAN', 'Audio Migliorato'],
    affiliateLink: '#',
    retailer: 'Unieuro'
  },
  {
    id: '5',
    title: 'Friggitrice ad Aria Philips XXL',
    description: 'Cucina sana con poco olio. Capacità extra large per tutta la famiglia.',
    originalPrice: 249.99,
    discountPrice: 159.99,
    discountPercentage: 36,
    imageUrl: 'https://picsum.photos/600/600?random=14',
    category: 'home',
    rating: 4.5,
    reviews: 2100,
    isFlashDeal: true,
    features: ['Tecnologia Fat Removal', 'Cestello QuickClean', 'Ricettario incluso', 'Digitale'],
    affiliateLink: '#',
    retailer: 'Amazon'
  },
  {
    id: '6',
    title: 'Samsung Galaxy S23 Ultra 5G',
    description: 'Lo smartphone definitivo. Fotocamera 200MP, S Pen integrata e prestazioni al top.',
    originalPrice: 1479.00,
    discountPrice: 999.00,
    discountPercentage: 32,
    imageUrl: 'https://picsum.photos/600/600?random=15',
    category: 'tech',
    rating: 4.9,
    reviews: 980,
    isFlashDeal: false,
    features: ['Fotocamera 200MP', 'S Pen', 'Snapdragon 8 Gen 2', 'Batteria 5000mAh'],
    affiliateLink: '#',
    retailer: 'Amazon'
  },
    {
    id: '7',
    title: 'Set Valigie Samsonite 3 Pezzi',
    description: 'Set completo da viaggio rigido, ultra leggero e resistente.',
    originalPrice: 450.00,
    discountPrice: 225.00,
    discountPercentage: 50,
    imageUrl: 'https://picsum.photos/600/600?random=16',
    category: 'fashion',
    rating: 4.4,
    reviews: 120,
    isFlashDeal: true,
    features: ['Materiale Curv', 'Chiusura TSA', '4 Ruote', 'Garanzia 10 anni'],
    affiliateLink: '#',
    retailer: 'Amazon'
  }
];

export const PROMO_BANNER: Promotion = {
  id: 'summer-sale',
  title: '🔥 Oggi solo per te: super sconti fino al -70%!',
  subtitle: 'Nuove offerte aggiornate ogni ora!',
  ctaText: 'Scopri ora',
  bgGradient: 'bg-gradient-to-r from-brand-red to-brand-orange'
};