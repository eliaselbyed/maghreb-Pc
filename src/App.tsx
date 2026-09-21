import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ShoppingBag, X, RefreshCw } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { ProductCard } from './components/ProductCard';
import { ProductDetailPage } from './components/ProductDetailPage';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { MenuDrawer } from './components/MenuDrawer';
import { UserModal } from './components/UserModal';
import { AdminPanel } from './components/AdminPanel';
import { products } from './data';
import { CartItem, Product } from './types';
import { fetchProducts, isSupabaseConfigured } from './supabase';

// Cart starts empty; only contains items the user adds
const DEFAULT_CART: CartItem[] = [];

export default function App() {
  // Check if current URL matches /admin or #admin
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.location.pathname === '/admin' ||
      window.location.pathname.startsWith('/admin') ||
      window.location.hash === '#admin'
    );
  });

  // Dynamic products fetched from Supabase only (no hardcoded fallback)
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isFetchingFromSupabase, setIsFetchingFromSupabase] = useState<boolean>(true);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [addedToast, setAddedToast] = useState<{ name: string; id: number } | null>(null);

  // Synchronize browser URL routing (/admin and #admin)
  useEffect(() => {
    const handleUrlChange = () => {
      const isAdmin =
        window.location.pathname === '/admin' ||
        window.location.pathname.startsWith('/admin') ||
        window.location.hash === '#admin';
      setIsAdminView(isAdmin);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Dynamically fetch products from Supabase 'products' table for the main storefront
  useEffect(() => {
    async function loadStorefrontProducts() {
      if (isSupabaseConfigured) {
        try {
          setIsFetchingFromSupabase(true);
          const remoteProducts = await fetchProducts();
          setAllProducts(remoteProducts || []);
        } catch (err) {
          console.error('Could not fetch products from Supabase:', err);
          setAllProducts([]);
        } finally {
          setIsFetchingFromSupabase(false);
        }
      } else {
        setAllProducts([]);
        setIsFetchingFromSupabase(false);
      }
    }
    loadStorefrontProducts();
  }, []);

  // Open & Close Admin View Helpers
  const handleOpenAdmin = () => {
    setIsAdminView(true);
    history.pushState(null, '', '/admin');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleCloseAdmin = () => {
    setIsAdminView(false);
    history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Cart state with localStorage persistence (clears out old mock product items)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('maghreb_pc_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item) => item?.product?.id && item?.product?.name && !['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'k1', 'k2', 'k3', 'k4', 'mic1', 'mic2', 'a1', 'a2', 'o1', 'o2', 'o3'].includes(item.product.id)
          );
        }
      }
    } catch {
      // ignore JSON error
    }
    return DEFAULT_CART;
  });

  useEffect(() => {
    try {
      localStorage.setItem('maghreb_pc_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  const savedScrollYRef = useRef<number>(0);
  const lastProductIdRef = useRef<string | null>(null);
  const selectedProductRef = useRef<Product | null>(null);

  useEffect(() => {
    selectedProductRef.current = selectedProduct;
  }, [selectedProduct]);

  // Sync with browser URL hash for direct links and browser back/forward buttons
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#product-')) {
        const prodId = hash.replace('#product-', '');
        const matched = allProducts.find((p) => p.id === prodId);
        if (matched) {
          if (selectedProductRef.current?.id !== matched.id) {
            savedScrollYRef.current = window.scrollY;
            lastProductIdRef.current = matched.id;
            setSelectedProduct(matched);
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }
          return;
        }
      }
      if (!hash && selectedProductRef.current) {
        const targetY = savedScrollYRef.current;
        setSelectedProduct(null);
        requestAnimationFrame(() => {
          window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
          setTimeout(() => {
            window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
          }, 20);
        });
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [allProducts]);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSelectProduct = (product: Product | null) => {
    if (product) {
      // Remember exact scroll position where user clicked
      savedScrollYRef.current = window.scrollY;
      lastProductIdRef.current = product.id;
      setSelectedProduct(product);
      window.location.hash = `product-${product.id}`;
      // Jump to top of product details immediately without smooth scroll lag
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } else {
      const targetY = savedScrollYRef.current;
      setSelectedProduct(null);
      if (window.location.hash.startsWith('#product-')) {
        history.pushState(null, '', window.location.pathname + window.location.search);
      }
      // Instantly restore exact scroll position where user clicked
      requestAnimationFrame(() => {
        window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
        setTimeout(() => {
          window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
        }, 20);
      });
    }
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    // Show feedback toast
    setAddedToast({ name: product.name, id: Date.now() });
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (!addedToast) return;
    const timer = setTimeout(() => {
      setAddedToast(null);
    }, 2500);
    return () => clearTimeout(timer);
  }, [addedToast]);

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setIsSearchActive(false);
    handleSelectProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchActiveChange = (active: boolean) => {
    setIsSearchActive(active);
    if (active) {
      if (selectedProduct) {
        handleSelectProduct(null);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (q.trim().length > 0 && !isSearchActive) {
      setIsSearchActive(true);
    }
    if (selectedProduct) {
      handleSelectProduct(null);
    }
  };

  const handleCategorySelect = (cat: string | null) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    setIsSearchActive(false);
    if (selectedProduct) {
      handleSelectProduct(null);
    }
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Keyboard shortcut: ESC to exit search mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchActive && !selectedProduct) {
        setIsSearchActive(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchActive, selectedProduct]);

  // Determine whether Hero & Categories should be hidden
  const shouldHideTopSection = isSearchActive || searchQuery.trim().length > 0;

  // Filter products by category AND search query
  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.category.toLowerCase() === selectedCategory.toLowerCase()
      : true;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = query
      ? product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      : true;
    return matchesCategory && matchesSearch;
  });

  // If user navigated to /admin, render the full Supabase Admin Panel
  if (isAdminView) {
    return (
      <AdminPanel
        onBackToStore={handleCloseAdmin}
        onProductsUpdated={(updated) => {
          setAllProducts(updated);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-cyan-500/30">
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenUser={() => setIsUserOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onResetFilters={handleResetFilters}
        isSearchActive={isSearchActive}
        onSearchActiveChange={handleSearchActiveChange}
      />

      <main>
        {selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => handleSelectProduct(null)}
            onAddToCart={handleAddToCart}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        <div className={selectedProduct ? 'hidden' : 'block'}>
          {/* Collapsible Hero & Categories Banner with Animation */}
          <AnimatePresence initial={false}>
            {!shouldHideTopSection && (
              <motion.div
                key="store-hero-categories-showcase"
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: 1,
                  height: 'auto',
                  transition: {
                    height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.35, delay: 0.08 },
                  },
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  transition: {
                    opacity: { duration: 0.2 },
                    height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className="overflow-hidden"
              >
                <Hero
                  featuredProduct={allProducts.length > 0 ? allProducts[0] : null}
                  onSelectProduct={handleSelectProduct}
                />
                
                <Categories
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleCategorySelect}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Section */}
          <section
            id="products-section"
            className={`transition-all duration-300 ${
              shouldHideTopSection ? 'pt-8 pb-16 sm:pt-10 sm:pb-24' : 'pt-4 pb-12 sm:pt-8 sm:pb-20'
            }`}
          >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-6 gap-3">
                  <div>
                    {shouldHideTopSection && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-bold text-cyan-400 mb-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span>Search Active</span>
                      </motion.div>
                    )}

                    <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-4xl">
                      {searchQuery ? (
                        <>
                          Search Results for <span className="text-cyan-400">"{searchQuery}"</span>
                        </>
                      ) : shouldHideTopSection ? (
                        <>
                          All <span className="text-cyan-400">Gaming Gear</span>
                        </>
                      ) : selectedCategory ? (
                        <>
                          {selectedCategory} <span className="text-cyan-400">Gear</span>
                        </>
                      ) : (
                        <>
                          Featured <span className="text-cyan-400">Drops</span>
                        </>
                      )}
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                      {isFetchingFromSupabase
                        ? 'Fetching products from Supabase...'
                        : searchQuery
                        ? `Found ${filteredProducts.length} matching item${filteredProducts.length === 1 ? '' : 's'}.`
                        : shouldHideTopSection
                        ? `Showing all ${filteredProducts.length} items. Type in search bar above to filter live.`
                        : selectedCategory
                        ? `Explore our collection of ${selectedCategory}s.`
                        : allProducts.length > 0
                        ? `Showing ${allProducts.length} live product${allProducts.length === 1 ? '' : 's'} from your database.`
                        : 'Products added from your admin page will appear here live.'}
                    </p>
                  </div>

                  {(shouldHideTopSection || selectedCategory) && (
                    <button
                      onClick={handleResetFilters}
                      className="self-start sm:self-auto inline-flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900/90 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-cyan-500/30 transition-all shadow-sm"
                    >
                      <X className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{shouldHideTopSection ? 'Show Hero & Categories' : 'Show all gear'}</span>
                    </button>
                  )}
                </div>

                {isFetchingFromSupabase ? (
                  <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="rounded-xl border border-white/5 bg-zinc-900/40 p-4 animate-pulse flex flex-col gap-3"
                      >
                        <div className="aspect-square w-full rounded-lg bg-zinc-800/50" />
                        <div className="h-4 w-3/4 rounded bg-zinc-800/60 mt-1" />
                        <div className="h-3 w-1/2 rounded bg-zinc-800/40" />
                        <div className="h-5 w-1/3 rounded bg-zinc-800/60 mt-2" />
                      </div>
                    ))}
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
                    {filteredProducts.map((product, index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        index={index}
                        onAddToCart={handleAddToCart}
                        onSelectProduct={handleSelectProduct}
                      />
                    ))}
                  </div>
                ) : allProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/10 rounded-2xl bg-zinc-900/30 px-4">
                    <div className="w-14 h-14 mb-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white">No products in store yet</h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-sm leading-relaxed">
                      Only products added from your Admin Panel will appear here. Add your first product in the admin dashboard to go live.
                    </p>
                    <button
                      onClick={handleOpenAdmin}
                      className="mt-4 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-black text-zinc-950 hover:bg-cyan-400 transition-all uppercase tracking-wider shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                    >
                      Open Admin Panel
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/10 rounded-2xl bg-zinc-900/30">
                    <div className="w-14 h-14 mb-3 text-zinc-600">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-zinc-300">No gear found</h3>
                    <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                      {searchQuery
                        ? `No products match "${searchQuery}". Try another keyword or clear the search.`
                        : 'We could not find any products in this category.'}
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-4 rounded-md bg-cyan-500 px-4 py-1.5 text-xs font-bold text-zinc-950 hover:bg-cyan-400 transition-colors uppercase tracking-wider"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </div>
            </section>
        </div>
      </main>

      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Added to Cart Feedback Toast */}
      <AnimatePresence>
        {addedToast && (
          <motion.div
            key={addedToast.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full bg-zinc-900/95 border border-cyan-500/40 px-4 py-2.5 shadow-[0_4px_25px_rgba(0,0,0,0.8)] backdrop-blur-md"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-zinc-950">
              <Check className="h-3.5 w-3.5 stroke-[3]" />
            </div>
            <span className="text-xs font-semibold text-zinc-200">
              Added <span className="text-white font-bold">{addedToast.name}</span> to cart
            </span>
            <button
              onClick={() => {
                setAddedToast(null);
                setIsCartOpen(true);
              }}
              className="ml-1 flex items-center gap-1 text-xs font-black uppercase tracking-wider text-cyan-400 hover:text-cyan-300"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>View</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Drawers & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onSelectItem={handleSelectProduct}
      />

      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        onOpenAdmin={handleOpenAdmin}
      />

      <UserModal
        isOpen={isUserOpen}
        onClose={() => setIsUserOpen(false)}
      />
    </div>
  );
}
