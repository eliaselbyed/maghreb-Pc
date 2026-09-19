import { motion } from 'motion/react';

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-zinc-950 py-6 sm:py-14 lg:py-20">
      {/* Neon Glow Effects */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[600px] rounded-full bg-cyan-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[120px]" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 tracking-wider mb-3 sm:mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              NEW COLLECTION LIVE
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl uppercase leading-[1.1]">
              Dominate <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                The Game
              </span>
            </h1>
            <p className="mt-3 sm:mt-5 text-sm sm:text-lg text-zinc-400 max-w-xl leading-relaxed">
              Equip yourself with elite, high-performance gear designed for precision, speed, and absolute victory. Professional setups start here.
            </p>

          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-lg hidden lg:block"
          >
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80" 
                alt="Gaming Setup" 
                className="object-cover w-full h-full opacity-80 mix-blend-lighten"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
