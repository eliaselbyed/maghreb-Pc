import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { products } from '../data';

interface HeroProps {
  onSelectProduct?: (product: Product) => void;
}

export function Hero({ onSelectProduct }: HeroProps) {
  const x11Product = products[0];

  return (
    <div className="relative overflow-hidden bg-zinc-950 py-6 sm:py-14 lg:py-20">
      {/* Neon Glow Effects */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[600px] rounded-full bg-cyan-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[120px]" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 tracking-wider mb-3 sm:mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              NEW COLLECTION LIVE
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl uppercase leading-[1.1]">
              Dominate <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                The Game
              </span>
            </h1>
            <p className="mt-3 sm:mt-5 text-sm sm:text-lg text-zinc-400 max-w-xl leading-relaxed">
              Equip yourself with elite, high-performance gear designed for precision, speed, and absolute victory. Moroccan gaming setups start here.
            </p>

            {/* Quick Hero CTA Button */}
            {onSelectProduct && x11Product && (
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onSelectProduct(x11Product)}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-5 py-3 text-xs sm:text-sm font-black uppercase tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Discover ATTACK SHARK X11</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-lg hidden lg:block"
          >
            <div
              onClick={() => onSelectProduct && x11Product && onSelectProduct(x11Product)}
              className="group relative aspect-square w-full rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl cursor-pointer hover:border-cyan-500/50 transition-all p-4 flex flex-col justify-between"
            >
              <div className="absolute top-4 left-4 z-20">
                <span className="rounded-full bg-cyan-500/90 text-zinc-950 px-3 py-1 text-[11px] font-black uppercase tracking-wider">
                  HOT DROP
                </span>
              </div>

              <img 
                src="/attack-shark-x11-dock.jpg" 
                alt="ATTACK SHARK X11 Tri-Mode Mouse" 
                referrerPolicy="no-referrer"
                className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent p-5 z-20 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold uppercase text-white group-hover:text-cyan-400 transition-colors">
                    ATTACK SHARK X11
                  </h4>
                  <p className="text-xs text-zinc-400">Tri-Mode with RGB Magnetic Charging Dock</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-cyan-400">288.74 DH</span>
                  <span className="block text-[10px] text-zinc-500 line-through">339.72 DH</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
