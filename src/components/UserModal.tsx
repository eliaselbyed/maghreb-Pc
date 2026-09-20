import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Phone, MessageCircle, Truck, Package, ShieldCheck } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserModal({ isOpen, onClose }: UserModalProps) {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-6 text-white shadow-2xl z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-3.5 pb-5 border-b border-white/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Maghreb PC Customer Hub
                </h3>
                <p className="text-xs text-zinc-400">
                  Direct support & Moroccan order tracking
                </p>
              </div>
            </div>

            {/* Fast Actions */}
            <div className="py-5 space-y-3">
              <a
                href="https://wa.me/212770519490?text=Salam%2C%20je%20souhaite%20suivre%20ma%20commande%20Maghreb%20PC"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900 border border-white/5 hover:border-cyan-500/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Package className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                      Track My Order
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Send your order reference on WhatsApp
                    </div>
                  </div>
                </div>
                <MessageCircle className="h-4 w-4 text-emerald-400" />
              </a>

              <a
                href="https://wa.me/212770519490?text=Salam%20Maghreb%20PC%2C%20j%27ai%20besoin%20d%27assistance"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900 border border-white/5 hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      Chat on WhatsApp
                    </div>
                    <div className="text-[11px] text-zinc-400">+212 770 519 490</div>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Active
                </span>
              </a>

              <a
                href="tel:+212770519490"
                className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900 border border-white/5 hover:border-zinc-700 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">Call Service Client</div>
                    <div className="text-[11px] text-zinc-400">Dispo du Lun au Sam</div>
                  </div>
                </div>
              </a>
            </div>

            {/* Moroccan Service Badge */}
            <div className="rounded-xl bg-zinc-900/60 border border-white/5 p-3.5 space-y-2 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-cyan-400" />
                <span>Expédition rapide dans tout le Maroc (Amana / CTM / Livraisons locales)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Paiement à la réception après vérification</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 text-center">
              <button
                onClick={onClose}
                className="text-xs text-zinc-400 hover:text-white transition-colors"
              >
                Close Hub
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
