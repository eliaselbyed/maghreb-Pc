export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  badge?: 'NEW ARRIVAL' | 'BACK TO SCHOOL' | 'SALE';
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
}
