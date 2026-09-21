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
              className="pointer-events-auto w-full max-w-xs bg-zinc-950 border-r border-white/10 text-white flex flex-col shadow-2xl h-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-cyan-400" />
                  <span className="text-lg font-black tracking-tighter text-white">
                    MAGHREB <span className="text-cyan-400">PC</span>
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation links & Categories */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
                    Categories
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleCategoryClick(null)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                        selectedCategory === null
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>All Products</span>
                      <Package className="h-4 w-4 opacity-60" />
                    </button>

                    {categories.map((cat) => {
                      const isSelected = selectedCategory === cat.name;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat.name)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            isSelected
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                              : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span>{cat.name}</span>
                          {isSelected && (
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Moroccan Perks */}
                <div className="rounded-xl border border-white/5 bg-zinc-900/50 p-3.5 space-y-2.5 text-xs">
                  <div className="flex items-center gap-2.5 text-zinc-300">
                    <Truck className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                    <span>Livraison 24-48h partout au Maroc</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-zinc-300">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>Paiement à la livraison (COD)</span>
                  </div>
                </div>

                {/* Direct Contact */}
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                    Customer Service
                  </h3>
                  <a
                    href="https://wa.me/212770519490?text=Salam%20Maghreb%20PC%2C%20j%27ai%20une%20question"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-xs font-semibold"
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
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 py-2.5 px-4 font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Supabase Admin Panel</span>
                  </button>
                )}

                <a
                  href="tel:+212770519490"
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white py-2.5 px-4 font-bold text-xs uppercase tracking-wider transition-colors"
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
