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

export const products: Product[] = [
  // Mice
  { id: 'm1', name: 'ATTACK SHARK X11', price: 299, category: 'Mouse', image: 'https://images.unsplash.com/photo-1615663245857-ac1eeb536628?w=800&q=80', badge: 'NEW' },
  { id: 'm2', name: 'ATTACK SHARK V6', price: 349, category: 'Mouse', image: 'https://images.unsplash.com/photo-1527814050087-37938154794f?w=800&q=80' },
  { id: 'm3', name: 'ATTACK SHARK V3 PRO', price: 399, originalPrice: 450, category: 'Mouse', image: 'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=800&q=80', badge: 'SALE' },
  { id: 'm4', name: 'ATTACK SHARK X11 SE', price: 249, category: 'Mouse', image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800&q=80' },
  { id: 'm5', name: 'ATTACK SHARK G3 PRO', price: 429, category: 'Mouse', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80' },
  { id: 'm6', name: 'ATTACK SHARK R1', price: 279, category: 'Mouse', image: 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?w=800&q=80' },
  { id: 'm7', name: 'ATTACK SHARK R5 ULTRA', price: 499, category: 'Mouse', image: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&q=80', badge: 'PRO' },
  { id: 'm8', name: 'ATTACK SHARK X8 ULTRA', price: 549, category: 'Mouse', image: 'https://images.unsplash.com/photo-1517420879524-86d64ac2f339?w=800&q=80' },

  // Keyboards
  { id: 'k1', name: 'ATTACK SHARK X68 HE', price: 599, category: 'Keyboard', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80', badge: 'HOT' },
  { id: 'k2', name: 'ATTACK SHARK R82 HE', price: 649, category: 'Keyboard', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80' },
  { id: 'k3', name: 'ATTACK SHARK X68 MAX', price: 699, originalPrice: 799, category: 'Keyboard', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80', badge: 'SALE' },
  { id: 'k4', name: 'ZIYOULANG T8', price: 349, category: 'Keyboard', image: 'https://images.unsplash.com/photo-1606148386121-50e59c869fb4?w=800&q=80' },

  // Others
  { id: 'o1', name: 'MICRO GM7', price: 279, category: 'Microphone', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80' },
  { id: 'o2', name: 'NORTH BAYOU F80', price: 349, category: 'Monitor Arm', image: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&q=80' },
  { id: 'o3', name: 'MONITOR LIGHT RGB', price: 199, category: 'Light', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80' },
];
