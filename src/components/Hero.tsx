import { ArrowRight, Truck, Sparkles } from 'lucide-react';
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
    <div className="relative w-full overflow-hidden bg-black border-b border-white/10">
      {/* Banner Container */}
      <div className="relative w-full min-h-[320px] sm:min-h-[400px] md:min-h-[460px] lg:min-h-[500px] flex items-center">
        
        {/* Background Desk Banner Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/gaming-desk-banner.jpg"
            alt="Gaming battlestation setup"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-[70%_center] sm:object-center"
          />
          {/* Subtle cinematic gradient overlays for high text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent sm:via-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
        </div>

        {/* Text & Action Overlay with new esports fonts and vibrant vibe */}
        <div className="relative z-10 w-full mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-10 sm:py-16">
          <div className="max-w-[300px] sm:max-w-lg lg:max-w-2xl">
            {/* Tech tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[10px] sm:text-xs font-tech font-bold uppercase tracking-widest text-[#00f0ff] mb-3 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00f0ff] animate-ping" />
              <span>MOROCCO ESPORTS GEAR HEADQUARTERS</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[0.95]">
              DOMINATE<br />
              <span className="bg-gradient-to-r from-[#00f0ff] via-sky-300 to-[#a855f7] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,240,255,0.4)]">
                THE GAME
              </span>
            </h1>

            <p className="mt-3.5 sm:mt-4 text-xs sm:text-base text-zinc-300 font-medium leading-relaxed max-w-lg">
              Equip 100% authentic pro gaming gear at unbeatable prices.<br className="hidden sm:inline" /> Fast shipping & Cash on Delivery across Morocco.
            </p>

            <div className="mt-6 sm:mt-8 flex items-center gap-4 flex-wrap">
              <button
                type="button"
                onClick={scrollToProducts}
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#00c8ff] hover:from-cyan-300 hover:to-cyan-400 text-black px-7 py-3 text-xs sm:text-sm font-tech font-bold uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:shadow-[0_0_35px_rgba(0,240,255,0.8)] active:scale-95 cursor-pointer"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="h-4 w-4 stroke-[3]" />
              </button>

              <span className="text-xs text-zinc-400 font-tech uppercase tracking-wider hidden sm:inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                In Stock & Ready to Ship
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Trust & Guarantee Ticker Bar */}
      <div className="border-t border-white/10 bg-[#06080e]/95 backdrop-blur-md py-3 px-4">
        <div className="mx-auto max-w-2xl flex flex-row flex-nowrap items-center justify-center gap-4 sm:gap-8 md:gap-12 text-zinc-300 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            <Truck className="h-4 w-4 text-[#00f0ff] flex-shrink-0" />
            <span className="font-tech text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-300 whitespace-nowrap">
              Cash on Delivery (COD)
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            <Sparkles className="h-4 w-4 text-[#a855f7] flex-shrink-0" />
            <span className="font-tech text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-300 whitespace-nowrap">
              24-48h Morocco Dispatch
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


