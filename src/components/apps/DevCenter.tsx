import { useState } from 'react';
import { Terminal, Code, Cpu, Activity, PartyPopper, Bell, Volume2, HardDrive, FileJson, RefreshCw, Trash2 } from 'lucide-react';
import { AppTemplate } from './AppTemplate';
import { notify } from '../../lib/notifications';
import { feedback } from '../../lib/soundFeedback';
import { getStorageStats, formatBytes } from '../../utils/memory';
import { useFileSystem } from '../../components/FileSystemContext';

const devSidebar = {
    sections: [
        {
            title: 'General',
            items: [
                { id: 'dashboard', label: 'Dashboard', icon: Activity },
            ]
        },
        {
            title: 'Interface',
            items: [
                { id: 'UI', label: 'UI & Sounds', icon: PartyPopper },
            ]
        },
        {
            title: 'System',
            items: [
                { id: 'storage', label: 'Storage', icon: HardDrive },
                { id: 'filesystem', label: 'File System', icon: FileJson },
                { id: 'logs', label: 'System Logs', icon: Terminal },
            ]
        },
        {
            title: 'Tools',
            items: [
                { id: 'editor', label: 'Editor', icon: Code },
                { id: 'performance', label: 'Performance', icon: Cpu },
            ]
        }
    ]
};

