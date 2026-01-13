import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, Wrench, Palette, Book, FlaskConical, Sprout, Sparkles, Bug, Github } from 'lucide-react';
import pkg from '@/../package.json';
import { cn } from '@/components/ui/utils';
import { feedback } from '@/services/soundFeedback';

interface CreditsModalProps {
    onClose: () => void;
}

interface Contributor {
    name: string;
    role?: string;
    github?: string;
    description?: string;
    socials?: { label: string; url: string }[];
}

interface ContributorCategory {
    id: string; // Added for tab mapping
    title: string;
    icon: React.ElementType;
    type?: 'people' | 'text' | 'special';
    contributors?: Contributor[];
    content?: React.ReactNode;
}

const CREDITS_DATA: ContributorCategory[] = [
    {
        id: 'core',
        title: "Core Team",
        icon: Brain,
        type: 'people',
        contributors: [
            {
                name: "Cătălin-Robert Drăgoiu // mental.os()",
                role: "Creator & Maintainer",
                github: "https://github.com/mental-os",
                description: "Concept, architecture, design, narrative direction",
                socials: [
                    { label: "IG/mental.os", url: "https://www.instagram.com/mental.os" }
                ]
            }
        ]
    },
    {
        id: 'community',
        title: "Community",
        icon: Wrench,
        type: 'people',
        contributors: [
            { name: "Oklyne", role: "Code, Translation, Testing", github: "https://github.com/oklyne" },
            { name: "dannie203", role: "Code, Translation, Testing", github: "https://github.com/dannie203" },
            { 
                name: "nirgranthi", 
                role: "Code", 
                github: "https://github.com/nirgranthi",
                socials: [{ label: "IG/s.a.u.r.a.b_", url: "https://www.instagram.com/s.a.u.r.a.b_" }]
            },
            { name: "masterofmagic999", role: "Code, Testing", github: "https://github.com/masterofmagic999" },
            { name: "Marcx5", role: "Code", github: "https://github.com/Marcx5" }
        ]
    },
    {
        id: 'design',
        title: "Design & UX",
        icon: Palette,
        type: 'text',
        content: "(Visual systems, interaction concepts, UI explorations)"
    },
     {
        id: 'docs',
        title: "Docs",
        icon: Book,
        type: 'text',
        content: "(Guides, explanations, onboarding, clarifications)"
    },
     {
        id: 'testing',
        title: "Testing",
        icon: FlaskConical,
        type: 'text',
       content: "(Bug reports, edge cases, usability insights)"
    },
    {
        id: 'legacy',
        title: "Early Builders",
        icon: Sprout,
        type: 'text',
        content: "People who helped shape Aurora-OS.js in its early experimental phase — through feedback, discussion, or belief."
    },
     {
         id: 'special',
         title: "Special Thanks",
         icon: Sparkles,
         type: 'special',
         content: (
             <div className="text-white/70 leading-relaxed text-sm">
                 To BigD, <a href="https://github.com/hydroflame" target="_blank" rel="noreferrer" className="text-white hover:text-(--accent-user) underline decoration-white/30 hover:decoration-(--accent-user)">Hydroflame</a>, 
                 and the active contributors of <a href="https://github.com/hydroflame/bitburner-src" target="_blank" rel="noreferrer" className="text-white hover:text-(--accent-user) underline decoration-white/30 hover:decoration-(--accent-user)">Bitburner</a>,{" "}
                 <a href="https://github.com/viccano" target="_blank" rel="noreferrer" className="text-white hover:text-(--accent-user) underline decoration-white/30 hover:decoration-(--accent-user)">Victor Cano</a> and players like{" "}
                 <a href="https://www.reddit.com/user/reditO" target="_blank" rel="noreferrer" className="text-white hover:text-(--accent-user) underline decoration-white/30 hover:decoration-(--accent-user)">Michael Ray / reditO</a> of{" "}
                 <a href="https://store.steampowered.com/app/605230/Grey_Hack/" target="_blank" rel="noreferrer" className="text-white hover:text-(--accent-user) underline decoration-white/30 hover:decoration-(--accent-user)">Grey Hack</a>,{" "}
                 <a href="https://github.com/andersevenrud" target="_blank" rel="noreferrer" className="text-white hover:text-(--accent-user) underline decoration-white/30 hover:decoration-(--accent-user)">Anders Evenrud</a> of{" "}
                 <a href="https://github.com/os-js/OS.js" target="_blank" rel="noreferrer" className="text-white hover:text-(--accent-user) underline decoration-white/30 hover:decoration-(--accent-user)">OS.js</a>,{" "}
                 Sean Mann // Drizzly Bear of <a href="https://store.steampowered.com/app/469920/hackmud/" target="_blank" rel="noreferrer" className="text-white hover:text-(--accent-user) underline decoration-white/30 hover:decoration-(--accent-user)">Hackmud</a>,{" "}
                 <a href="https://github.com/eriksvedang" target="_blank" rel="noreferrer" className="text-white hover:text-(--accent-user) underline decoration-white/30 hover:decoration-(--accent-user)">Erik Svedäng</a> of{" "}
                 <a href="https://store.steampowered.com/app/400110/Else_HeartBreak/" target="_blank" rel="noreferrer" className="text-white hover:text-(--accent-user) underline decoration-white/30 hover:decoration-(--accent-user)">Else Heart.Break()</a>, 
                 and many others for inspiring me to create Aurora OS.js, and for keeping the genre alive with inspiring work and innovation.
             </div>
         )
     }
];

