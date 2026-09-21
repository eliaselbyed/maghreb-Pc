export interface Product {
  id: string;
  name: string;
  fullName?: string;
  tagline?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  category: string;
  image: string;
  gallery?: string[];
  badge?: 'NEW ARRIVAL' | 'BACK TO SCHOOL' | 'SALE' | 'NEW' | 'PRO' | 'HOT';
  description?: string;
  features?: string[];
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
  stockStatus?: 'in_stock' | 'out_of_stock' | string;
  specs?: { label: string; value: string }[];
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
