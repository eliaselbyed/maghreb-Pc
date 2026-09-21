import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Image as ImageIcon,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  LogOut,
  RefreshCw,
  Database,
  Eye,
  Layers,
  DollarSign,
  Package,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  supabase,
  isSupabaseConfigured,
  fetchProducts,
  upsertProduct,
  deleteProduct,
  uploadProductImage,
} from '../supabase';
import { Product } from '../types';
import { categories } from '../data';

interface AdminPanelProps {
  onBackToStore: () => void;
  onProductsUpdated?: (products: Product[]) => void;
}

export function AdminPanel({ onBackToStore, onProductsUpdated }: AdminPanelProps) {
  // Auth state
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // Products state
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal form state (Add / Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields (Core Database Columns: name, category, price, stock_status, image, description)
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Mouse');
  const [formPrice, setFormPrice] = useState<number | string>('');
  const [formStockStatus, setFormStockStatus] = useState<'in_stock' | 'out_of_stock'>('in_stock');
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // Image upload state
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check Supabase Auth session on mount
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) {
          setSessionUser(data?.session?.user || null);
          setAuthLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    }

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSessionUser(session?.user || null);
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Load products when user is authenticated or demo mode enabled
  const loadProducts = async () => {
    setIsLoadingProducts(true);
    setErrorMessage(null);
    try {
      if (isSupabaseConfigured) {
        const fetched = await fetchProducts();
        setProductsList(fetched || []);
        onProductsUpdated?.(fetched || []);
      } else {
        setProductsList([]);
        onProductsUpdated?.([]);
      }
    } catch (err: any) {
      console.error('Error fetching Supabase products:', err);
      setErrorMessage(err.message || 'Failed to load products from Supabase');
      setProductsList([]);
      onProductsUpdated?.([]);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (sessionUser || isDemoMode) {
      loadProducts();
    }
  }, [sessionUser, isDemoMode]);

  // Auth Submit (Sign In / Sign Up)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);

    if (!isSupabaseConfigured) {
      setAuthError('Supabase environment credentials (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are not yet configured. You can use "Enter as Demo Admin" below to test the UI immediately!');
      return;
    }

    if (!authEmail || !authPassword) {
      setAuthError('Please fill in both email and password.');
      return;
    }

    setAuthLoading(true);
    try {
      if (authMode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        setSessionUser(data.user);
        setSuccessToast('Successfully logged into Admin Panel!');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        if (data.session) {
          setSessionUser(data.user);
          setSuccessToast('Account created and logged in!');
        } else {
          setAuthSuccessMsg('Sign up successful! Please check your email to confirm your account (or disable email confirmation in Supabase Auth settings for instant sign-ins).');
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setSessionUser(null);
    setIsDemoMode(false);
  };

  // Open Form to Add
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Mouse');
    setFormPrice('');
    setFormStockStatus('in_stock');
    setFormImage('');
    setFormDescription('');
    setImageUploadError(null);
    setIsFormOpen(true);
  };

  // Open Form to Edit
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category || 'Mouse');
    setFormPrice(p.price);
    const rawStatus = (p.stockStatus || '').toLowerCase().trim();
    setFormStockStatus(rawStatus === 'out_of_stock' || p.inStock === false ? 'out_of_stock' : 'in_stock');
    setFormImage(p.image);
    setFormDescription(p.description || '');
    setImageUploadError(null);
    setIsFormOpen(true);
  };

  // Handle Image Upload to Supabase Storage 'product-images' bucket
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setImageUploadError(null);

    try {
      if (!isSupabaseConfigured) {
        // In local demo mode, create a local blob object URL for preview
        const localUrl = URL.createObjectURL(file);
        setFormImage(localUrl);
        setSuccessToast('Image selected (Local preview mode)');
        return;
      }

      const publicUrl = await uploadProductImage(file);
      setFormImage(publicUrl);
      setSuccessToast("Image uploaded to Supabase 'product-images' bucket!");
    } catch (err: any) {
      console.error('Upload image error:', err);
      setImageUploadError(err.message || 'Failed to upload image to Supabase');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Save Product (Insert or Update with Core Columns Only)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formPrice === '') {
      alert('Product Name and Price are required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const numericPrice = typeof formPrice === 'number' ? formPrice : parseFloat(String(formPrice));

    // Core columns only: name, price, description, image, category, stock_status
    const productPayload: Partial<Product> & { id?: string } = {
      ...(editingProduct?.id ? { id: editingProduct.id } : {}),
      name: formName.trim(),
      category: formCategory,
      price: numericPrice,
      description: formDescription.trim(),
      image: formImage.trim(),
      stockStatus: formStockStatus,
      inStock: formStockStatus === 'in_stock',
    };

    try {
      if (isSupabaseConfigured) {
        const saved = await upsertProduct(productPayload);
        await loadProducts();
        setSuccessToast(`Product "${saved.name}" saved to Supabase!`);
      } else {
        // Update locally in demo mode
        if (editingProduct) {
          const updated = productsList.map((p) => (p.id === editingProduct.id ? { ...p, ...productPayload } : p));
          setProductsList(updated);
          onProductsUpdated?.(updated);
          setSuccessToast(`Product "${formName}" updated (Demo Mode)!`);
        } else {
          const newProd: Product = {
            id: `prod_${Date.now()}`,
            ...productPayload,
          } as Product;
          const updated = [newProd, ...productsList];
          setProductsList(updated);
          onProductsUpdated?.(updated);
          setSuccessToast(`New product "${formName}" created (Demo Mode)!`);
        }
      }
      setIsFormOpen(false);
    } catch (err: any) {
      console.error('Save product error:', err);
      setErrorMessage(err.message || 'Failed to save product to Supabase.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async () => {
    if (!deletingId) return;

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      if (isSupabaseConfigured) {
        await deleteProduct(deletingId);
        await loadProducts();
        setSuccessToast('Product deleted from Supabase.');
      } else {
        const updated = productsList.filter((p) => p.id !== deletingId);
        setProductsList(updated);
        onProductsUpdated?.(updated);
        setSuccessToast('Product deleted (Demo Mode).');
      }
      setDeletingId(null);
    } catch (err: any) {
      console.error('Delete error:', err);
      setErrorMessage(err.message || 'Failed to delete product from Supabase.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered products
  const filteredProducts = productsList.filter((p) => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Calculate metrics
  const inStockCount = productsList.filter(
    (p) => p.stockStatus === 'in_stock' || (p.stockStatus !== 'out_of_stock' && p.inStock !== false)
  ).length;
  const outOfStockCount = productsList.length - inStockCount;
  const avgPrice = productsList.length
    ? (productsList.reduce((sum, p) => sum + p.price, 0) / productsList.length).toFixed(2)
    : '0.00';

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Banner & Navigation */}
      <header className="sticky top-0 z-40 bg-[#0c1017]/90 backdrop-blur-md border-b border-cyan-900/30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToStore}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Storefront</span>
          </button>
          <div className="h-5 w-px bg-slate-800" />
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              M
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                MAGHREB PC <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono font-medium border border-cyan-500/20">ADMIN PANEL</span>
              </h1>
            </div>
          </div>
        </div>

        {/* User Session Info or Quick Exit */}
        <div className="flex items-center gap-3">
          {sessionUser ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-xs text-slate-400 font-mono">
                {sessionUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-medium transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : isDemoMode ? (
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                DEMO MODE
              </span>
              <button
                onClick={handleLogout}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              >
                Exit Demo
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {/* Success Notification Toast */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/90 text-emerald-200 border border-emerald-500/30 text-sm shadow-xl backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
            <button onClick={() => setSuccessToast(null)} className="ml-2 hover:opacity-80">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ==================================================== */}
        {/* LOGIN SCREEN IF NOT AUTHENTICATED & NOT IN DEMO MODE */}
        {/* ==================================================== */}
        {!sessionUser && !isDemoMode ? (
          <div className="max-w-md mx-auto my-12">
            <div className="bg-[#0e131d] rounded-2xl border border-cyan-900/40 p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
              <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-3">
                  <Database className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Supabase Admin Access</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Log in with your Supabase credentials to manage products and store catalog.
                </p>
              </div>

              {/* Status Badge regarding Supabase Configuration */}
              <div className={`p-3 rounded-xl border text-xs mb-6 ${
                isSupabaseConfigured
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
              }`}>
                <div className="flex items-start gap-2">
                  {isSupabaseConfigured ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-semibold block">
                      {isSupabaseConfigured ? 'Supabase Connected' : 'Supabase Credentials Pending'}
                    </span>
                    <span className="text-[11px] opacity-85 block mt-0.5">
                      {isSupabaseConfigured
                        ? 'Using VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from environment.'
                        : 'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are currently template placeholders in .env. You can sign in once configured, or click below to enter in Demo Mode.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Auth error */}
              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Auth success message (e.g. signup email confirmation) */}
              {authSuccessMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{authSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="admin@maghrebpc.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080b11] border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080b11] border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50"
                >
                  {authLoading ? 'Authenticating...' : authMode === 'signin' ? 'Sign In to Admin' : 'Create Admin Account'}
                </button>
              </form>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                    setAuthError(null);
                    setAuthSuccessMsg(null);
                  }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {authMode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
                </button>
              </div>

              {/* Demo Mode Button */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
                <button
                  type="button"
                  onClick={() => setIsDemoMode(true)}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Enter as Demo Admin (Preview Mode)</span>
                </button>
                <p className="text-[11px] text-slate-500 mt-2">
                  Allows testing the admin features, forms, and product list without active credentials.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ==================================================== */
          /* MAIN ADMIN DASHBOARD & PRODUCT MANAGER               */
          /* ==================================================== */
          <div className="space-y-6">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#0e131d] border border-cyan-950/60 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Total Products</span>
                  <span className="text-2xl font-bold text-white tracking-tight">{productsList.length}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0e131d] border border-cyan-950/60 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">In Stock</span>
                  <span className="text-2xl font-bold text-emerald-400 tracking-tight">{inStockCount}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0e131d] border border-cyan-950/60 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Out of Stock</span>
                  <span className="text-2xl font-bold text-rose-400 tracking-tight">{outOfStockCount}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0e131d] border border-cyan-950/60 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Avg Price</span>
                  <span className="text-2xl font-bold text-white tracking-tight">${avgPrice}</span>
                </div>
              </div>
            </div>

            {/* Supabase status and seed button banner */}
            <div className="p-4 rounded-2xl bg-[#0e131d] border border-cyan-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  isSupabaseConfigured
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                }`}>
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    Supabase Database & Storage
                    {isSupabaseConfigured ? (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Connected</span>
                    ) : (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Demo / Fallback Mode</span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Table: <code className="text-cyan-300">products</code> • Storage Bucket: <code className="text-cyan-300">product-images</code>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={loadProducts}
                  disabled={isLoadingProducts}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors disabled:opacity-50"
                  title="Reload from Supabase"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProducts ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Error Message if any */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Controls Bar: Search, Category Filter & Add Product Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products by title, specs, category..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0e131d] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#0e131d] border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="ALL">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add New Product Button */}
              <button
                onClick={handleOpenAdd}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Table Card */}
            <div className="bg-[#0e131d] rounded-2xl border border-cyan-950/60 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#0a0e16] border-b border-slate-800/80 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Product</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4">Badge</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                          <p className="text-sm font-medium">No products found</p>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Try adjusting your filters or click "Add New Product" to create one.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="hover:bg-cyan-500/[0.02] transition-colors group"
                        >
                          {/* Product image & name */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-black border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center p-1">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              </div>
                              <div>
                                <h4 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                                  {product.name}
                                </h4>
                                <p className="text-xs text-slate-400 line-clamp-1 max-w-xs">
                                  {product.fullName || product.tagline || product.description || ''}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4 text-slate-300">
                            <span className="inline-flex px-2 py-0.5 rounded-md bg-slate-800 text-xs text-slate-300 font-medium">
                              {product.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4 font-mono">
                            <span className="text-white font-bold">${Number(product.price).toFixed(2)}</span>
                            {product.originalPrice ? (
                              <span className="text-xs text-slate-500 line-through ml-2">
                                ${Number(product.originalPrice).toFixed(2)}
                              </span>
                            ) : null}
                          </td>

                          {/* Stock status */}
                          <td className="py-3 px-4">
                            {product.stockStatus === 'in_stock' || (product.stockStatus !== 'out_of_stock' && product.inStock !== false) ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                In Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                Out of Stock
                              </span>
                            )}
                          </td>

                          {/* Badge */}
                          <td className="py-3 px-4">
                            {product.badge ? (
                              <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                                {product.badge}
                              </span>
                            ) : (
                              <span className="text-slate-600 text-xs">—</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEdit(product)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
                                title="Edit Product"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeletingId(product.id)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* ADD / EDIT PRODUCT MODAL                             */}
      {/* ==================================================== */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0e131d] border border-cyan-900/40 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden my-auto"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  {editingProduct ? <Edit2 className="w-4 h-4 text-cyan-400" /> : <Plus className="w-4 h-4 text-cyan-400" />}
                  <span>{editingProduct ? 'Edit Product' : 'Add New Product'}</span>
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body / Form */}
              <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Product Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. ATTACK SHARK V6"
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-[#080b11] border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#080b11] border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price & Stock Status (Core DB Columns: price, stock_status) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Price ($) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="99.99"
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-[#080b11] border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Stock Status <span className="text-cyan-400 font-mono text-[10px]">(stock_status)</span>
                    </label>
                    <select
                      value={formStockStatus}
                      onChange={(e) => setFormStockStatus(e.target.value as 'in_stock' | 'out_of_stock')}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#080b11] border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="in_stock">In Stock (in_stock)</option>
                      <option value="out_of_stock">Out of Stock (out_of_stock)</option>
                    </select>
                  </div>
                </div>

                {/* Image Section: Upload to Supabase Storage 'product-images' bucket */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Product Image (image)
                  </label>

                  <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl bg-[#080b11] border border-slate-800">
                    {/* Image Preview Box */}
                    <div className="w-24 h-24 rounded-xl bg-black border border-slate-700 overflow-hidden flex items-center justify-center p-2 shrink-0">
                      {formImage ? (
                        <img
                          src={formImage}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-600" />
                      )}
                    </div>

                    {/* Upload button & manual URL input */}
                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          disabled={isUploadingImage}
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploadingImage ? 'Uploading to Supabase...' : 'Upload Image to Supabase'}</span>
                        </button>
                        <span className="text-xs text-slate-500">PNG, JPG, WEBP</span>
                      </div>

                      {imageUploadError && (
                        <p className="text-xs text-rose-400">{imageUploadError}</p>
                      )}

                      <div>
                        <input
                          type="text"
                          value={formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                          placeholder="Or paste public Image URL (/attack-shark-v6.png or https://...)"
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0e131d] border border-slate-800 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description (Core DB Column: description) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Product description..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080b11] border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Modal Footer */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50"
                  >
                    {isSaving ? 'Saving to Supabase...' : editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* DELETE CONFIRMATION MODAL                            */}
      {/* ==================================================== */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0e131d] border border-rose-900/40 rounded-2xl w-full max-w-sm p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 text-rose-400 mb-3">
                <Trash2 className="w-6 h-6" />
                <h4 className="text-base font-bold text-white">Delete Product?</h4>
              </div>
              <p className="text-sm text-slate-400 mb-5">
                This action will remove the product record from your Supabase <code className="text-cyan-300">products</code> table.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteProduct}
                  className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
