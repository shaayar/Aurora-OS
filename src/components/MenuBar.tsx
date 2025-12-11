import { useState, useEffect, memo } from 'react';
import { Apple, Wifi, Battery, Volume2, Bell, } from 'lucide-react';
import { useThemeColors } from '../hooks/useThemeColors';
import { cn } from './ui/utils';

interface MenuBarProps {
  onNotificationsClick: () => void;
  focusedApp?: string | null;
}

// App-specific menu configurations
const appMenus: Record<string, { name: string; menus: string[] }> = {
  finder: { name: 'Finder', menus: ['File', 'Edit', 'View', 'Go', 'Window', 'Help'] },
  settings: { name: 'System Settings', menus: ['File', 'Edit', 'View', 'Window', 'Help'] },
  photos: { name: 'Photos', menus: ['File', 'Edit', 'Image', 'View', 'Window', 'Help'] },
  music: { name: 'Music', menus: ['File', 'Edit', 'Song', 'View', 'Controls', 'Window', 'Help'] },
  messages: { name: 'Messages', menus: ['File', 'Edit', 'View', 'Conversations', 'Window', 'Help'] },
  browser: { name: 'Browser', menus: ['File', 'Edit', 'View', 'History', 'Bookmarks', 'Window', 'Help'] },
  terminal: { name: 'Terminal', menus: ['Shell', 'Edit', 'View', 'Window', 'Help'] },
  videos: { name: 'Videos', menus: ['File', 'Edit', 'View', 'Playback', 'Window', 'Help'] },
  calendar: { name: 'Calendar', menus: ['File', 'Edit', 'View', 'Window', 'Help'] },
  notes: { name: 'Notes', menus: ['File', 'Edit', 'Format', 'View', 'Window', 'Help'] },
  mail: { name: 'Mail', menus: ['File', 'Edit', 'View', 'Mailbox', 'Message', 'Window', 'Help'] },
};

const defaultMenus = { name: 'Finder', menus: ['File', 'Edit', 'View', 'Go', 'Window', 'Help'] };

function MenuBarComponent({ onNotificationsClick, focusedApp }: MenuBarProps) {
  const { menuBarBackground, blurStyle } = useThemeColors();
  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  );

  const [currentDate, setCurrentDate] = useState(() =>
    new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  );

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }));
      setCurrentDate(now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get the menu config for the focused app
  const appConfig = focusedApp ? appMenus[focusedApp] || defaultMenus : defaultMenus;

  return (
    <div
      className={cn("absolute top-0 left-0 right-0 h-7 border-b border-white/10 flex items-center justify-between px-4 z-[9999]")}
      style={{ background: menuBarBackground, ...blurStyle }}
    >
      {/* Left side */}
      <div className="flex items-center gap-6">
        <Apple className="w-4 h-4 text-white" />
        <div className="flex items-center gap-4 text-white/70 text-xs">
          <button className="font-semibold text-white hover:text-white/80 transition-colors">
            {appConfig.name}
          </button>
          {appConfig.menus.map((menu) => (
            <button key={menu} className="hover:text-white transition-colors">
              {menu}
            </button>
          ))}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="text-white/70 hover:text-white transition-colors">
          <Battery className="w-4 h-4" />
        </button>
        <button className="text-white/70 hover:text-white transition-colors">
          <Wifi className="w-4 h-4" />
        </button>
        <button className="text-white/70 hover:text-white transition-colors">
          <Volume2 className="w-4 h-4" />
        </button>
        <button
          className="text-white/70 hover:text-white transition-colors"
          onClick={onNotificationsClick}
        >
          <Bell className="w-4 h-4" />
        </button>
        <div className="text-white/80 text-xs flex items-center gap-2">
          <span>{currentDate}</span>
          <span>{currentTime}</span>
        </div>
      </div>
    </div>
  );
}

export const MenuBar = memo(MenuBarComponent);