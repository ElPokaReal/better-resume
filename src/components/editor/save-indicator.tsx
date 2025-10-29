'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Cloud, CloudOff, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved: Date | null;
}

export function SaveIndicator({ status, lastSaved }: SaveIndicatorProps) {
  const t = useTranslations('editor.saveIndicator');
  
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 10) return t('justNow');
    if (seconds < 60) return t('secondsAgo', { seconds });
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return t('minutesAgo', { minutes });
    
    const hours = Math.floor(minutes / 60);
    return t('hoursAgo', { hours });
  };

  const statusConfig = {
    idle: {
      icon: Cloud,
      text: t('noChanges'),
      color: 'text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      animate: false,
    },
    saving: {
      icon: Loader2,
      text: t('saving'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      animate: true,
    },
    saved: {
      icon: Check,
      text: lastSaved ? t('saved', { time: getTimeAgo(lastSaved) }) : t('savedSimple'),
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      animate: false,
    },
    error: {
      icon: CloudOff,
      text: t('error'),
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
