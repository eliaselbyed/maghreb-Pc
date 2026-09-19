import { ShoppingCart, Search, Menu, User, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Menu className="h-6 w-6 text-zinc-400 sm:hidden" />
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Zap className="h-6 w-6 text-cyan-400" />
            <span className="text-xl font-black tracking-tighter text-white">
              MAGHREB <span className="text-cyan-400">PC</span>
            </span>
          </motion.div>
        </div>

        {/* Desktop Search */}
        <div className="hidden flex-1 items-center justify-center px-12 md:flex">
          <div className="group relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              placeholder="Search gear..."
              className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-cyan-400/50 focus:bg-white/10 focus:ring-1 focus:ring-cyan-400/50"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button className="text-zinc-400 transition-colors hover:text-cyan-400 md:hidden">
            <Search className="h-5 w-5" />
          </button>
          <button className="text-zinc-400 transition-colors hover:text-cyan-400">
            <User className="h-5 w-5" />
          </button>
          <button className="relative text-zinc-400 transition-colors hover:text-cyan-400">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-zinc-950">
              3
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}