export function CreditsModal({ onClose }: CreditsModalProps) {
    const [activeTab, setActiveTab] = useState<string>('core');

    // Add 'Contribute' as a virtual tab for the UI
    const tabs = [
        ...CREDITS_DATA.map(c => ({ id: c.id, label: c.title, icon: c.icon })),
        { id: 'contribute', label: 'Contribute', icon: Bug }
    ];

    const activeCategory = CREDITS_DATA.find(c => c.id === activeTab);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="bg-zinc-900/95 border border-white/10 max-w-4xl w-full rounded-2xl shadow-2xl relative flex flex-col overflow-hidden max-h-[85vh]"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/5 bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                            <span className="text-xl">✨</span> 
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-wide">Credits</h2>
                            <p className="text-xs text-white/40 uppercase tracking-widest font-mono mt-0.5">Aurora OS.js v{pkg.version}</p>
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
                    <div className="w-64 bg-black/20 border-r border-white/5 p-4 space-y-1.5 overflow-y-auto custom-scrollbar shrink-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => { feedback.click(); setActiveTab(tab.id); }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200 uppercase tracking-wider",
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
                                className="h-full"
                            >
                                {activeTab === 'contribute' ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                                        <div className="p-6 rounded-full bg-(--accent-user)/10 text-(--accent-user) border border-(--accent-user)/20 shadow-[0_0_50px_rgba(var(--accent-user-rgb),0.2)]">
                                            <Bug className="w-12 h-12" />
                                        </div>
                                        <div className="space-y-2 max-w-md">
                                            <h3 className="text-2xl font-bold text-white">Find a bug? Want to contribute?</h3>
                                            <p className="text-white/60 leading-relaxed">
                                                Aurora OS.js is open source. Help us squash bugs, improve performance, or design the next big feature.
                                            </p>
                                        </div>
                                        <a 
                                            href="https://github.com/mental-os/Aurora-OS.js/issues" 
                                            target="_blank" 
                                            rel="noreferrer"
                                            onClick={() => feedback.click()}
                                            className="px-8 py-3 rounded-xl bg-(--accent-user) hover:bg-(--accent-user)/80 text-white font-bold transition-all shadow-lg shadow-(--accent-user)/20 hover:scale-105"
                                        >
                                            Report Issue on GitHub
                                        </a>
                                    </div>
                                ) : activeCategory ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                                             <activeCategory.icon className="w-6 h-6 text-white/20" />
                                             <h3 className="text-2xl font-bold text-white">{activeCategory.title}</h3>
                                        </div>

                                        {/* Variant: Special / Content */}
                                        {activeCategory.type === 'special' && activeCategory.content && (
                                            <div className="bg-white/5 rounded-xl p-8 border border-white/5 leading-loose">
                                                {activeCategory.content}
                                            </div>
                                        )}

                                        {/* Variant: Text (Simple) */}
                                        {activeCategory.type === 'text' && activeCategory.content && (
                                             <div className="px-1 py-8">
                                                <p className="text-white/60 italic leading-relaxed text-xl font-serif opacity-80 text-center">
                                                    {activeCategory.content}
                                                </p>
                                             </div>
                                        )}
                                        
                                        {/* Variant: People (Grid) */}
                                        {(!activeCategory.type || activeCategory.type === 'people') && activeCategory.contributors && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {activeCategory.contributors.map((contributor) => (
                                                    <div 
                                                        key={contributor.name}
                                                        className="group relative p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all flex flex-col gap-3"
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <div className="font-bold text-lg text-white group-hover:text-(--accent-user) transition-colors">
                                                                    {contributor.name}
                                                                </div>
                                                                {contributor.role && (
                                                                    <div className="text-xs font-mono text-white/60 uppercase tracking-wider mt-1">
                                                                        {contributor.role}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {contributor.github && (
                                                                <a 
                                                                    href={contributor.github}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="p-2 -mr-2 -mt-2 rounded-full hover:bg-white/10 text-white/30 hover:text-white transition-colors"
                                                                    title="GitHub Profile"
                                                                >
                                                                    <Github className="w-5 h-5" />
                                                                </a>
                                                            )}
                                                        </div>

                                                        {contributor.description && (
                                                            <p className="text-sm text-white/50 leading-relaxed border-l-2 border-white/5 pl-3">
                                                                {contributor.description}
                                                            </p>
                                                        )}

                                                        {contributor.socials && contributor.socials.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mt-auto pt-2">
                                                                {contributor.socials.map((social) => (
                                                                    <a
                                                                        key={social.url}
                                                                        href={social.url}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="text-[10px] px-2 py-1 rounded-md bg-white/5 hover:bg-(--accent-user)/20 text-white/40 hover:text-(--accent-user) transition-colors border border-white/5 hover:border-(--accent-user)/30"
                                                                    >
                                                                        {social.label}
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
                
                {/* Footer */}
                <div className="p-3 border-t border-white/5 bg-black/40 text-center text-[10px] text-white/20 font-mono uppercase tracking-wider">
                     AURORA OS.js • {activeTab === 'contribute' ? 'CONTRIBUTE' : 'CREDITS'} • THANK YOU FOR PLAYING
                </div>
            </motion.div>
        </div>
    );
}
