import { useState } from 'react';
import { ShoppingCart, Search, Menu, User, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenMenu: () => void;
  onOpenUser: () => void;
  onOpenAdmin?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onResetFilters: () => void;
  isSearchActive?: boolean;
  onSearchActiveChange?: (active: boolean) => void;
}

export function Navbar({
  cartCount,
  onOpenCart,
  onOpenMenu,
  onOpenUser,
  onOpenAdmin,
  searchQuery,
  onSearchChange,
  onResetFilters,
  isSearchActive = false,
  onSearchActiveChange,
}: NavbarProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleMobileToggle = () => {
    const next = !showMobileSearch;
    setShowMobileSearch(next);
    onSearchActiveChange?.(next);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Menu & Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenMenu}
            className="p-1.5 -ml-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors sm:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <button
            onClick={onResetFilters}
            className="flex items-center gap-2 group text-left focus:outline-none"
            aria-label="Maghreb PC Home"
          >
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <Zap className="h-6 w-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-xl font-black tracking-tighter text-white">
                MAGHREB <span className="text-cyan-400">PC</span>
              </span>
            </motion.div>
          </button>
        </div>

        {/* Center: Desktop Search */}
        <div className="hidden flex-1 items-center justify-center px-8 md:flex">
          <div className="group relative w-full max-w-md">
            <Search className={`absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
              isSearchActive ? 'text-cyan-400' : 'text-zinc-500 group-focus-within:text-cyan-400'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => onSearchActiveChange?.(true)}
              onClick={() => onSearchActiveChange?.(true)}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (!isSearchActive) onSearchActiveChange?.(true);
              }}
              placeholder="Search mice, keyboards, gear..."
              className={`w-full rounded-full border py-2 pl-10 pr-16 text-sm text-white placeholder-zinc-500 outline-none transition-all ${
                isSearchActive
                  ? 'border-cyan-400/80 bg-zinc-900 shadow-[0_0_20px_rgba(34,211,238,0.2)] ring-1 ring-cyan-400/50'
                  : 'border-white/10 bg-white/5 focus:border-cyan-400/50 focus:bg-white/10 focus:ring-1 focus:ring-cyan-400/50'
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  onClick={() => onSearchChange('')}
                  className="text-zinc-400 hover:text-white p-0.5 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Clear search"
                  title="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : isSearchActive ? (
                <button
                  onClick={() => onSearchActiveChange?.(false)}
                  className="text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                  title="Close search mode (ESC)"
                >
                  ESC
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Mobile Search Toggle */}
          <button
            onClick={handleMobileToggle}
            className={`p-2 rounded-lg text-zinc-400 transition-colors hover:text-cyan-400 hover:bg-zinc-900 md:hidden ${
              showMobileSearch || isSearchActive || searchQuery ? 'text-cyan-400 bg-zinc-900/80' : ''
            }`}
            aria-label="Toggle search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* User Account / Help Hub */}
          <button
            onClick={onOpenUser}
            className="p-2 rounded-lg text-zinc-400 transition-colors hover:text-cyan-400 hover:bg-zinc-900"
            aria-label="Customer service & profile hub"
            title="Customer Hub"
          >
            <User className="h-5 w-5" />
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-lg text-zinc-400 transition-colors hover:text-cyan-400 hover:bg-zinc-900"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-black text-zinc-950 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
        </div>

      </div>

      {/* Expandable Mobile Search Bar */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-white/5 bg-zinc-950/95 px-4 py-3 md:hidden overflow-hidden"
          >
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-cyan-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onFocus={() => onSearchActiveChange?.(true)}
                onClick={() => onSearchActiveChange?.(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  onSearchActiveChange?.(true);
                }}
                placeholder="Search gear by name or category..."
                className="w-full rounded-lg border border-cyan-400/50 bg-zinc-900 py-2 pl-9 pr-14 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              <div className="absolute right-2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="text-zinc-400 hover:text-white p-1"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowMobileSearch(false);
                    if (!searchQuery) {
                      onSearchActiveChange?.(false);
                    }
                  }}
                  className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 hover:text-white px-2 py-1 rounded bg-zinc-800"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
