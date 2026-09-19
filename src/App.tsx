import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { ProductCard } from './components/ProductCard';
import { Footer } from './components/Footer';
import { products } from './data';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category === selectedCategory)
    : products;

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-cyan-500/30">
      <Navbar />
      
      <main>
        <Hero />
        <Categories selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        
        {/* Products Section */}
        <section className="pt-4 pb-12 sm:pt-8 sm:pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-4xl">
                  {selectedCategory ? selectedCategory : 'Featured'} <span className="text-cyan-400">{selectedCategory ? 'Gear' : 'Drops'}</span>
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                  {selectedCategory ? `Explore our collection of ${selectedCategory}s.` : 'The latest and greatest in gaming hardware.'}
                </p>
              </div>
            </div>
            
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 mb-4 text-zinc-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-zinc-300">No products found</h3>
                <p className="text-zinc-500 mt-2">We couldn't find any products in this category.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

