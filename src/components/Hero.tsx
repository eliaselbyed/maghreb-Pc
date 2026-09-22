import { ArrowRight } from 'lucide-react';
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
    <div className="relative w-full overflow-hidden bg-black border-b border-zinc-900">
      {/* Banner Container */}
      <div className="relative w-full min-h-[310px] sm:min-h-[380px] md:min-h-[440px] lg:min-h-[480px] flex items-center">
        
        {/* Background Desk Banner Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/gaming-desk-banner.jpg"
            alt="Gaming battlestation setup"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-[70%_center] sm:object-center"
          />
          {/* Subtle cinematic gradient overlays for high text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent sm:via-black/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </div>

        {/* Text & Action Overlay - exactly matching the screenshot */}
        <div className="relative z-10 w-full mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-8 sm:py-14">
          <div className="max-w-[280px] sm:max-w-md lg:max-w-xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.05]">
              DOMINATE<br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 bg-clip-text text-transparent">
                THE GAME
              </span>
            </h1>

            <p className="mt-3 sm:mt-4 text-xs sm:text-base text-zinc-300 font-normal leading-snug sm:leading-relaxed">
              Gaming gear for players who<br />
              take it seriously.
            </p>

            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                onClick={scrollToProducts}
                className="inline-flex items-center gap-2 rounded-full bg-[#00c8ff] hover:bg-cyan-300 text-black px-6 py-2.5 sm:px-7 sm:py-3 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,200,255,0.45)] active:scale-95 cursor-pointer"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

