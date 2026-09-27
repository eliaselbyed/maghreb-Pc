import { Zap } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export function Footer({ onOpenAdmin }: FooterProps = {}) {
  return (
    <footer className="border-t border-white/10 bg-[#030407] pt-16 pb-12 mt-20 relative overflow-hidden">
      {/* Subtle top edge neon line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/50 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Zap className="h-6 w-6 text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]" />
              <span className="font-display text-2xl font-black tracking-wider text-white uppercase">
                MAGHREB <span className="text-[#00f0ff] text-glow-cyan">PC</span>
              </span>
            </div>
            <p className="font-body text-sm text-zinc-400 leading-relaxed max-w-sm mb-4">
              Premium gaming peripherals and esports gear for competitive players in Morocco. Cash on delivery & nationwide express shipping.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 font-tech text-[10px] font-bold text-[#00f0ff] uppercase tracking-wider">
              <span>🇲🇦 Official Moroccan Gaming Store</span>
            </div>
          </div>

          {/* Links 1 */}
          <div className="md:ml-auto">
            <h4 className="font-display text-base font-bold uppercase tracking-wider text-white mb-4">Gear Catalog</h4>
            <ul className="space-y-2.5 font-tech text-xs sm:text-sm text-zinc-400 uppercase tracking-wider">
              <li><a href="#products-section" className="hover:text-[#00f0ff] transition-colors flex items-center gap-1.5"><span className="text-[#00f0ff]">›</span> Mice & Magnetic Docks</a></li>
              <li><a href="#products-section" className="hover:text-[#00f0ff] transition-colors flex items-center gap-1.5"><span className="text-[#00f0ff]">›</span> Mechanical Keyboards</a></li>
              <li><a href="#products-section" className="hover:text-[#00f0ff] transition-colors flex items-center gap-1.5"><span className="text-[#00f0ff]">›</span> Audio & Headsets</a></li>
              <li><a href="#products-section" className="hover:text-[#00f0ff] transition-colors flex items-center gap-1.5"><span className="text-[#00f0ff]">›</span> Battlestation Accessories</a></li>
            </ul>
          </div>

        </div>
        
        <div className="mt-14 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-tech text-xs text-zinc-500 uppercase tracking-wider">
          <p>
            &copy; {new Date().getFullYear()} MAGHREB PC GAMING STORE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-5">
            <span className="text-zinc-400 font-medium">⚡ Cash On Delivery</span>
            <span className="text-zinc-400 font-medium">🚀 Express 24-48h Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
