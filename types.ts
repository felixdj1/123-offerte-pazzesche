export interface Product {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  imageUrl: string;
  category: CategoryId;
  rating: number;
  reviews: number;
  isFlashDeal: boolean;
  features: string[];
  affiliateLink: string;
  retailer: 'Amazon' | 'eBay' | 'AliExpress' | 'Unieuro';
}

export type CategoryId = 'tech' | 'home' | 'fashion' | 'gaming' | 'beauty' | 'sport';

export interface Category {
  id: CategoryId;
  name: string;
  iconName: string;
  imageUrl: string;
}

export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  bgGradient: string;
}