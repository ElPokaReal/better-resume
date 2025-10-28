'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Cloud, CloudOff, Loader2 } from 'lucide-react';

interface SaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved: Date | null;
}

export function SaveIndicator({ status, lastSaved }: SaveIndicatorProps) {
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 10) return 'justo ahora';
    if (seconds < 60) return `hace ${seconds}s`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `hace ${minutes}m`;
    
    const hours = Math.floor(minutes / 60);
    return `hace ${hours}h`;
  };

  const statusConfig = {
    idle: {
      icon: Cloud,
      text: 'Sin cambios',
      color: 'text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      animate: false,
    },
    saving: {
      icon: Loader2,
      text: 'Guardando...',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      animate: true,
    },
    saved: {
      icon: Check,
      text: lastSaved ? `Guardado ${getTimeAgo(lastSaved)}` : 'Guardado',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      animate: false,
    },
    error: {
      icon: CloudOff,
      text: 'Error al guardar',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      animate: false,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg ${config.bgColor}`}
        title={config.text} // Tooltip para móvil
      >
        <motion.div
          animate={config.animate ? { rotate: 360 } : {}}
          transition={config.animate ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
        >
          <Icon className={`w-4 h-4 ${config.color}`} />
        </motion.div>
        {/* Texto solo en desktop */}
        <span className={`hidden sm:inline text-sm font-medium ${config.color}`}>
          {config.text}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
