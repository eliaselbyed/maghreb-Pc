import { Zap } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export function Footer({ onOpenAdmin }: FooterProps = {}) {
  return (
    <footer className="border-t border-white/5 bg-zinc-950 pt-16 pb-8 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Zap className="h-6 w-6 text-cyan-400" />
              <span className="text-xl font-black tracking-tighter text-white">
                MAGHREB <span className="text-cyan-400">PC</span>
              </span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Premium gaming peripherals and setups for competitive players. Level up your battlestation today.
            </p>
          </div>

          {/* Links 1 */}
          <div className="md:ml-auto">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Products</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><a href="#products-section" className="hover:text-cyan-400 transition-colors">Mice & Keyboards</a></li>
              <li><a href="#products-section" className="hover:text-cyan-400 transition-colors">Audio & Headsets</a></li>
              <li><a href="#products-section" className="hover:text-cyan-400 transition-colors">Streaming Gear</a></li>
              <li><a href="#products-section" className="hover:text-cyan-400 transition-colors">Monitor Arms</a></li>
            </ul>
          </div>

        </div>
        
        <div className="mt-16 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} Maghreb PC Gaming Store. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
