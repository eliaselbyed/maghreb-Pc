import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ShieldCheck, Zap, PackageCheck } from 'lucide-react';
import { Product } from '../types';

interface HeroProps {
  featuredProduct?: Product | null;
  onSelectProduct?: (product: Product) => void;
}

export function Hero({ featuredProduct, onSelectProduct }: HeroProps) {
  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
              OFFICIAL GAMING STORE
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl uppercase leading-[1.1]">
              Dominate <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                The Game
              </span>
            </h1>
            <p className="mt-3 sm:mt-5 text-sm sm:text-lg text-zinc-400 max-w-xl leading-relaxed">
              Equip yourself with elite, high-performance gear designed for precision, speed, and absolute victory. Authentic gaming setups delivered across Morocco.
            </p>

            {/* Quick Hero CTA Button */}
            <div className="mt-6 flex flex-wrap gap-3">
              {featuredProduct && onSelectProduct ? (
                <button
                  type="button"
                  onClick={() => onSelectProduct(featuredProduct)}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-5 py-3 text-xs sm:text-sm font-black uppercase tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Discover {featuredProduct.name}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={scrollToProducts}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-5 py-3 text-xs sm:text-sm font-black uppercase tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Explore Catalog</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>

          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-lg hidden lg:block"
          >
            {featuredProduct ? (
              <div
                onClick={() => onSelectProduct && onSelectProduct(featuredProduct)}
                className="group relative aspect-square w-full rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl cursor-pointer hover:border-cyan-500/50 transition-all"
              >
                <div className="absolute top-4 left-4 z-20">
                  <span className="rounded-full bg-cyan-500/90 text-zinc-950 px-3 py-1 text-[11px] font-black uppercase tracking-wider">
                    {featuredProduct.badge || 'FEATURED'}
                  </span>
                </div>

                <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center">
                  {featuredProduct.image ? (
                    <img 
                      src={featuredProduct.image} 
                      alt={featuredProduct.name} 
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-600">
                      <Zap className="w-16 h-16 text-cyan-400/50 mb-2" />
                      <span className="text-xs uppercase tracking-widest text-zinc-400">Authentic Gear</span>
                    </div>
                  )}
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent p-5 z-20 flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold uppercase text-white group-hover:text-cyan-400 transition-colors">
                      {featuredProduct.name}
                    </h4>
                    <p className="text-xs text-zinc-400">{featuredProduct.category || 'Gaming Hardware'}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-cyan-400">{featuredProduct.price.toFixed(2)} DH</span>
                    {featuredProduct.originalPrice && (
                      <span className="block text-[10px] text-zinc-500 line-through">
                        {featuredProduct.originalPrice.toFixed(2)} DH
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div 
                onClick={scrollToProducts}
                className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/60 p-8 flex flex-col justify-between shadow-2xl cursor-pointer hover:border-cyan-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                    PRO ESPORTS READY
                  </span>
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                </div>

                <div className="my-auto text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Zap className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">Morocco's Pro Gear Hub</h3>
                  <p className="text-xs text-zinc-400 mt-2 max-w-xs mx-auto leading-relaxed">
                    Explore high-performance mice, mechanical keyboards, audio, and desk accessories curated for competitive dominance.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5 text-[11px] text-zinc-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <PackageCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Fast Delivery Morocco</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>100% Genuine Quality</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
