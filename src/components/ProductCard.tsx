import { motion } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import type { JSX, Key } from 'react';

interface ProductCardProps {
  key?: Key;
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900/50 transition-all hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(34,211,238,0.15)]"
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute left-3 top-3 z-10">
          <span className="inline-flex items-center rounded-sm bg-cyan-500 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-950">
            {product.badge}
          </span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-zinc-950 p-3 sm:p-6">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10" />
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110 mix-blend-lighten"
        />
        
        {/* Quick Add Button - Appears on Hover */}
        <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 z-20 flex translate-y-8 justify-center opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hidden sm:flex">
          <a 
            href={`https://wa.me/212770519490?text=${encodeURIComponent("Hello, I would like to order: " + product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-3/4 items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-zinc-200"
          >
            <ShoppingCart className="h-4 w-4" />
            ORDER NOW
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <h3 className="text-xs sm:text-base font-bold uppercase tracking-tight text-white line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="text-[10px] sm:text-sm text-zinc-500">{product.category}</p>
        
        <div className="mt-auto pt-2 sm:pt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-sm sm:text-xl font-black text-cyan-400">{product.price} <span className="text-[10px] sm:text-sm">DH</span></span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-sm font-medium text-zinc-500 line-through">
                {product.originalPrice} DH
              </span>
            )}
          </div>
          <a
            href={`https://wa.me/212770519490?text=${encodeURIComponent("Hello, I would like to order: " + product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded bg-cyan-500 px-2 py-1 text-[10px] font-bold tracking-wider text-zinc-950 sm:hidden"
          >
            ORDER
          </a>
        </div>
      </div>
    </motion.div>
  );
}
