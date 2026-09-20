import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { CartItem, Product } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onSelectItem?: (product: Product) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSelectItem,
}: CartDrawerProps) {
  // Listen for Escape key to close cart
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

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const generateWhatsAppMessage = () => {
    if (items.length === 0) return '';
    const itemLines = items
      .map(
        (item) =>
          `• ${item.quantity}x ${item.product.name} - ${item.product.price * item.quantity} DH`
      )
      .join('\n');
    const msg = `Salam Maghreb PC, I would like to place an order:\n\n${itemLines}\n\nTotal: ${subtotal} DH\nPayment: Cash on Delivery\nPlease confirm my order.`;
    return `https://wa.me/212770519490?text=${encodeURIComponent(msg)}`;
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

          <div className="fixed inset-y-0 right-0 flex w-full max-w-full justify-end pointer-events-none">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="pointer-events-auto w-full max-w-md bg-zinc-950 border-l border-white/10 text-white flex flex-col shadow-2xl h-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-white/10 bg-zinc-950/80">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-cyan-400" />
                  <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-white">
                    Your Cart ({totalItems})
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600 mb-4 border border-white/5">
                      <ShoppingBag className="h-8 w-8" />
                    </div>
                    <h3 className="text-base font-bold text-zinc-300">Your cart is empty</h3>
                    <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                      Looks like you haven't added any gear yet. Check out our featured drops!
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-6 rounded-md bg-cyan-500 px-5 py-2 text-xs font-bold text-zinc-950 hover:bg-cyan-400 transition-colors uppercase tracking-wider"
                    >
                      Browse Store
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-xs text-zinc-400 pb-1">
                      <span>Products</span>
                      <button
                        onClick={onClearCart}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        Clear all
                      </button>
                    </div>

                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-3 p-3 rounded-xl bg-zinc-900/60 border border-white/5 items-center hover:border-cyan-500/30 transition-colors"
                      >
                        <div
                          onClick={() => {
                            if (onSelectItem) {
                              onSelectItem(item.product);
                              onClose();
                            }
                          }}
                          className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-950 p-1 border border-white/10 cursor-pointer"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-contain rounded"
                          />
                        </div>

                        <div
                          onClick={() => {
                            if (onSelectItem) {
                              onSelectItem(item.product);
                              onClose();
                            }
                          }}
                          className="flex-1 min-w-0 pr-1 cursor-pointer"
                        >
                          <h4 className="text-xs font-bold text-white truncate uppercase hover:text-cyan-400 transition-colors">
                            {item.product.name}
                          </h4>
                          <span className="text-[10px] text-zinc-500 block">
                            {item.product.category}
                          </span>
                          <span className="text-sm font-black text-cyan-400 mt-1 block">
                            {item.product.price} DH
                          </span>
                        </div>

                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                            title="Remove"
                            aria-label={`Remove ${item.product.name} from cart`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>

                          <div className="flex items-center border border-white/10 rounded-md bg-zinc-950">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, -1)}
                              className="px-2 py-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-xs"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-white min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, 1)}
                              className="px-2 py-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-xs"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-white/10 p-4 sm:p-5 bg-zinc-900/50 space-y-3">
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-zinc-400 text-xs">
                      <span>Delivery (Morocco)</span>
                      <span className="text-emerald-400 font-semibold">Cash On Delivery</span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-base pt-1">
                      <span>Subtotal</span>
                      <span className="text-cyan-400 text-xl font-black">{subtotal} DH</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-zinc-200 py-3 px-3.5 font-bold text-xs uppercase tracking-wider transition-colors"
                      aria-label="Continue shopping"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back</span>
                    </button>

                    <a
                      href={generateWhatsAppMessage()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 py-3 px-4 font-black uppercase text-xs sm:text-sm tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                    >
                      <span>Order via WhatsApp</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>

                  <p className="text-[11px] text-center text-zinc-500">
                    Fast delivery within 24-48h across all Moroccan cities.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
