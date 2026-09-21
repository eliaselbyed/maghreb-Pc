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
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onClick={handleCardClick}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900/50 transition-all hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(34,211,238,0.15)] cursor-pointer"
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
      <div className="relative aspect-square overflow-hidden bg-zinc-950 p-3 sm:p-6 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10" />
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-700">
            <Package className="w-10 h-10 mb-1" />
            <span className="text-[10px] uppercase font-bold text-zinc-600">No Image</span>
          </div>
        )}
        
        {/* Quick Action Buttons - Appears on Hover */}
        <div className="absolute bottom-2 sm:bottom-3 left-0 right-0 z-20 flex translate-y-8 justify-center gap-2 px-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hidden sm:flex">
          {onAddToCart && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-md bg-cyan-500 px-3 py-2 text-xs font-bold text-zinc-950 hover:bg-cyan-400 transition-colors uppercase shadow-[0_0_10px_rgba(34,211,238,0.4)]"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              + Cart
            </button>
          )}
          <a 
            href={`https://wa.me/212770519490?text=${encodeURIComponent("Hello, I would like to order: " + product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-md bg-white px-3 py-2 text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition-colors uppercase"
          >
            Order
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <h3 className="text-xs sm:text-base font-bold uppercase tracking-tight text-white line-clamp-2 mb-1 group-hover:text-cyan-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-[10px] sm:text-sm text-zinc-500">{product.category}</p>
        
        <div className="mt-auto pt-2 sm:pt-4 flex items-center justify-between gap-1">
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-sm sm:text-xl font-black text-cyan-400">{product.price} <span className="text-[10px] sm:text-sm">DH</span></span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-sm font-medium text-zinc-500 line-through">
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
                className="flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-cyan-400 p-1.5 border border-white/10"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
              </button>
            )}
            <a
              href={`https://wa.me/212770519490?text=${encodeURIComponent("Hello, I would like to order: " + product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center rounded bg-cyan-500 px-2 py-1 text-[10px] font-bold tracking-wider text-zinc-950 hover:bg-cyan-400"
            >
              ORDER
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
