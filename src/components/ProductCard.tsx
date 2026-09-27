import { motion } from 'motion/react';
import { ShoppingCart, Package } from 'lucide-react';
import { Product } from '../types';
import type { JSX, Key } from 'react';

interface ProductCardProps {
  key?: Key;
  product: Product;
  index: number;
  onAddToCart?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

export function ProductCard({
  product,
  index,
  onAddToCart,
  onSelectProduct,
}: ProductCardProps): JSX.Element {
  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  return (
    <motion.div
      id={`product-card-${product.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      onClick={handleCardClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0e17] transition-all duration-300 hover:border-[#00f0ff]/60 hover:shadow-[0_0_30px_rgba(0,240,255,0.22)] cursor-pointer"
    >
      {/* Corner Tech Accent Lines */}
      <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none overflow-hidden z-20">
        <div className="absolute top-0 right-0 w-[1px] h-3 bg-[#00f0ff] opacity-40 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-0 right-0 w-3 h-[1px] bg-[#00f0ff] opacity-40 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Badge */}
      <div className="absolute left-3 top-3 z-20 flex flex-col gap-1">
        {product.badge ? (
          <span className="inline-flex items-center rounded-md bg-[#00f0ff]/20 border border-[#00f0ff]/50 px-2 py-0.5 font-tech text-[10px] font-bold uppercase tracking-wider text-[#00f0ff] backdrop-blur-md">
            {product.badge}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#071328]/90 border border-sky-400/50 px-2 py-0.5 font-tech text-[9px] font-bold uppercase tracking-wider text-sky-400 backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            IN STOCK
          </span>
        )}
      </div>

      {/* Image Container with Ambient Spotlight */}
      <div className="relative aspect-square overflow-hidden bg-[#070910] p-4 sm:p-7 flex items-center justify-center">
        {/* Radial ambient spotlight for dramatic product illumination */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,240,255,0.12)_0%,_transparent_70%)] opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e17] via-transparent to-transparent opacity-80 z-10" />
        
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-108 relative z-10"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-700 relative z-10">
            <Package className="w-10 h-10 mb-1 text-zinc-600" />
            <span className="font-tech text-[10px] uppercase font-bold text-zinc-500">Gear Image</span>
          </div>
        )}
        
        {/* Quick Action Buttons - Appears on Hover */}
        <div className="absolute bottom-2.5 sm:bottom-3 left-0 right-0 z-30 flex translate-y-8 justify-center gap-2 px-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hidden sm:flex">
          {onAddToCart && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#00f0ff] px-3 py-2 font-tech text-xs font-bold text-black hover:bg-cyan-300 transition-all uppercase shadow-[0_0_15px_rgba(0,240,255,0.5)] cursor-pointer"
            >
              <ShoppingCart className="h-3.5 w-3.5 stroke-[2.5]" />
              + Cart
            </button>
          )}
          <a 
            href={`https://wa.me/212770519490?text=${encodeURIComponent("Hello, I would like to order: " + product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 font-tech text-xs font-bold text-black hover:bg-zinc-200 transition-colors uppercase cursor-pointer"
          >
            Order
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-5 bg-[#0b0e17]">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="font-tech text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {product.category}
          </span>
        </div>

        <h3 className="font-display text-sm sm:text-lg font-bold uppercase tracking-wide text-white line-clamp-2 mb-2 group-hover:text-[#00f0ff] transition-colors leading-snug">
          {product.name}
        </h3>
        
        <div className="mt-auto pt-3 flex items-center justify-between gap-1 border-t border-white/5">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-sky-300 to-white tracking-tight">
              {product.price}
            </span>
            <span className="font-tech text-[10px] sm:text-xs font-bold text-[#00f0ff]">
              DH
            </span>
            {product.originalPrice && (
              <span className="font-tech text-[10px] sm:text-xs font-medium text-zinc-500 line-through ml-1">
                {product.originalPrice} DH
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 sm:hidden">
            {onAddToCart && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                aria-label="Add to cart"
                className="flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[#00f0ff] p-2 border border-white/10 cursor-pointer"
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            )}
            <a
              href={`https://wa.me/212770519490?text=${encodeURIComponent("Hello, I would like to order: " + product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center rounded-lg bg-[#00f0ff] px-2.5 py-1.5 font-tech text-[11px] font-bold tracking-wider text-black hover:bg-cyan-300 cursor-pointer"
            >
              ORDER
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
