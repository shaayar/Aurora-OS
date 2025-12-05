import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  FileText,
  Download,
  HardDrive,
  Search,
  Grid3x3,
  List,
  Monitor,
  File,
  Music,
  Image,
  Film,
  Trash2,
  Settings,
  Home
} from 'lucide-react';
import { useAppContext } from './AppContext';
import { lightenColor } from '../utils/colors';
import { AppTemplate } from './apps/AppTemplate';
import { useFileSystem, FileNode } from './FileSystemContext';
import { useAppStorage } from '../hooks/useAppStorage';

export function FileManager() {
  const { accentColor } = useAppContext();
  const { listDirectory, homePath } = useFileSystem();

  // Persisted state (viewMode survives refresh)
  const [appState, setAppState] = useAppStorage('finder', {
    viewMode: 'grid' as 'grid' | 'list',
  });

  // Each FileManager instance has its own navigation state (independent windows, NOT persisted)
  const [currentPath, setCurrentPath] = useState(homePath);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [items, setItems] = useState<FileNode[]>([]);
  const [history, setHistory] = useState<string[]>([homePath]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Load directory contents when path changes
  useEffect(() => {
    const contents = listDirectory(currentPath);
    if (contents) {
      // Sort: directories first, then files, both alphabetically
      const sorted = [...contents].sort((a, b) => {
        if (a.type === 'directory' && b.type !== 'directory') return -1;
        if (a.type !== 'directory' && b.type === 'directory') return 1;
        return a.name.localeCompare(b.name);
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Data fetching pattern
      setItems(sorted);
    } else {
       
      setItems([]);
    }
     
    setSelectedItem(null);
  }, [currentPath, listDirectory]);

  // Navigate to a directory
  const navigateTo = (path: string) => {
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
  };

  // Handle item double-click
  const handleItemDoubleClick = (item: FileNode) => {
    if (item.type === 'directory') {
      const newPath = currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`;
      navigateTo(newPath);
    }
  };

  // Go back in history
  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
    }
  };

  // Go forward in history
  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
    }
  };

  // Get current directory name
  const getCurrentDirName = () => {
    if (currentPath === '/') return '/';
    const parts = currentPath.split('/');
    return parts[parts.length - 1] || '/';
  };

  // Get icon for file type
  const getFileIcon = (item: FileNode) => {
    if (item.type === 'directory') {
      // Special folder icons
      if (item.name === '.Trash') return <Trash2 className="w-8 h-8" style={{ color: accentColor }} />;
      if (item.name === 'Config') return <Settings className="w-8 h-8" style={{ color: accentColor }} />;
      return null; // Use folder SVG
    }

    // File type icons based on extension or name
    const name = item.name.toLowerCase();
    if (name.endsWith('.mp3') || name.endsWith('.wav') || name.endsWith('.flac')) {
      return <Music className="w-8 h-8 text-pink-400" />;
    }
    if (name.endsWith('.jpg') || name.endsWith('.png') || name.endsWith('.gif') || name.endsWith('.webp')) {
      return <Image className="w-8 h-8 text-green-400" />;
    }
    if (name.endsWith('.mp4') || name.endsWith('.mov') || name.endsWith('.avi')) {
      return <Film className="w-8 h-8 text-purple-400" />;
    }
    if (name.endsWith('.pdf')) {
      return <FileText className="w-8 h-8 text-red-400" />;
    }
    return <File className="w-8 h-8 text-white/60" />;
  };

  const getFolderIcon = () => {
    const lightAccent = lightenColor(accentColor, 20);

    return (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 18C12 15.7909 13.7909 14 16 14H32L37 21H64C66.2091 21 68 22.7909 68 25V62C68 64.2091 66.2091 66 64 66H16C13.7909 66 12 64.2091 12 62V18Z"
          fill="url(#folder-gradient)"
        />
        <defs>
          <linearGradient id="folder-gradient" x1="40" y1="14" x2="40" y2="66" gradientUnits="userSpaceOnUse">
            <stop stopColor={lightAccent} />
            <stop offset="1" stopColor={accentColor} />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  // Sidebar configuration
  const fileManagerSidebar = {
    sections: [
      {
        title: 'Favourites',
        items: [
          { id: 'home', icon: Home, label: 'Home', action: () => navigateTo(homePath) },
          { id: 'desktop', icon: Monitor, label: 'Desktop', action: () => navigateTo(`${homePath}/Desktop`) },
          { id: 'documents', icon: FileText, label: 'Documents', action: () => navigateTo(`${homePath}/Documents`) },
          { id: 'downloads', icon: Download, label: 'Downloads', action: () => navigateTo(`${homePath}/Downloads`) },
          { id: 'pictures', icon: Image, label: 'Pictures', action: () => navigateTo(`${homePath}/Pictures`) },
          { id: 'music', icon: Music, label: 'Music', action: () => navigateTo(`${homePath}/Music`) },
        ]
      },
      {
        title: 'System',
        items: [
          { id: 'root', icon: HardDrive, label: '/', action: () => navigateTo('/') },
          { id: 'usr', icon: FolderOpen, label: '/usr', action: () => navigateTo('/usr') },
          { id: 'etc', icon: Settings, label: '/etc', action: () => navigateTo('/etc') },
        ]
      },
      {
        title: 'Locations',
        items: [
          { id: 'trash', icon: Trash2, label: 'Trash', action: () => navigateTo(`${homePath}/.Trash`) },
        ]
      },
    ]
  };

  const toolbar = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <button
          onClick={goBack}
          disabled={historyIndex === 0}
          className={`p-1.5 rounded-md transition-colors ${historyIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/5'}`}
        >
          <ChevronLeft className="w-4 h-4 text-white/50" />
        </button>
        <button
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
          className={`p-1.5 rounded-md transition-colors ${historyIndex >= history.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/5'}`}
        >
          <ChevronRight className="w-4 h-4 text-white/50" />
        </button>
        <div className="ml-3 px-3 py-1 bg-gray-700/50 rounded-md text-sm text-white/90">
          {getCurrentDirName()}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <button
            onClick={() => setAppState(s => ({ ...s, viewMode: 'grid' }))}
            className={`p-1.5 rounded-md transition-colors ${appState.viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5'
              }`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setAppState(s => ({ ...s, viewMode: 'list' }))}
            className={`p-1.5 rounded-md transition-colors ${appState.viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5'
              }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
        <button className="p-1.5 hover:bg-white/5 rounded-md transition-colors">
          <Search className="w-4 h-4 text-white/50" />
        </button>
      </div>
    </div>
  );

  const content = (
    <div className="flex-1 overflow-auto p-6">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-white/40">
          <FolderOpen className="w-16 h-16 mb-4" />
          <p>This folder is empty</p>
        </div>
      ) : appState.viewMode === 'grid' ? (
        <div className="grid grid-cols-6 gap-6">
          {items.map((item) => (
            <button
              key={item.name}
              onClick={() => setSelectedItem(item.name)}
              onDoubleClick={() => handleItemDoubleClick(item)}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/5 transition-colors group ${selectedItem === item.name ? 'bg-white/10' : ''
                }`}
            >
              <div className="w-20 h-20 flex items-center justify-center">
                {item.type === 'directory' ? (
                  getFileIcon(item) || getFolderIcon()
                ) : (
                  getFileIcon(item)
                )}
              </div>
              <div className="w-full text-center">
                <div className="text-sm text-white/90 truncate px-1">
                  {item.name}
                </div>
                {item.type === 'directory' && item.children && (
                  <div className="text-xs mt-0.5" style={{ color: accentColor }}>
                    {item.children.length} item{item.children.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {items.map((item) => (
            <button
              key={item.name}
              onClick={() => setSelectedItem(item.name)}
              onDoubleClick={() => handleItemDoubleClick(item)}
              className={`flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors ${selectedItem === item.name ? 'bg-white/10' : ''
                }`}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                {item.type === 'directory' ? (
                  <FolderOpen className="w-5 h-5" style={{ color: accentColor }} />
                ) : (
                  getFileIcon(item)
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm text-white/90">{item.name}</div>
              </div>
              <div className="text-xs text-white/40">
                {item.type === 'directory'
                  ? `${item.children?.length || 0} items`
                  : item.size ? `${item.size} bytes` : ''}
              </div>
              {item.permissions && (
                <div className="text-xs text-white/30 font-mono">
                  {item.permissions}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return <AppTemplate sidebar={fileManagerSidebar} toolbar={toolbar} content={content} />;
}