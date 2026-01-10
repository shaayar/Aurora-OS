import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Home, Star, Lock, AlertTriangle, X, Plus, Globe } from 'lucide-react';
import { AppTemplate } from './AppTemplate';
import { useAppStorage } from '../../hooks/useAppStorage';
import { cn } from '../ui/utils';
import { useI18n } from '../../i18n/index';
import { getWebsiteByDomain } from '../websites/registry';
import type { HistoryEntry } from '../websites/types';

interface Tab {
  id: string;
  url: string;
  renderedUrl: string;
  title: string;
  isLoading: boolean;
  progress: number;
  history: HistoryEntry[];
  historyIndex: number;
}

// Fallback tab to prevent crashes if state is empty
const FALLBACK_TAB: Tab = {
  id: 'fallback',
  url: 'browser://welcome',
  renderedUrl: 'browser://welcome',
  title: 'Welcome', // This is state, might need t() at render time or initial state? 
                    // State usually keeps the raw 'title'. Let's check where it's used.
                    // It's used in TabBar (tab.title).
                    // If we store 'Welcome', we can't translate easily later unless we store key?
                    // For now, let's look at the error screen which is easier.
  isLoading: false,
  progress: 0,
  history: [{ url: 'browser://welcome', title: 'Welcome', timestamp: new Date() }],
  historyIndex: 0
};

