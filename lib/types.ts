export interface ShirtVariant {
  id: string;
  sku: string;
  price: number;
  salePrice?: number | null;
  imageUrl?: string | null;
}

export interface Shirt {
  id: string;
  name: string;
  description?: string;
  minPrice?: number;
  maxPrice?: number;
  price?: number;
  mainImage?: string;
}

export interface FeaturedItem {
  id: string;
  name: string;
  mainImage?: string; 
  logoUrl?: string;  
  description?: string;
  price?: number;
  minPrice?: number;
  maxPrice?: number;
};