export function DevCenter() {
    const { fileSystem, resetFileSystem } = useFileSystem();
    const [activeTab, setActiveTab] = useState('dashboard');

    const renderContent = () => {
        switch (activeTab) {
            case 'UI':
                return (
                    <div className="p-6 h-full overflow-y-auto">
                        <div className="max-w-4xl mx-auto space-y-8">
                            {/* System Notifications */}
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <Bell className="w-5 h-5 text-white" />
                                    <h2 className="text-xl text-white font-medium">System Notifications</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => notify.system('success', 'DevCenter', 'Operation completed successfully')}
                                        className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all text-left group"
                                    >
                                        <div className="font-medium text-green-400 mb-1 group-hover:text-green-300">Success Toast</div>
                                        <div className="text-sm text-white/50">Triggers a success notification with sound</div>
                                    </button>
                                    <button
                                        onClick={() => notify.system('warning', 'DevCenter', 'System resources are running low')}
                                        className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-all text-left group"
                                    >
                                        <div className="font-medium text-yellow-400 mb-1 group-hover:text-yellow-300">Warning Toast</div>
                                        <div className="text-sm text-white/50">Triggers a warning notification with sound</div>
                                    </button>
                                    <button
                                        onClick={() => notify.system('error', 'DevCenter', 'Failed to connect to server')}
                                        className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all text-left group"
                                    >
                                        <div className="font-medium text-red-400 mb-1 group-hover:text-red-300">Error Toast</div>
                                        <div className="text-sm text-white/50">Triggers an error notification with sound</div>
                                    </button>
                                </div>
                            </section>

                            {/* Sound Feedback */}
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <Volume2 className="w-5 h-5 text-white" />
                                    <h2 className="text-xl text-white font-medium">Sound Feedback</h2>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <button
                                        onClick={() => feedback.click()}
                                        className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center"
                                    >
                                        <span className="text-white/80">Click</span>
                                    </button>
                                    <button
                                        onClick={() => feedback.hover()}
                                        onMouseEnter={() => feedback.hover()}
                                        className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center"
                                    >
                                        <span className="text-white/80">Hover</span>
                                    </button>
                                    <button
                                        onClick={() => feedback.folder()}
                                        className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center"
                                    >
                                        <span className="text-white/80">Folder Open</span>
                                    </button>
                                    <button
                                        onClick={() => feedback.windowOpen()}
                                        className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center"
                                    >
                                        <span className="text-white/80">Window Open</span>
                                    </button>
                                    <button
                                        onClick={() => feedback.windowClose()}
                                        className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center"
                                    >
                                        <span className="text-white/80">Window Close</span>
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                );
            case 'storage':
                // eslint-disable-next-line no-case-declarations
                const stats = getStorageStats();
                return (
                    <div className="p-6 h-full overflow-y-auto">
                        <h2 className="text-xl text-white mb-6">Storage Inspector</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                                <div className="text-sm text-white/50 mb-1">Soft Memory (Preferences)</div>
                                <div className="text-2xl text-white font-mono">{formatBytes(stats.softMemory.bytes)}</div>
                                <div className="text-xs text-white/30">{stats.softMemory.keys} keys</div>
                            </div>
                            <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                                <div className="text-sm text-white/50 mb-1">Hard Memory (Filesystem)</div>
                                <div className="text-2xl text-white font-mono">{formatBytes(stats.hardMemory.bytes)}</div>
                                <div className="text-xs text-white/30">{stats.hardMemory.keys} keys</div>
                            </div>
                        </div>

                        <h3 className="text-lg text-white mb-4">Local Storage Keys</h3>
                        <div className="bg-black/20 rounded-lg border border-white/10 overflow-hidden">
                            {Object.keys(localStorage).map(key => (
                                <div key={key} className="flex items-center justify-between p-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                    <div className="font-mono text-xs text-white/70 truncate mr-4" title={key}>{key}</div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-xs text-white/30 whitespace-nowrap">
                                            {formatBytes(new Blob([localStorage.getItem(key) || '']).size)}
                                        </div>
                                        <button
                                            onClick={() => {
                                                localStorage.removeItem(key);
                                                notify.system('success', 'Storage', `Deleted key: ${key}`);
                                            }}
                                            className="text-white/30 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'filesystem':
                // eslint-disable-next-line no-case-declarations
                return (
                    <div className="p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl text-white">File System Debugger</h2>
                            <button
                                onClick={() => {
                                    if (confirm('Reset entire filesystem? This cannot be undone.')) {
                                        resetFileSystem();
                                        notify.system('warning', 'FileSystem', 'Filesystem reset to initial state');
                                    }
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all text-sm"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reset FS
                            </button>
                        </div>
                        <div className="flex-1 bg-black/40 rounded-lg p-4 font-mono text-xs text-blue-300 overflow-y-auto border border-white/10 whitespace-pre">
                            {JSON.stringify(fileSystem, null, 2)}
                        </div>
                    </div>
                );
            case 'logs':
                return (
                    <div className="p-6 h-full flex flex-col">
                        <h2 className="text-xl text-white mb-4">System Logs</h2>
                        <div className="flex-1 bg-black/40 rounded-lg p-4 font-mono text-sm text-green-400 overflow-y-auto border border-white/10">
                            <div className="opacity-50">[System] Kernel initialized...</div>
                            <div className="opacity-50">[System] Loading drivers...</div>
                            <div>[Auth] User 'drago' logged in</div>
                            <div>[App] DevCenter launched</div>
                        </div>
                    </div>
                );
            case 'editor':
                return (
                    <div className="flex flex-col items-center justify-center h-full text-white/50 space-y-4">
                        <Code className="w-16 h-16 opacity-50" />
                        <h2 className="text-xl font-medium text-white/80">Code Editor</h2>
                        <p>Monaco editor integration coming soon.</p>
                    </div>
                );
            case 'performance':
                return (
                    <div className="flex flex-col items-center justify-center h-full text-white/50 space-y-4">
                        <Cpu className="w-16 h-16 opacity-50" />
                        <h2 className="text-xl font-medium text-white/80">Performance Monitor</h2>
                        <p>Real-time CPU/RAM metrics coming soon.</p>
                    </div>
                );
            case 'dashboard':
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full text-white/50 space-y-4">
                        <Activity className="w-16 h-16 opacity-50" />
                        <h2 className="text-xl font-medium text-white/80">Developer Dashboard</h2>
                        <p>Welcome to the Aurora OS Developer Center.</p>
                    </div>
                );
        }
    };

    return (
        <AppTemplate
            sidebar={devSidebar}
            content={renderContent()}
            activeItem={activeTab}
            onItemClick={setActiveTab}
        />
    );
}
