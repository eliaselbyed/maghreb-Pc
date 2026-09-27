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
    <section className="py-4 sm:py-6 border-b border-white/10 bg-[#06080e]/60 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
            <h2 className="font-display text-base sm:text-xl font-bold uppercase tracking-wider text-white">
              Browse Categories
            </h2>
          </div>
        </div>
        
        <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-1 sm:pb-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* "All" button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            onClick={() => onSelectCategory(null)}
            className="group flex min-w-[62px] sm:min-w-[100px] snap-start flex-col items-center gap-2 sm:gap-2.5 cursor-pointer"
          >
            <div className={`flex h-13 w-13 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border transition-all duration-300 ${
              selectedCategory === null 
                ? 'border-[#00f0ff] bg-[#00f0ff]/15 shadow-[0_0_20px_rgba(0,240,255,0.45)] ring-1 ring-[#00f0ff]/50' 
                : 'border-white/10 bg-[#0b0e17] group-hover:border-[#00f0ff]/50 group-hover:bg-[#121726]'
            }`}>
              <div className={`h-5 w-5 sm:h-8 sm:w-8 transition-colors ${selectedCategory === null ? 'text-[#00f0ff]' : 'text-zinc-400 group-hover:text-[#00f0ff]'}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
            </div>
            <span className={`font-tech text-[11px] sm:text-xs font-bold uppercase tracking-wider truncate w-full text-center transition-colors ${
              selectedCategory === null ? 'text-[#00f0ff]' : 'text-zinc-400 group-hover:text-white'
            }`}>
              All Gear
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
                className="group flex min-w-[62px] sm:min-w-[100px] snap-start flex-col items-center gap-2 sm:gap-2.5 cursor-pointer"
              >
                <div className={`flex h-13 w-13 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border transition-all duration-300 ${
                  isSelected
                    ? 'border-[#00f0ff] bg-[#00f0ff]/15 shadow-[0_0_20px_rgba(0,240,255,0.45)] ring-1 ring-[#00f0ff]/50'
                    : 'border-white/10 bg-[#0b0e17] group-hover:border-[#00f0ff]/50 group-hover:bg-[#121726]'
                }`}>
                  {Icon && <Icon className={`h-5 w-5 sm:h-8 sm:w-8 transition-colors ${
                    isSelected ? 'text-[#00f0ff]' : 'text-zinc-400 group-hover:text-[#00f0ff]'
                  }`} />}
                </div>
                <span className={`font-tech text-[11px] sm:text-xs font-bold uppercase tracking-wider truncate w-full text-center transition-colors ${
                  isSelected ? 'text-[#00f0ff]' : 'text-zinc-400 group-hover:text-white'
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
