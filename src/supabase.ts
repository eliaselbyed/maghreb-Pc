import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product } from './types';

// Read client-side environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

// Validate if real credentials have been provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your-anon-public-key')
);

// Lazy or safe client initialization (prevents crash on import if variables are absent)
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

/**
 * Core columns defined in the Supabase 'products' table.
 * We strictly query and insert only these core columns.
 */
export const SUPABASE_CORE_COLUMNS = 'id, name, price, description, image, category, stock_status';

export interface SupabaseProductCorePayload {
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock_status: string;
}

/**
 * Maps Supabase DB row to frontend Product model.
 * Completely ignores discount_percent, in_stock, and reviews_count.
 */
export function mapSupabaseRowToProduct(row: any): Product {
  const price = typeof row.price === 'number' ? row.price : parseFloat(row.price) || 0;

  // Determine stock availability strictly from 'stock_status'
  const rawStatus = (row.stock_status || '').toString().toLowerCase().trim();
  const isInStock = rawStatus
    ? rawStatus === 'in_stock' || rawStatus === 'instock' || rawStatus === 'available' || rawStatus === 'true'
    : true;
  const normalizedStatus = rawStatus ? (isInStock ? 'in_stock' : 'out_of_stock') : 'in_stock';

  return {
    id: String(row.id),
    name: row.name || 'Untitled Product',
    fullName: row.name || 'Untitled Product',
    tagline: '',
    price,
    category: row.category || 'Gear',
    image: row.image || '/attack-shark-x11-dock.jpg',
    description: row.description || '',
    stockStatus: normalizedStatus,
    inStock: isInStock,
    rating: 5,
    reviewsCount: 15,
  };
}

/**
 * Maps frontend Product model to Supabase DB row format.
 * ONLY includes the actual core columns: name, price, description, image, category, stock_status.
 * No references to discount_percent, in_stock, or reviews_count are ever sent.
 */
export function mapProductToSupabaseRow(product: Partial<Product>): SupabaseProductCorePayload {
  // Normalize stock_status to 'in_stock' or 'out_of_stock'
  let stockStatus = 'in_stock';
  if (product.stockStatus) {
    stockStatus = product.stockStatus.toLowerCase().trim() === 'out_of_stock' ? 'out_of_stock' : 'in_stock';
  } else if (product.inStock === false) {
    stockStatus = 'out_of_stock';
  }

  return {
    name: (product.name || '').trim(),
    price: typeof product.price === 'number' ? product.price : parseFloat(String(product.price)) || 0,
    description: (product.description || '').trim(),
    image: product.image || '/attack-shark-x11-dock.jpg',
    category: product.category || 'Gear',
    stock_status: stockStatus,
  };
}

/**
 * Fetch all products from Supabase 'products' table using actual core columns.
 */
export async function fetchProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return [];
  }

  // Explicitly query the core columns
  const { data, error } = await supabase
    .from('products')
    .select(SUPABASE_CORE_COLUMNS)
    .order('id', { ascending: true });

  if (error) {
    console.warn('Supabase fetch with ordered core columns notice:', error.message);
    // Safe retry without explicit ordering
    const retry = await supabase
      .from('products')
      .select(SUPABASE_CORE_COLUMNS);

    if (retry.error) {
      console.error('Supabase fetch core columns failed:', retry.error.message);
      // Fallback: select whatever is in the table
      const fallback = await supabase.from('products').select('*');
      if (fallback.error) throw fallback.error;
      return (fallback.data || []).map(mapSupabaseRowToProduct);
    }
    return (retry.data || []).map(mapSupabaseRowToProduct);
  }

  return (data || []).map(mapSupabaseRowToProduct);
}

/**
 * Insert or update a product in the Supabase 'products' table.
 * Only sends core columns (name, price, description, image, category, stock_status).
 */
export async function upsertProduct(product: Partial<Product> & { id?: string }): Promise<Product> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const rowData: SupabaseProductCorePayload = mapProductToSupabaseRow(product);

  // If this is an existing database record, perform an UPDATE
  if (product.id && !product.id.startsWith('prod_demo_') && !product.id.startsWith('prod_temp_')) {
    const { data, error } = await supabase
      .from('products')
      .update(rowData)
      .eq('id', product.id)
      .select(SUPABASE_CORE_COLUMNS)
      .single();

    if (error) {
      // Retry without explicit column projection if needed
      const fallback = await supabase
        .from('products')
        .update(rowData)
        .eq('id', product.id)
        .select()
        .single();
      if (fallback.error) throw fallback.error;
      return mapSupabaseRowToProduct(fallback.data);
    }

    return mapSupabaseRowToProduct(data);
  }

  // Otherwise, perform an INSERT for a new product (database generates id)
  const { data, error } = await supabase
    .from('products')
    .insert([rowData])
    .select(SUPABASE_CORE_COLUMNS)
    .single();

  if (error) {
    // Retry without explicit column projection if needed
    const fallback = await supabase
      .from('products')
      .insert([rowData])
      .select()
      .single();
    if (fallback.error) throw fallback.error;
    return mapSupabaseRowToProduct(fallback.data);
  }

  return mapSupabaseRowToProduct(data);
}

/**
 * Delete a product from Supabase 'products' table by ID.
 */
export async function deleteProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

/**
 * Upload an image file to the Supabase 'product-images' storage bucket.
 * Returns the public URL of the uploaded image.
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
  }

  const fileExt = file.name.split('.').pop() || 'png';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    if (uploadError.message?.toLowerCase().includes('bucket not found')) {
      throw new Error("Storage bucket 'product-images' not found in your Supabase project. Please create a public bucket named 'product-images' in Supabase Dashboard -> Storage.");
    }
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Seed initial catalog items into Supabase 'products' table using only core columns.
 */
export async function seedProductsToSupabase(catalogItems: Product[]): Promise<number> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.');
  }

  // Map to only core columns: name, price, description, image, category, stock_status
  const rows = catalogItems.map((p) => mapProductToSupabaseRow(p));

  const { data, error } = await supabase
    .from('products')
    .insert(rows)
    .select('id');

  if (error) {
    throw error;
  }

  return data?.length || 0;
}
