import { motion } from 'framer-motion';
import type { Brain3DProps } from '../types';

/**
 * Brain3D Component
 * 
 * Displays a 3D brain illustration with tumor highlight area and subtle motion animations.
 * Responsive design hides the component on small screens (mobile devices).
 * 
 * Requirements: 1.3, 1.4, 11.4
 */
export default function Brain3D({ animate }: Brain3DProps) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <motion.div
        className="relative w-full h-full"
        animate={
          animate
            ? {
                y: [0, -10, 0],
                rotateY: [0, 5, 0, -5, 0],
              }
            : {}
        }
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatDelay: 4,
          ease: 'easeInOut',
        }}
      >
        {/* Brain outline */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main brain shape */}
          <motion.path
            d="M100 20 C120 20, 140 30, 150 50 C160 70, 165 90, 160 110 C155 130, 145 145, 130 155 C115 165, 100 170, 85 165 C70 160, 55 150, 45 135 C35 120, 30 100, 35 80 C40 60, 55 40, 75 30 C85 25, 92 20, 100 20 Z"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 10, times: [0, 0.2, 0.95, 1], ease: 'easeInOut', repeat: Infinity }}
          />

          {/* Brain hemisphere division */}
          <motion.path
            d="M100 20 Q100 100, 100 165"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="5,5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.6, 0.6, 0] }}
            transition={{ duration: 10, times: [0, 0.25, 0.95, 1], ease: 'easeInOut', repeat: Infinity }}
          />

          {/* Left hemisphere details */}
          <motion.path
            d="M60 60 Q70 70, 65 85"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.5, 0.5, 0] }}
            transition={{ duration: 10, times: [0, 0.25, 0.95, 1], ease: 'easeInOut', repeat: Infinity }}
          />
          <motion.path
            d="M50 90 Q60 100, 55 115"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.5, 0.5, 0] }}
            transition={{ duration: 10, times: [0, 0.27, 0.95, 1], ease: 'easeInOut', repeat: Infinity }}
          />

          {/* Right hemisphere details */}
          <motion.path
            d="M140 60 Q130 70, 135 85"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.5, 0.5, 0] }}
            transition={{ duration: 10, times: [0, 0.26, 0.95, 1], ease: 'easeInOut', repeat: Infinity }}
          />
          <motion.path
            d="M150 90 Q140 100, 145 115"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.5, 0.5, 0] }}
            transition={{ duration: 10, times: [0, 0.28, 0.95, 1], ease: 'easeInOut', repeat: Infinity }}
          />

          {/* Tumor highlight area - pulsing red circle */}
          <motion.circle
            cx="120"
            cy="80"
            r="12"
            fill="#EF4444"
            opacity="0.3"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 4,
              ease: 'easeInOut',
            }}
          />
          <motion.circle
            cx="120"
            cy="80"
            r="8"
            fill="#EF4444"
            opacity="0.6"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 4,
              ease: 'easeInOut',
              delay: 0.3,
            }}
          />

          {/* Neural connections - subtle lines */}
          <motion.line
            x1="80"
            y1="70"
            x2="120"
            y2="80"
            stroke="#3B82F6"
            strokeWidth="0.5"
            opacity="0.4"
            strokeDasharray="2,2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.4, 0.4, 0] }}
            transition={{ duration: 10, times: [0, 0.35, 0.95, 1], ease: 'easeInOut', repeat: Infinity }}
          />
          <motion.line
            x1="100"
            y1="50"
            x2="120"
            y2="80"
            stroke="#3B82F6"
            strokeWidth="0.5"
            opacity="0.4"
            strokeDasharray="2,2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.4, 0.4, 0] }}
            transition={{ duration: 10, times: [0, 0.36, 0.95, 1], ease: 'easeInOut', repeat: Infinity }}
          />
          <motion.line
            x1="140"
            y1="100"
            x2="120"
            y2="80"
            stroke="#3B82F6"
            strokeWidth="0.5"
            opacity="0.4"
            strokeDasharray="2,2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.4, 0.4, 0] }}
            transition={{ duration: 10, times: [0, 0.37, 0.95, 1], ease: 'easeInOut', repeat: Infinity }}
          />
        </svg>

        {/* Floating particles around tumor area */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-2 h-2 bg-red-400 rounded-full"
          animate={{
            y: [-5, 5, -5],
            x: [-3, 3, -3],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 4,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-red-300 rounded-full"
          animate={{
            y: [5, -5, 5],
            x: [3, -3, 3],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 4,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />
      </motion.div>
    </div>
  );
}
