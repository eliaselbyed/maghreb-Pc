import { Product, Category } from './types';

export const categories: Category[] = [
  { id: 'c1', name: 'Keyboard', iconName: 'Keyboard' },
  { id: 'c2', name: 'Mouse', iconName: 'Mouse' },
  { id: 'c3', name: 'Light', iconName: 'Lightbulb' },
  { id: 'c4', name: 'Microphone', iconName: 'Mic' },
  { id: 'c5', name: 'Monitor Arm', iconName: 'Monitor' },
  { id: 'c6', name: 'Headset', iconName: 'Headphones' },
  { id: 'c7', name: 'iEM', iconName: 'Ear' },
];

// No hardcoded products; the store renders only products added dynamically from the Admin Panel via Supabase
export const products: Product[] = [];
