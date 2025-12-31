# Aurora OS.js
[![Version](https://img.shields.io/badge/Version-v0.7.6-blue)](https://github.com/mental-os/Aurora-OS.js) [![Build](https://github.com/mental-os/Aurora-OS.js/actions/workflows/ci.yml/badge.svg)](https://github.com/mental-os/Aurora-OS.js/actions/workflows/ci.yml) [![GitHub Pages](https://github.com/mental-os/Aurora-OS.js/actions/workflows/deploy.yml/badge.svg)](https://github.com/mental-os/Aurora-OS.js/actions/workflows/deploy.yml)

A hacking game where the operating system is the game.

Aurora OS.js is an experimental, open‑source OS‑simulation / hacking game framework built entirely with modern web technologies: React, Vite, Tailwind, and Electron.

It’s not a finished game — yet. It’s the foundation: a playable, extensible virtual operating system designed to host hacking mechanics, scripting, multiplayer systems, and emergent gameplay.

Think Hackmud × Grey Hack × else Heart.break(), but re‑imagined through a modern, web‑native OS layer.

## ✨ What exists right now

Even in its current proof‑of‑concept state, Aurora OS already solves the hard problems:

- 🗂 Virtual filesystem (persistent, sandboxed)
- 🧠 App lifecycle & OS‑level user flow
- 💻 Functional bash‑like terminal
- 🧩 Modular app architecture with context-aware Menu Bar system
- 📝 Notepad app with syntax highlighting for: .txt, .md, .js, .jsx, .css, .html, .sh, and more
- 🎛 Window management & desktop UX

This isn’t a mockup — it’s a living system that can already be extended, scripted, and broken.

## 🧭 Where This Is Going

Aurora OS is developed in clear evolutionary steps:
- **v1 — Game‑Ready OSCore OS polished into a natural, intuitive UX, with first game mechanics layered on top.**
- v1.5 — Single‑Player Alpha (Steam) — A playable hacking experience built on the OS, focused on exploration, scripting, and progression.
- v2 — Multiplayer Beta — Shared worlds, PvP/PvE systems, emergent player behavior.

The long‑term vision is an OS that feels real, but behaves like a game.

## 🧠 Why This Exists

I’m deeply inspired by hacking and programming‑driven games:
- Hackmud — brilliant multiplayer scripting
- Grey Hack — ambitious PvP and persistence
- Bitburner — elegant JavaScript sandboxing
- else Heart.break() — unmatched atmosphere and immersion

Each of them nailed something important — and each of them also felt like they stopped just short of broader reach or replayability.

When I discovered OS.js, a thought clicked instantly:
> What if the OS itself is the game engine?

Aurora OS.js began as that experiment — inspired by OS.js and Puter, but reshaped into a game‑first system.

## 🧪 Current Status

- Actively developed
- Architecture stabilizing
- UX polishing in progress
- Looking for **early testers, contributors, and curious minds**

This is the ideal phase to influence direction, architecture, and gameplay systems.

## Tech Stack

- **Framework**: React 19 (Vite 7)
- **Styling**: Tailwind CSS v4
- **UI Primitives**: Radix UI
- **Icons**: Lucide React
- **Animation**: Motion (Framer Motion)
- **Audio**: Howler.js
- **Charts**: Recharts
- **Components**: Sonner (Toasts), Vaul (Drawers), CMDK, React Day Picker
- **Testing**: Vitest

## 🚀 Getting Started

```bash
npm install
npm run dev
```
Or use the [GitHub Pages](https://mental-os.github.io/Aurora-OS.js) (LIVE DEMO)

## Release Notes (v0.7.6)

### Window Management
- **Maximize**: Fixed a bug where maximizing a window would not cover the entire screen.

### Modular Menu System
- **Per-App Menu Configurations**: Fully modularized the menu bar architecture. Applications now define their own specific menus (File, Edit, View, etc.) and actions, replaced the monolithic hardcoded system with a flexible `AppMenuConfig` registry.
- **Dynamic Action Dispatching**: Menu items now dispatch standardized `app-menu-action` events, allowing individual apps to handle commands like "Save", "Rotate", or "Play" without tightly coupling to the system shell.

### Polished Empty States
- **Enhanced Placeholder UI**: Replaced generic "Coming Soon" text with polished `EmptyState` components featuring app-specific iconography and descriptive messaging.
- **Coverage**: Applied to placeholder apps (Mail, Calendar, Videos) and "Work in Progress" sections within Settings (Network, Security, Storage) and DevCenter.

### [View full version history](HISTORY.md)

## 📝 License & Others

### Community
 - Discord (soon)
 - [mental.os() Universe](https://instagram.com/mental.os)

### Other links
 - [GitHub](https://github.com/mental-os/Aurora-OS.js)
 - [GitHub Pages](https://mental-os.github.io/Aurora-OS.js) (LIVE DEMO)
 - [GitBook](https://mental-os.gitbook.io/aurora-os.js) (soon)

### License
- **Licensed as**: [AGPL-3.0e](LICENSE)
- **Open-source code**: [OPEN-SOURCE.md](OPEN-SOURCE.md)
- **Contributing**: (soon)

### AI Disclosure
This project, "Aurora OS," is human-written, with AI tools assisting in documentation, GitHub integrations, bug testing, and roadmap tracking. As soon as this project is ready for release, all the AI tools will be removed and the generated content (audio, images, etc.) will be human-created.