import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#000] text-[#0f0] font-sans selection:bg-[#ff00ff]/30 overflow-hidden relative">
      {/* Static & Scanlines */}
      <div className="static-overlay" />
      <div className="scanline" />
      
      {/* Background Glitch Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-1 bg-[#ff00ff] blur-sm animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-96 h-1 bg-[#00ffff] blur-sm animate-pulse" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen gap-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex flex-col items-center"
        >
          <div className="relative group">
            <h1 
              data-text="SYSTEM_SNAKE"
              className="glitch-text text-5xl md:text-7xl font-mono font-black tracking-tighter text-[#00ffff] drop-shadow-[4px_4px_0px_#ff00ff]"
            >
              SYSTEM_SNAKE
            </h1>
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-[2px] w-16 bg-[#ff00ff]" />
            <span className="text-xs font-mono font-bold text-[#ff00ff] animate-pulse">
              [ PROTOCOL: PULSE_&_PLAY ]
            </span>
            <div className="h-[2px] w-16 bg-[#ff00ff]" />
          </div>
        </motion.div>

        {/* Game Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative border-4 border-[#00ffff] p-1 bg-black shadow-[0_0_20px_#00ffff]"
        >
          <SnakeGame />
        </motion.div>

        {/* Music Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full flex justify-center"
        >
          <MusicPlayer />
        </motion.div>

        {/* Footer Info */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between opacity-50 text-[8px] font-mono font-bold">
          <span>ID: 3gictf2vejwj2l56hqynha</span>
          <span>STATUS: OPERATIONAL</span>
          <span>VER: 2.0.GLITCH</span>
        </div>
      </main>
    </div>
  );
}
