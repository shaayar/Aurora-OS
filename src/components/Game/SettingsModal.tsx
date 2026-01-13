import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Monitor, RefreshCw, Trash2, X, Speaker, Laptop, Settings, Check } from 'lucide-react';
import pkg from '@/../package.json';
import { cn } from '@/components/ui/utils';
import { feedback } from '@/services/soundFeedback';
import { soundManager } from '@/services/sound';
import { useFileSystem } from '@/components/FileSystemContext';
import { useI18n } from '@/i18n/index';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useAppContext } from '@/components/AppContext';
import { SUPPORTED_LOCALES } from '@/i18n/translations';

interface SettingsModalProps {
    onClose: () => void;
}

type Tab = 'display' | 'audio' | 'system';

export function SettingsModal({ onClose }: SettingsModalProps) {
    const { t } = useI18n();
    const [activeTab, setActiveTab] = useState<Tab>('display');
    const { resetFileSystem } = useFileSystem();
    
    // Core state from AppContext
    const { 
        blurEnabled, setBlurEnabled,
        disableShadows, setDisableShadows,
        disableGradients, setDisableGradients,
        reduceMotion, setReduceMotion,
        locale, setLocale
    } = useAppContext();

    // Volume state
    const [volumes, setVolumes] = useState({
        master: soundManager.getVolume('master') * 100,
        music: soundManager.getVolume('music') * 100,
        sfx: soundManager.getVolume('ui') * 100 // Use UI as proxy for SFX group
    });

    // Fullscreen
    const { isFullscreen, toggleFullscreen: toggleFullscreenBase } = useFullscreen();
    const toggleFullscreen = () => {
        feedback.click();
        toggleFullscreenBase();
    };

    // Determine current graphics preset
    const getPreset = () => {
        if (blurEnabled && !disableShadows && !disableGradients) return 'ultra';
        if (!blurEnabled && disableShadows && disableGradients) return 'performance';
        return 'custom';
    };

    const applyPreset = (preset: 'ultra' | 'performance') => {
        feedback.click();
        if (preset === 'ultra') {
            setBlurEnabled(true);
            setDisableShadows(false);
            setDisableGradients(false);
        } else {
            setBlurEnabled(false);
            setDisableShadows(true);
            setDisableGradients(true);
        }
    };

    const updateVolume = (category: 'master' | 'music' | 'sfx', val: number) => {
        setVolumes(prev => ({ ...prev, [category]: val }));
        if (category === 'master') soundManager.setVolume('master', val / 100);
        else if (category === 'music') soundManager.setVolume('music', val / 100);
        else {
            // Group SFX
            soundManager.setVolume('ui', val / 100);
            soundManager.setVolume('system', val / 100);
            soundManager.setVolume('feedback', val / 100);
        }
    };

    const handleSoftReset = () => {
        if (confirm(t('game.bios.softResetConfirm'))) {
            window.location.reload();
        }
    };

    const handleFactoryReset = () => {
        if (confirm(t('game.bios.factoryResetConfirm'))) {
            feedback.click();
            resetFileSystem();
            setTimeout(() => window.location.reload(), 500);
        }
    };

    const tabs = [
        { id: 'display', icon: Monitor, label: 'Display' },
        { id: 'audio', icon: Speaker, label: 'Audio' },
        { id: 'system', icon: Laptop, label: 'System' },
    ] as const;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="bg-zinc-900/95 border border-white/10 max-w-2xl w-full rounded-2xl shadow-2xl relative flex flex-col overflow-hidden max-h-[85vh]"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/5 bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                            <Settings className="w-5 h-5 text-white/70" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-wide">{t('game.bios.title')}</h2>
                            <p className="text-xs text-white/40 uppercase tracking-widest font-mono mt-0.5">Configuration Utility</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { feedback.click(); onClose(); }}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-48 bg-black/20 border-r border-white/5 p-4 space-y-2 shrink-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => { feedback.click(); setActiveTab(tab.id as Tab); }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                    activeTab === tab.id
                                        ? "bg-white text-black shadow-lg shadow-white/10 scale-[1.02]"
                                        : "text-white/60 hover:text-white hover:bg-white/5 hover:scale-[1.02]"
                                )}
                            >
                                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-black" : "text-white/50")} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-8 overflow-y-auto bg-white/2">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-8"
                            >
                                {activeTab === 'display' && (
                                    <>
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider">{t('game.bios.fullScreen')}</h3>
                                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                                <div className="flex items-center gap-3 text-white/80">
                                                    <Monitor className="w-5 h-5" />
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{t('game.bios.fullScreen')}</span>
                                                        <span className="text-xs text-white/40">{t('game.bios.immersiveMode')}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={toggleFullscreen}
                                                    className={cn(
                                                        "px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border",
                                                        isFullscreen
                                                            ? "bg-white text-black border-white hover:bg-white/90"
                                                            : "bg-transparent text-white border-white/20 hover:bg-white/10"
                                                    )}
                                                >
                                                    {isFullscreen ? t('game.bios.fullScreenExit') : t('game.bios.fullScreenEnter')}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider">Graphics Quality</h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => applyPreset('ultra')}
                                                    className={cn(
                                                        "p-4 rounded-xl border text-left transition-all relative overflow-hidden",
                                                        getPreset() === 'ultra'
                                                            ? "bg-white/10 border-white/40 shadow-lg"
                                                            : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                                                    )}
                                                >
                                                    <div className="relative z-10">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <div className="font-bold text-white">High Fidelity</div>
                                                            {getPreset() === 'ultra' && <Check className="w-4 h-4 text-white" />}
                                                        </div>
                                                        <div className="text-xs text-white/50">Blur, Shadows, Vibrancy.</div>
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={() => applyPreset('performance')}
                                                    className={cn(
                                                        "p-4 rounded-xl border text-left transition-all relative overflow-hidden",
                                                        getPreset() === 'performance'
                                                            ? "bg-white/10 border-white/40 shadow-lg"
                                                            : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                                                    )}
                                                >
                                                     <div className="relative z-10">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <div className="font-bold text-white">Performance</div>
                                                            {getPreset() === 'performance' && <Check className="w-4 h-4 text-white" />}
                                                        </div>
                                                        <div className="text-xs text-white/50">Max FPS. No effects.</div>
                                                    </div>
                                                </button>
                                            </div>
                                            
                                            {/* Advanced Toggles */}
                                            <div className="pt-2 grid grid-cols-2 gap-2">
                                                <button 
                                                    onClick={() => setReduceMotion(!reduceMotion)}
                                                    className={cn("text-xs p-2 rounded-lg border text-center transition-all", reduceMotion ? "bg-white/10 border-white/30 text-white" : "bg-transparent border-transparent text-white/30 hover:bg-white/5")}  
                                                >
                                                    Reduce Motion
                                                </button>
                                                <button 
                                                   onClick={() => setDisableGradients(!disableGradients)}
                                                   className={cn("text-xs p-2 rounded-lg border text-center transition-all", disableGradients ? "bg-white/10 border-white/30 text-white" : "bg-transparent border-transparent text-white/30 hover:bg-white/5")}  
                                                >
                                                    Simple Colors
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'audio' && (
                                    <div className="space-y-8">
                                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-6">
                                            {/* Master */}
                                            <div className="space-y-4">
                                                <div className="flex justify-between text-white/80">
                                                     <span className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider">
                                                        <Volume2 className="w-4 h-4" /> Master
                                                    </span>
                                                    <span className="font-mono text-sm text-white/50">{volumes.master}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0" max="100"
                                                    value={volumes.master}
                                                    onChange={(e) => updateVolume('master', parseInt(e.target.value))}
                                                    className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                                                />
                                            </div>

                                            <div className="h-px bg-white/10" />

                                            {/* Music */}
                                             <div className="space-y-3">
                                                <div className="flex justify-between text-white/80">
                                                    <span className="font-medium text-sm text-white/70">Music</span>
                                                    <span className="font-mono text-xs text-white/40">{volumes.music}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0" max="100"
                                                    value={volumes.music}
                                                    onChange={(e) => updateVolume('music', parseInt(e.target.value))}
                                                    className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/70 hover:[&::-webkit-slider-thumb]:bg-white transition-all"
                                                />
                                            </div>

                                            {/* SFX */}
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-white/80">
                                                    <span className="font-medium text-sm text-white/70">SFX & Interface</span>
                                                    <span className="font-mono text-xs text-white/40">{volumes.sfx}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0" max="100"
                                                    value={volumes.sfx}
                                                    onChange={(e) => updateVolume('sfx', parseInt(e.target.value))}
                                                    className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/70 hover:[&::-webkit-slider-thumb]:bg-white transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'system' && (
                                    <>
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider">{t('settings.appearance.languageTitle')}</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {SUPPORTED_LOCALES.map((l) => (
                                                    <button
                                                        key={l.locale}
                                                        onClick={() => { feedback.click(); setLocale(l.locale); }}
                                                        className={cn(
                                                            "flex justify-between items-center p-3 rounded-lg border transition-all",
                                                            locale === l.locale
                                                                ? "bg-white/10 border-white/30 text-white"
                                                                : "bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                                                        )}
                                                    >
                                                        <span className="text-sm font-medium">{l.label}</span>
                                                        {locale === l.locale && <Check className="w-3 h-3 text-white" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-8 space-y-4">
                                            <h3 className="text-sm font-bold text-red-400/50 uppercase tracking-wider">Danger Zone</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    onClick={handleSoftReset}
                                                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/30 transition-all group"
                                                >
                                                    <RefreshCw className="w-6 h-6 text-blue-400 group-hover:rotate-180 transition-transform duration-500" />
                                                    <span className="text-sm font-medium text-blue-100">{t('game.bios.softReset')}</span>
                                                    <span className="text-[10px] text-white/30">{t('game.bios.softResetHint')}</span>
                                                </button>

                                                <button
                                                    onClick={handleFactoryReset}
                                                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 transition-all group"
                                                >
                                                    <Trash2 className="w-6 h-6 text-red-400 group-hover:shake" />
                                                    <span className="text-sm font-medium text-red-100">{t('game.bios.factoryReset')}</span>
                                                    <span className="text-[10px] text-white/30">{t('game.bios.factoryResetHint')}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
                
                {/* Footer */}
                <div className="p-3 border-t border-white/5 bg-black/40 text-center text-[10px] text-white/20 font-mono uppercase tracking-wider">
                    {pkg.build.productName} v{pkg.version} • {activeTab.toUpperCase()} CONFIG • {t('game.bios.footer.moreSettings')}
                </div>
            </motion.div>
        </div>
    );
}
