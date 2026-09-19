import { motion } from 'motion/react';
import { Keyboard, Mouse, Lightbulb, Mic, Monitor, Headphones, Ear } from 'lucide-react';
import { categories } from '../data';
import type { ElementType } from 'react';

const iconMap: Record<string, ElementType> = {
  Keyboard,
  Mouse,
  Lightbulb,
  Mic,
  Monitor,
  Headphones,
  Ear
};

interface CategoriesProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function Categories({ selectedCategory, onSelectCategory }: CategoriesProps) {
  return (
    <section className="py-4 sm:py-6 border-y border-white/5 bg-zinc-950/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-white">Browse Categories</h2>
        </div>
        
        <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-1 sm:pb-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* "All" button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            onClick={() => onSelectCategory(null)}
            className="group flex min-w-[56px] sm:min-w-[100px] snap-start flex-col items-center gap-2 sm:gap-3"
          >
            <div className={`flex h-12 w-12 sm:h-20 sm:w-20 items-center justify-center rounded-full border transition-all duration-300 ${
              selectedCategory === null 
                ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
                : 'border-white/10 bg-zinc-900 group-hover:border-cyan-500/50 group-hover:bg-zinc-800'
            }`}>
              <div className={`h-5 w-5 sm:h-8 sm:w-8 transition-colors ${selectedCategory === null ? 'text-cyan-400' : 'text-zinc-400 group-hover:text-cyan-400'}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
            </div>
            <span className={`text-[10px] sm:text-sm font-medium truncate w-full text-center transition-colors ${
              selectedCategory === null ? 'text-cyan-400' : 'text-zinc-400 group-hover:text-white'
            }`}>
              All
            </span>
          </motion.button>

          {categories.map((category, index) => {
            const Icon = iconMap[category.iconName];
            const isSelected = selectedCategory === category.name;
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index + 1) * 0.05 }}
                onClick={() => onSelectCategory(category.name)}
                className="group flex min-w-[56px] sm:min-w-[100px] snap-start flex-col items-center gap-2 sm:gap-3"
              >
                <div className={`flex h-12 w-12 sm:h-20 sm:w-20 items-center justify-center rounded-full border transition-all duration-300 ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                    : 'border-white/10 bg-zinc-900 group-hover:border-cyan-500/50 group-hover:bg-zinc-800'
                }`}>
                  {Icon && <Icon className={`h-5 w-5 sm:h-8 sm:w-8 transition-colors ${
                    isSelected ? 'text-cyan-400' : 'text-zinc-400 group-hover:text-cyan-400'
                  }`} />}
                </div>
                <span className={`text-[10px] sm:text-sm font-medium truncate w-full text-center transition-colors ${
                  isSelected ? 'text-cyan-400' : 'text-zinc-400 group-hover:text-white'
                }`}>
                  {category.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
