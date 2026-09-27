import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Plus,
  Minus,
  ShoppingCart,
  MessageCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Check,
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onOpenCart?: () => void;
}

export function ProductDetailPage({
  product,
  onBack,
  onAddToCart,
  onOpenCart,
}: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Gallery array
  const gallery = product.gallery && product.gallery.length > 0 
    ? product.gallery 
    : [product.image];

  // Ensure immediate positioning at top on mount without smooth scrolling
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [product.id]);

  // Handle escape key to go back or close zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onBack();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed, onBack]);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // WhatsApp order link
  const generateWhatsAppLink = () => {
    const totalPrice = (product.price * quantity).toFixed(2);
    const message = `Hello Maghreb PC! 🇲🇦\nI would like to order:\n\n• Product: ${product.fullName || product.name}\n• Quantity: ${quantity}\n• Total Price: ${totalPrice} DH (Cash on Delivery)\n\nPlease confirm availability and delivery details. Thank you!`;
    return `https://wa.me/212770519490?text=${encodeURIComponent(message)}`;
  };

  const displaySavings = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discountPercent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="min-h-screen bg-[#030407] text-white pb-20 pt-6"
    >
      {/* Top Navigation & Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 rounded-xl bg-[#0b0e17] border border-white/10 px-4 py-2 font-tech text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:border-[#00f0ff]/50 hover:bg-[#121726] transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-[#00f0ff]" />
            <span>Back to Store</span>
          </button>

          <nav className="hidden sm:flex items-center gap-2 font-tech text-xs text-zinc-400 uppercase tracking-wider">
            <button onClick={onBack} className="hover:text-white transition-colors cursor-pointer">
              Home
            </button>
            <span>/</span>
            <span className="text-zinc-500">{product.category}</span>
            <span>/</span>
            <span className="text-[#00f0ff] font-bold truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Product Image Showcase */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/10 bg-[#070910] shadow-[0_0_35px_rgba(0,0,0,0.8)] flex items-center justify-center p-4 sm:p-8 group">
              {/* Radial spotlight backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,240,255,0.15)_0%,_transparent_70%)] pointer-events-none" />

              {/* Discount / Sale Badge */}
              {displaySavings && (
                <div className="absolute top-4 left-4 z-20">
                  <div className="rounded-md bg-gradient-to-r from-red-600 to-rose-600 text-white font-tech font-bold text-xs px-3 py-1.5 shadow-[0_0_15px_rgba(220,38,38,0.5)] uppercase tracking-wider">
                    SAVE {displaySavings}%
                  </div>
                </div>
              )}

              {/* Main Image */}
              <motion.img
                key={activeImageIndex}
                initial={{ opacity: 0.8, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={gallery[activeImageIndex]}
                alt={product.fullName || product.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-contain select-none relative z-10"
              />

              {/* Slide Navigation Arrows */}
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/80 text-zinc-300 border border-white/15 hover:text-white hover:border-[#00f0ff] hover:bg-black transition-all shadow-lg z-20 cursor-pointer"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/80 text-zinc-300 border border-white/15 hover:text-white hover:border-[#00f0ff] hover:bg-black transition-all shadow-lg z-20 cursor-pointer"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Zoom trigger icon */}
              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                aria-label="Enlarge image"
                className="absolute right-4 bottom-4 flex h-9 w-9 items-center justify-center rounded-xl bg-black/80 text-zinc-400 hover:text-[#00f0ff] border border-white/10 backdrop-blur-sm transition-colors z-20 cursor-pointer"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>

            {/* Thumbnail selector */}
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden border p-1 bg-[#0b0e17] transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#00f0ff] ring-2 ring-[#00f0ff]/30 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                        : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Guarantees bar */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b0e17] p-3.5 shadow-sm">
                <Truck className="h-5 w-5 text-[#00f0ff] flex-shrink-0" />
                <div>
                  <p className="font-tech text-xs font-bold uppercase tracking-wider text-zinc-200">Express Delivery</p>
                  <p className="font-tech text-[10px] text-zinc-400 uppercase">24-48h Morocco-Wide</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b0e17] p-3.5 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-[#00ff88] flex-shrink-0" />
                <div>
                  <p className="font-tech text-xs font-bold uppercase tracking-wider text-zinc-200">Cash on Delivery</p>
                  <p className="font-tech text-[10px] text-zinc-400 uppercase">Inspect Before Paying</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Information, Features & Price */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            
            {/* Title & Tagline */}
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#00f0ff]/10 border border-[#00f0ff]/30 font-tech text-[10px] font-bold uppercase tracking-widest text-[#00f0ff] mb-2.5">
                <span>{product.category}</span>
                <span>•</span>
                <span>OFFICIAL DROP</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                {product.fullName || product.name}
              </h1>

              {product.tagline && (
                <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed font-body">
                  {product.tagline}
                </p>
              )}

              {/* Rating and Reviews */}
              <div className="mt-3.5 flex items-center gap-3 font-tech">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-zinc-300">
                  {product.reviewsCount || 731} verified reviews
                </span>
                <span className="text-zinc-600">•</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                  In Stock (Morocco)
                </span>
              </div>
            </div>

            {/* Clean Features Bullet List */}
            {product.features && product.features.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-[#0b0e17] p-5 shadow-lg">
                <h3 className="font-tech text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
                  Key Specifications & Highlights
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-zinc-300 font-body">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#00ff88] flex-shrink-0" />
                      <span className="font-medium text-zinc-200">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price Box */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0e1320] via-[#090b12] to-black p-6 shadow-xl relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-[#00f0ff]/10 blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
                <div>
                  <div className="font-tech text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                    Official Morocco Price
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-sky-300 to-white tracking-tight">
                      {product.price}
                    </span>
                    <span className="font-tech text-base sm:text-lg font-bold text-[#00f0ff]">
                      DH
                    </span>

                    {product.originalPrice && (
                      <div className="ml-3 flex flex-col font-tech">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500">MSRP</span>
                        <span className="text-sm font-medium text-zinc-500 line-through">
                          {product.originalPrice} DH
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {displaySavings && (
                  <div className="rounded-xl bg-[#00ff88]/15 border border-[#00ff88]/40 px-3.5 py-2 text-center">
                    <span className="block font-tech text-[10px] font-bold text-[#00ff88] uppercase tracking-widest">
                      Special Drop
                    </span>
                    <span className="font-display text-base font-black text-white">
                      SAVE {displaySavings}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="font-tech text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Quantity:
                </span>
                <div className="flex items-center rounded-xl border border-white/10 bg-[#0b0e17] p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2 text-zinc-400 hover:text-white rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 text-center font-tech text-sm font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onAddToCart(product, quantity)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00c8ff] hover:from-cyan-300 hover:to-cyan-400 text-black py-4 px-6 font-tech font-bold uppercase text-sm tracking-wider shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all cursor-pointer active:scale-98"
                >
                  <ShoppingCart className="h-4 w-4 stroke-[2.5]" />
                  <span>Add to Cart</span>
                </button>

                <a
                  href={generateWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#00ff88]/15 border border-[#00ff88]/40 hover:bg-[#00ff88]/25 text-[#00ff88] py-4 px-6 font-tech font-bold uppercase text-sm tracking-wider shadow-[0_0_20px_rgba(0,255,136,0.15)] transition-all cursor-pointer active:scale-98"
                >
                  <MessageCircle className="h-4 w-4 stroke-[2.5]" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>

              {/* Share & Link Copy */}
              <div className="flex items-center justify-between pt-2 text-xs text-zinc-400">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-[#00f0ff] transition-colors cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#00ff88]" />
                      <span className="text-[#00ff88] font-semibold">Link copied to clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Share product</span>
                    </>
                  )}
                </button>

                <span className="text-zinc-500">Free replacement on defective items</span>
              </div>
            </div>

            {/* Description Paragraph */}
            {product.description && (
              <div className="border-t border-white/10 pt-6 space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                  Description
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-body">
                  {product.description}
                </p>
              </div>
            )}

            {/* Technical Specifications Table */}
            {product.specs && product.specs.length > 0 && (
              <div className="border-t border-white/10 pt-6 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                  Technical Specifications
                </h3>
                <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-zinc-900/40 text-xs overflow-hidden">
                  {product.specs.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-3 p-3">
                      <span className="font-semibold text-zinc-400">{item.label}</span>
                      <span className="col-span-2 text-zinc-200 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Lightbox / Zoom modal */}
      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md cursor-zoom-out"
        >
          <img
            src={gallery[activeImageIndex]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}
    </motion.div>
  );
}