export function Browser({ owner }: { owner?: string }) {
  const { t } = useI18n();

  // Persisted state
  const [appState, setAppState] = useAppStorage('browser', {
    url: 'browser://welcome',
    bookmarks: [] as string[],
    history: [] as HistoryEntry[],
  }, owner);

  // Tabs State
  const [tabs, setTabs] = useState<Tab[]>(() => {
    const initialUrl = appState.url || 'browser://welcome';
    
    const sanitizedHistory = (appState.history || []).map(h => ({
      ...h,
      timestamp: new Date(h.timestamp)
    }));

    // Ensure we always start with at least one tab
    return [{
      id: 'default',
      url: initialUrl,
      renderedUrl: initialUrl,
      title: 'Welcome',
      isLoading: false,
      progress: 0,
      history: sanitizedHistory.length ? sanitizedHistory : [{ url: initialUrl, title: 'Welcome', timestamp: new Date() }],
      historyIndex: (sanitizedHistory.length || 1) - 1
    }];
  });

  const [activeTabId, setActiveTabId] = useState<string>('default');
  
  // FIX: Safe access to activeTab with fallback
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0] || FALLBACK_TAB;
  
  // FIX: Ensure activeTab is defined before accessing .url
  const [urlInput, setUrlInput] = useState(activeTab ? activeTab.url : 'browser://welcome');

  // Sync Input when Active Tab switches
  // We use state instead of ref to track changes during render safely.
  // This pattern updates state during render to avoid input flicker.
  const [prevTabId, setPrevTabId] = useState(activeTabId);
  if (prevTabId !== activeTabId) {
    setPrevTabId(activeTabId);
    setUrlInput(activeTab.url);
  }

  // Destructure properties needed for persistence to avoid depending on the entire 'activeTab' object.
  // This prevents the effect from running on every progress tick (which creates a new activeTab object).
  const { id: currentTabId, renderedUrl: currentRenderedUrl, history: currentHistory } = activeTab;

  // Persist current tab state and HISTORY
  useEffect(() => {
    if (currentTabId !== 'fallback') {
      setAppState(prev => ({
        ...prev,
        url: currentRenderedUrl,
        history: currentHistory
      }));
    }
  }, [currentTabId, currentRenderedUrl, currentHistory, setAppState]);

  const getActiveWebsite = () => {
    if (!activeTab) return null;
    const [urlPath] = activeTab.renderedUrl.split('?');
    return getWebsiteByDomain(urlPath);
  };

  const currentWebsite = getActiveWebsite();
  const WebsiteComponent = currentWebsite?.component;
  const isBookmarked = appState.bookmarks.includes(activeTab.renderedUrl);

  const getParams = () => {
    const [, queryString] = activeTab.renderedUrl.split('?');
    const params: Record<string, string> = {};
    if (queryString) {
      new URLSearchParams(queryString).forEach((value, key) => {
        params[key] = value;
      });
    }
    return params;
  };

  // --- Bookmark Logic ---
  const toggleBookmark = () => {
    const currentUrl = activeTab.renderedUrl;
    setAppState(prev => {
      const isPinned = prev.bookmarks.includes(currentUrl);
      if (isPinned) {
        return { ...prev, bookmarks: prev.bookmarks.filter(b => b !== currentUrl) };
      } else {
        return { ...prev, bookmarks: [...prev.bookmarks, currentUrl] };
      }
    });
  };

  // --- Tab Management ---
  const addTab = () => {
    const newTab: Tab = {
      id: crypto.randomUUID(),
      url: 'browser://welcome',
      renderedUrl: 'browser://welcome',
      title: 'New Tab',
      isLoading: false,
      progress: 0,
      history: [{ url: 'browser://welcome', title: 'New Tab', timestamp: new Date() }],
      historyIndex: 0
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setUrlInput('browser://welcome');
  };

  const closeTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      navigate('browser://welcome');
      return;
    }

    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    
    if (tabId === activeTabId) {
      const index = tabs.findIndex(t => t.id === tabId);
      const nextTab = newTabs[index - 1] || newTabs[0];
      
      if (nextTab) {
        setActiveTabId(nextTab.id);
        setUrlInput(nextTab.url);
      }
    }
  };

  // --- Navigation Logic ---
  const navigate = (url: string) => {
    const website = getWebsiteByDomain(url);
    const finalUrl = website ? website.domain : url;

    // 1. Update Tab to Loading State
    setTabs(prev => prev.map(t => {
      if (t.id !== activeTabId) return t;
      return { ...t, url: finalUrl, isLoading: true, progress: 10 };
    }));
    setUrlInput(finalUrl);

    // 2. Simulated Loading Sequence
    let currentProgress = 10;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 20;

      if (currentProgress >= 80) {
        clearInterval(interval);
        updateTabProgress(activeTabId, 80);
        
        setTimeout(() => {
          updateTabProgress(activeTabId, 100);
          setTimeout(() => {
            finishNavigation(activeTabId, finalUrl, website);
          }, 150);
        }, 400); 
      } else {
        updateTabProgress(activeTabId, currentProgress);
      }
    }, 50);
  };

  const updateTabProgress = (tabId: string, progress: number) => {
    setTabs(prev => prev.map(t => t.id === tabId ? { ...t, progress } : t));
  };

  const finishNavigation = (tabId: string, url: string, website: any) => {
    setTabs(prev => prev.map(t => {
      if (t.id !== tabId) return t;

      const newEntry: HistoryEntry = {
        url,
        title: website?.name || url,
        timestamp: new Date(),
        favicon: website?.color,
      };

      // If we navigated while in the middle of history, discard forward history
      const cleanHistory = t.history.slice(0, t.historyIndex + 1);
      
      return {
        ...t,
        isLoading: false,
        progress: 0,
        renderedUrl: url,
        title: website?.name || url,
        history: [...cleanHistory, newEntry],
        historyIndex: cleanHistory.length
      };
    }));
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) navigate(urlInput.trim());
  };

  const reload = () => navigate(activeTab.renderedUrl);
  const goHome = () => navigate('browser://welcome');
  
  const goBack = () => {
    if (activeTab.historyIndex > 0) {
      const prevIndex = activeTab.historyIndex - 1;
      const prevEntry = activeTab.history[prevIndex];
      
      setTabs(prev => prev.map(t => t.id === activeTabId ? {
        ...t,
        renderedUrl: prevEntry.url,
        url: prevEntry.url,
        title: prevEntry.title,
        historyIndex: prevIndex,
        // Don't show full loading bar for back navigation (snappier feel)
        isLoading: false 
      } : t));
      setUrlInput(prevEntry.url);
    }
  };

  const goForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      const nextIndex = activeTab.historyIndex + 1;
      const nextEntry = activeTab.history[nextIndex];
      
      setTabs(prev => prev.map(t => t.id === activeTabId ? {
        ...t,
        renderedUrl: nextEntry.url,
        url: nextEntry.url,
        title: nextEntry.title,
        historyIndex: nextIndex,
        isLoading: false
      } : t));
      setUrlInput(nextEntry.url);
    }
  };

  // --- Rendering ---
  const getSecurityIcon = () => {
    if (!currentWebsite) return <Lock className="w-3.5 h-3.5 text-gray-400" />;
    switch (currentWebsite.security) {
      case 'secure': return <Lock className="w-3.5 h-3.5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-3.5 h-3.5 text-yellow-600" />;
      case 'insecure': return <AlertTriangle className="w-3.5 h-3.5 text-red-600" />;
      default: return <Lock className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  // Helper for Bookmark Bar
  const getBookmarkDetails = (url: string) => {
    const [urlPath] = url.split('?');
    const website = getWebsiteByDomain(urlPath);
    return {
      title: website?.name || url,
      url: url,
      //icon: website?.icon || Globe        // Fallback icon, for future, when/if we decide to add icons for the sites
    };
  };

  const TabBar = (
    <div className="flex items-center w-full gap-1 overflow-x-auto no-scrollbar pl-1">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => setActiveTabId(tab.id)}
          className={cn(
            "group h-8 px-3 rounded-t-md flex items-center gap-2 min-w-[120px] max-w-[200px] transition-all cursor-pointer select-none border-b-2 relative",
            tab.id === activeTabId 
              ? "bg-white/10 border-blue-500" 
              : "hover:bg-white/5 border-transparent opacity-70 hover:opacity-100"
          )}
        >
          {tab.isLoading ? (
             <RotateCw className="w-3 h-3 animate-spin text-blue-400" />
          ) : (
             <span className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-blue-400/50" />
          )}
          <span className="text-white/90 text-xs truncate flex-1 font-medium">{tab.title}</span>
          <button 
            onClick={(e) => closeTab(e, tab.id)}
            className="text-white/20 hover:text-white/90 hover:bg-red-500/20 rounded p-0.5 transition-colors opacity-0 group-hover:opacity-100"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      <button 
        onClick={addTab}
        className="h-7 w-7 flex items-center justify-center rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors ml-1"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );

  const content = (
    <div className="flex flex-col min-h-full bg-gray-900 relative">
      {/* Navbar Container */}
      <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-md border-b border-white/10 shadow-sm flex flex-col">
        {/* Top Row: Navigation & URL */}
        <div className="flex items-center px-3 py-2 gap-2">
          <div className="flex items-center gap-1">
            <button 
              onClick={goBack} 
              disabled={activeTab.historyIndex <= 0} 
              className="p-1.5 rounded hover:bg-white/10 text-white/70 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={goForward} 
              disabled={activeTab.historyIndex >= activeTab.history.length - 1} 
              className="p-1.5 rounded hover:bg-white/10 text-white/70 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={reload} className="p-1.5 hover:bg-white/10 rounded text-white/70 transition-colors">
              <RotateCw className={cn("w-4 h-4", activeTab.isLoading && "animate-spin")} />
            </button>
            <button onClick={goHome} className="p-1.5 hover:bg-white/10 rounded text-white/70 transition-colors">
              <Home className="w-4 h-4" />
            </button>
          </div>

          {/* URL Bar */}
          <form onSubmit={handleUrlSubmit} className="flex-1 relative group">
            <div className="flex items-center gap-2 bg-black/40 rounded-full px-4 py-1.5 border border-white/5 group-focus-within:border-blue-500/50 group-focus-within:ring-2 group-focus-within:ring-blue-500/20 transition-all">
              {getSecurityIcon()}
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onFocus={(e) => e.target.select()}
                placeholder={t('browser.searchPlaceholder')}
                className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-white/30"
              />
              <button 
                type="button"
                onClick={toggleBookmark}
                className="focus:outline-none"
              >
                <Star 
                  className={cn(
                    "w-3.5 h-3.5 cursor-pointer transition-colors", 
                    isBookmarked ? "text-yellow-400 fill-yellow-400" : "text-white/30 hover:text-white/80"
                  )} 
                />
              </button>
            </div>
          </form>
        </div>

        {/* Bookmark Bar (Visible only if bookmarks exist) */}
        {appState.bookmarks.length > 0 && (
          <div className="flex items-center px-3 pb-2 gap-2 overflow-x-auto no-scrollbar">
            {appState.bookmarks.map((url, idx) => {
              const details = getBookmarkDetails(url);
              return (
                <button
                  key={idx}
                  onClick={() => navigate(url)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/10 text-xs text-white/80 transition-colors whitespace-nowrap max-w-[150px]"
                >
                  <Globe className="w-3 h-3 text-blue-400" />
                  <span className="truncate">{details.title}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Loading Bar */}
      {activeTab.isLoading && (
        <div className="absolute top-[53px] left-0 w-full h-0.5 bg-transparent z-30 pointer-events-none">
          <div 
            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all ease-out duration-300"
            style={{ width: `${activeTab.progress}%` }}
          />
        </div>
      )}

      {/* Website Content */}
      <div className="flex-1 overflow-y-auto relative bg-white h-full">
        {currentWebsite && WebsiteComponent ? (
          <WebsiteComponent
            domain={currentWebsite.domain}
            onNavigate={navigate}
            params={getParams()} 
            owner={owner}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-gray-900 text-white p-8">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-center max-w-md text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
              <h1 className="text-xl font-bold mb-2">{t('browser.error.pageNotFound')}</h1>
              <p className="text-white/50 mb-6 text-sm">
                {t('browser.error.pageNotFoundDesc', { url: activeTab.renderedUrl })}
              </p>
              <button onClick={goHome} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md transition-colors text-sm font-medium">
                 {t('browser.error.goHome')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return <AppTemplate toolbar={TabBar} content={content} hasSidebar={false} contentClassName="overflow-hidden" />;
}

// Menu Configuration
export const browserMenuConfig = {
  menus: ['File', 'Edit', 'View', 'Bookmarks', 'History'],
  items: {
    'File': [
      { label: 'New Tab', labelKey: 'browser.menu.newTab', shortcut: '⌘T', action: 'new-tab' },
      { label: 'Close Tab', labelKey: 'browser.menu.closeTab', shortcut: '⌘W', action: 'close-tab' },
    ],
    'Bookmarks': [
       { label: 'Bookmark This Tab', labelKey: 'browser.menu.bookmark', shortcut: '⌘D', action: 'bookmark' },
       { label: 'Show All Bookmarks', labelKey: 'browser.menu.showBookmarks', action: 'show-bookmarks' }
    ],
    'History': [
      { label: 'Clear History', labelKey: 'browser.menu.clearHistory', action: 'clear-history' }
    ]
  }
};