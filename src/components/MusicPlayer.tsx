import React, { useState, useRef, useEffect } from 'react';
import { Track } from '../types';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Horizon',
    artist: 'SynthWave AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/400/400'
  },
  {
    id: '2',
    title: 'Cyber Pulse',
    artist: 'Digital Dreamer',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon2/400/400'
  },
  {
    id: '3',
    title: 'Midnight Grid',
    artist: 'Retro Future',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/neon3/400/400'
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-md bg-black border-2 border-[#00ffff] p-6 shadow-[0_0_20px_#00ffff]">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-20 h-20 border-2 border-[#ff00ff] overflow-hidden shadow-lg">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentTrack.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover grayscale contrast-150"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#ff00ff]/20">
              <div className="flex gap-1 items-end h-6">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 20, 8, 16, 4] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                    className="w-1 bg-[#ff00ff]"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0 font-mono">
          <h3 className="text-[#00ffff] font-black truncate text-sm tracking-tight uppercase">{currentTrack.title}</h3>
          <p className="text-[#ff00ff] text-[10px] font-bold truncate uppercase">{currentTrack.artist}</p>
        </div>
        
        <div className="p-2 border border-[#ff00ff] text-[#ff00ff]">
          <Music size={20} />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 w-full bg-[#111] border border-[#ff00ff]/30 overflow-hidden">
          <motion.div 
            className="h-full bg-[#ff00ff]"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between font-mono">
        <div className="flex items-center gap-1 text-[#0f0]">
          <Volume2 size={16} />
          <div className="w-12 h-1 bg-[#111] border border-[#0f0]/30">
            <div className="w-2/3 h-full bg-[#0f0]" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrev}
            className="text-[#00ffff] hover:text-[#ff00ff] transition-colors"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 bg-[#00ffff] hover:bg-[#ff00ff] text-black flex items-center justify-center transition-all transform hover:scale-105 shadow-[4px_4px_0px_#ff00ff]"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>

          <button 
            onClick={handleNext}
            className="text-[#00ffff] hover:text-[#ff00ff] transition-colors"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>

        <div className="text-[8px] text-[#ff00ff] font-bold animate-pulse">
          [ STREAMING ]
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />
    </div>
  );
};
