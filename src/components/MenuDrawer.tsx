import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Phone, ShieldCheck, Truck, Package, MessageCircle } from 'lucide-react';
import { categories } from '../data';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  onOpenAdmin?: () => void;
}

export function MenuDrawer({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  onOpenAdmin,
}: MenuDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCategoryClick = (cat: string | null) => {
    onSelectCategory(cat);
    onClose();
    // Smooth scroll to products
    const productSection = document.getElementById('products-section');
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 left-0 flex w-full max-w-full justify-start pointer-events-none">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="pointer-events-auto w-full max-w-xs bg-[#080a12] border-r border-white/10 text-white flex flex-col shadow-2xl h-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#06080e]">
                <div className="flex items-center gap-2.5">
                  <Zap className="h-6 w-6 text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]" />
                  <span className="font-display text-xl font-black tracking-wider text-white uppercase">
                    MAGHREB <span className="text-[#00f0ff] text-glow-cyan">PC</span>
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation links & Categories */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <div>
                  <h3 className="font-tech text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
                    Gear Categories
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleCategoryClick(null)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-tech text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        selectedCategory === null
                          ? 'bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/40'
                          : 'text-zinc-300 hover:bg-white/5'
                      }`}
                    >
                      <span>All Products</span>
                      <Package className={`h-4 w-4 ${selectedCategory === null ? 'text-[#00f0ff]' : 'text-zinc-500'}`} />
                    </button>

                    {categories.map((cat) => {
                      const isSelected = selectedCategory === cat.name;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat.name)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-tech text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/40 font-bold'
                              : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span>{cat.name}</span>
                          {isSelected && (
                            <span className="h-2 w-2 rounded-full bg-[#00f0ff] animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Moroccan Perks */}
                <div className="rounded-2xl border border-white/10 bg-[#0b0e17] p-4 space-y-3 font-tech text-xs">
                  <div className="flex items-center gap-2.5 text-zinc-300">
                    <Truck className="h-4 w-4 text-[#00f0ff] flex-shrink-0" />
                    <span className="uppercase tracking-wider">Fast 24-48h Delivery Morocco</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-zinc-300">
                    <ShieldCheck className="h-4 w-4 text-[#00ff88] flex-shrink-0" />
                    <span className="uppercase tracking-wider">Cash on Delivery (COD)</span>
                  </div>
                </div>

                {/* Direct Contact */}
                <div>
                  <h3 className="font-tech text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                    Direct WhatsApp Support
                  </h3>
                  <a
                    href="https://wa.me/212770519490?text=Salam%20Maghreb%20PC%2C%20j%27ai%20une%20question"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-[#00ff88]/15 border border-[#00ff88]/30 font-tech text-xs font-bold text-[#00ff88] uppercase tracking-wider hover:bg-[#00ff88]/25 transition-all shadow-[0_0_15px_rgba(0,255,136,0.15)]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp: +212 770 519 490</span>
                  </a>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="p-5 border-t border-white/10 bg-zinc-900/30 space-y-2">
                {onOpenAdmin && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdmin();
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/15 text-white py-2.5 px-4 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Supabase Admin Panel</span>
                  </button>
                )}

                <a
                  href="tel:+212770519490"
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white py-2.5 px-4 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Call Support</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
