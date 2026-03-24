import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction } from '../types';
import { Trophy, RotateCcw, Play } from 'lucide-react';
import { motion } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const INITIAL_SPEED = 150;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameOver(true);
        setIsPaused(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused((p) => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !gameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, INITIAL_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, gameOver, moveSnake]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-black border-2 border-[#ff00ff] shadow-[0_0_15px_#ff00ff]">
      <div className="flex justify-between w-full px-2 font-mono text-[10px]">
        <div className="flex items-center gap-2 text-[#00ffff] drop-shadow-[0_0_5px_#00ffff]">
          <span>DATA_HARVESTED:</span>
          <span className="text-lg font-black">{score}</span>
        </div>
        <div className="flex items-center gap-2 text-[#ff00ff]">
          <div className="border border-[#ff00ff] px-2 py-1 bg-[#ff00ff]/10 relative overflow-hidden">
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="font-black opacity-70">PEAK_EFFICIENCY:</span>
              <span className="text-lg font-black animate-glitch">
                {highScore}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div 
        className="relative bg-black border-4 border-[#0f0]/20 overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(#0f0 1px, transparent 1px), linear-gradient(90deg, #0f0 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }} 
        />

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`absolute border border-black ${
              i === 0 ? 'bg-[#00ffff] shadow-[0_0_10px_#00ffff]' : 'bg-[#00ffff]/60'
            }`}
            style={{
              width: 20,
              height: 20,
              left: segment.x * 20,
              top: segment.y * 20,
              zIndex: 10
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-[#ff00ff] shadow-[0_0_15px_#ff00ff] animate-pulse"
          style={{
            width: 16,
            height: 16,
            left: food.x * 20 + 2,
            top: food.y * 20 + 2,
            zIndex: 5
          }}
        />

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center gap-8 z-20 backdrop-blur-md border-4 border-[#ff00ff]">
            <motion.h2 
              data-text="CRITICAL_FAILURE"
              className="glitch-text text-3xl font-mono font-black text-[#ff00ff] tracking-tighter animate-glitch"
            >
              CRITICAL_FAILURE
            </motion.h2>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={resetGame}
              className="px-8 py-3 bg-[#00ffff] hover:bg-[#ff00ff] text-black font-mono font-black transition-all transform hover:scale-110 flex items-center gap-3 shadow-[4px_4px_0px_#ff00ff] uppercase text-sm"
            >
              REBOOT_SYSTEM
            </motion.button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 backdrop-blur-[2px] gap-8">
            <button
              onClick={() => setIsPaused(false)}
              className="w-20 h-20 bg-[#00ffff]/10 hover:bg-[#00ffff]/30 border-4 border-[#00ffff] text-[#00ffff] flex items-center justify-center transition-all transform hover:scale-110 shadow-[0_0_20px_#00ffff]"
            >
              <Play size={40} fill="currentColor" />
            </button>

            {/* Visual Controls Hint */}
            <div className="flex gap-8 items-center font-mono text-[8px] text-[#00ffff] font-bold">
              <div className="flex flex-col items-center gap-2">
                <div className="px-2 py-1 border-2 border-[#00ffff] shadow-[2px_2px_0px_#ff00ff]">
                  INPUT: ARROWS
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="px-2 py-1 border-2 border-[#00ffff] shadow-[2px_2px_0px_#ff00ff]">
                  CMD: START
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="font-mono text-[8px] text-[#0f0]/50 tracking-[0.2em] font-bold">
        [ KEY_MAP: ARROWS_MOVE | SPACE_HALT ]
      </div>
    </div>
  );
};
