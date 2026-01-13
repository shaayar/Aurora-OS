import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Power, Play, Disc, Users } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { feedback } from '@/services/soundFeedback';
import { GameScreenLayout } from '@/components/Game/GameScreenLayout';
import { SettingsModal } from '@/components/Game/SettingsModal';
import { CreditsModal } from '@/components/Game/CreditsModal';
import { useI18n } from '@/i18n/index';
import { useFileSystem } from '@/components/FileSystemContext';

interface MainMenuProps {
    onNewGame: () => void;
    onContinue: () => void;
    canContinue: boolean;
}

interface MenuItem {
    id: string;
    label: string;
    icon: React.ElementType;
    disabled: boolean;
    action: () => void;
    desc: string;
}

export function MainMenu({ onNewGame, onContinue, canContinue }: MainMenuProps) {
    const { t } = useI18n();
    // Default select index: if can continue 0, else 1 (New Game)
    const [selected, setSelected] = useState(canContinue ? 0 : 1);
    const [showSettings, setShowSettings] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [showCredits, setShowCredits] = useState(false);
    const { saveFileSystem } = useFileSystem();

    const menuItems = useMemo<MenuItem[]>(() => [
        {
            id: 'continue',
            label: t('game.mainMenu.continue.label'),
            icon: Disc,
            disabled: !canContinue,
            action: onContinue,
            desc: canContinue
                ? t('game.mainMenu.continue.desc.canContinue')
                : t('game.mainMenu.continue.desc.noData')
        },
        {
            id: 'new-game',
            label: t('game.mainMenu.newGame.label'),
            icon: Play,
            disabled: false,
            action: onNewGame,
            desc: t('game.mainMenu.newGame.desc')
        },
        {
            id: 'settings',
            label: t('game.mainMenu.settings.label'),
            icon: Settings,
            disabled: false,
            action: () => setShowSettings(true),
            desc: t('game.mainMenu.settings.desc')
        },
        {
            id: 'exit',
            label: t('game.mainMenu.exit.label'),
            icon: Power,
            disabled: false,
            action: () => setShowExitConfirm(true),
            desc: t('game.mainMenu.exit.desc')
        }
    ], [canContinue, onContinue, onNewGame, t]);

    // Keyboard Navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (showSettings || showExitConfirm || showCredits) return;

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                setSelected(prev => {
                    const next = (prev - 1 + menuItems.length) % menuItems.length;
                    // Skip disabled items going up
                    if (menuItems[next].disabled) {
                        return (next - 1 + menuItems.length) % menuItems.length;
                    }
                    feedback.hover();
                    return next;
                });
                break;
            case 'ArrowDown':
                e.preventDefault();
                setSelected(prev => {
                    const next = (prev + 1) % menuItems.length;
                    // Skip disabled items going down
                    if (menuItems[next].disabled) {
                        return (next + 1) % menuItems.length;
                    }
                    feedback.hover();
                    return next;
                });
                break;
            case 'Enter':
            case ' ': {
                e.preventDefault();
                const item = menuItems[selected];
                if (item && !item.disabled) {
                    feedback.click();
                    item.action();
                }
                break;
            }
        }
    }, [menuItems, selected, showSettings, showExitConfirm, showCredits]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <GameScreenLayout zIndex={40000}>
            {/* Menu Options */}
            <div className="flex flex-col gap-4 w-[90%] md:w-full max-w-md">
                {menuItems.map((item, index) => (
                    <motion.button
                        key={item.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        disabled={item.disabled}
                        onClick={() => {
                            if (item.disabled) return;
                            feedback.click();
                            item.action();
                        }}
                        onMouseEnter={() => {
                            if (item.disabled || selected === index) return;
                            setSelected(index);
                            feedback.hover();
                        }}
                        className={cn(
                            "group relative w-full p-4 rounded-xl transition-all duration-200 border border-transparent outline-none",
                            !item.disabled && "hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] hover:shadow-lg cursor-pointer",
                            item.disabled && "opacity-50 grayscale cursor-not-allowed",
                            selected === index && !item.disabled && "bg-white/10 border-white/20 shadow-lg scale-[1.02]"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <item.icon className={cn(
                                "w-6 h-6 transition-colors",
                                item.disabled ? "text-zinc-500" : (selected === index ? "text-white" : "text-white/70")
                            )} />
                            <div className="flex-1 text-left">
                                <div className={cn(
                                    "text-lg font-bold tracking-wide transition-colors",
                                    item.disabled ? "text-zinc-500" : (selected === index ? "text-white" : "text-white/80")
                                )}>
                                    {item.label}
                                </div>
                                <div className={cn(
                                    "text-xs uppercase tracking-wider",
                                    item.disabled ? "text-zinc-600" : "text-white/40"
                                )}>
                                    {item.desc}
                                </div>
                            </div>
                            {selected === index && !item.disabled && (
                                <motion.div layoutId="cursor" className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                            )}
                        </div>
                    </motion.button>
                ))}

                {/* Footer / Credits */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 flex justify-center"
                >
                     <button
                        onClick={() => { feedback.click(); setShowCredits(true); }}
                        className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-white/20"
                    >
                        <Users className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors" />
                        <span className="text-xs font-medium text-white/40 group-hover:text-white/80 transition-colors tracking-wide uppercase">
                            Credits
                        </span>
                    </button>
                </motion.div>
            </div>

            {/* Settings Modal */}
            <AnimatePresence>
                {showSettings && (
                    <SettingsModal onClose={() => setShowSettings(false)} />
                )}
            </AnimatePresence>

            {/* Credits Modal */}
            <AnimatePresence>
                {showCredits && (
                    <CreditsModal onClose={() => setShowCredits(false)} />
                )}
            </AnimatePresence>

            {/* Exit Confirmation Modal (Styled) */}
            <AnimatePresence>
                {showExitConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="bg-zinc-900/90 border border-red-500/30 p-8 max-w-md w-full rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.2)] relative text-center"
                        >
                            <div className="flex flex-col items-center gap-6">
                                <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 shadow-inner">
                                    <Power className="w-10 h-10" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-white tracking-wide">{t('game.mainMenu.exit.confirm.title')}</h3>
                                    <p className="text-white/60">
                                        {t('game.mainMenu.exit.confirm.message')}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full mt-2">
                                    <button
                                        onClick={() => {
                                            feedback.click();
                                            setShowExitConfirm(false);
                                        }}
                                        className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors"
                                    >
                                        {t('game.mainMenu.exit.confirm.cancel')}
                                    </button>
                                    <button
                                        onClick={() => {
                                            feedback.click();
                                            saveFileSystem();
                                            window.close();
                                        }}
                                        className="px-6 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200 hover:text-white font-medium transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]"
                                    >
                                        {t('game.mainMenu.exit.confirm.confirm')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </GameScreenLayout>
    );
}