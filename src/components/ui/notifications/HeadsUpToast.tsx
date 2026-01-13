import { motion, AnimatePresence } from 'motion/react';
import { X, Bell } from 'lucide-react';
import { AppNotification } from '@/components/AppNotificationsContext';
import { getApp } from '@/config/appRegistry';
import { useThemeColors } from '@/hooks/useThemeColors';

interface HeadsUpToastProps {
  notification: AppNotification | null;
  onDismiss: () => void;
  onOpen: (appId: string) => void;
}

export function HeadsUpToast({ notification, onDismiss, onOpen }: HeadsUpToastProps) {
  const { getBackgroundColor, blurStyle } = useThemeColors();

  if (!notification) return null;

  const app = getApp(notification.appId);
  const Icon = app?.icon || Bell;

  return (
    <div className="fixed top-4 left-4 z-50 w-80 pointer-events-none">
      <AnimatePresence>
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          className="pointer-events-auto overflow-hidden rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl"
          style={{ background: getBackgroundColor(0.8), ...blurStyle }}
        >
          <div className="p-4 flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0 py-0.5 cursor-pointer" onClick={() => { onOpen(notification.appId); onDismiss(); }}>
              <h3 className="font-medium text-white text-sm truncate">{notification.title}</h3>
              <p className="text-white/60 text-xs mt-0.5 line-clamp-2">{notification.message}</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onDismiss(); }}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
