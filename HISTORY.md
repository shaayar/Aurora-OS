# Version History

## v0.6.2-patch5
- **Messages Redesign**: Completely revamped the Messages app with a sleek, borderless list view, adaptive layout (Finder-style), and colored chat bubbles.
- **Auto-scroll**: Implemented smart auto-scroll for Messages that targets only the chat container, preventing app-wide layout shifts.
- **Code Standardization**: Refactored core apps (`Music`, `Photos`, `Browser`, `Finder`) and UI components (`Window`, `Dock`, `MenuBar`) to use consistent `cn` utility for styling and standardized imports.
- **Responsiveness**: Fixed overflow and cropping issues in Messages and Music apps, ensuring perfect scaling down to compact mobile sizes.

## v0.6.2-patch4
- **Terminal**: Improved ZSH-like experience with autocomplete, command history, pipe support, wildcard support, and more.
- **Finder**: Improved item selecting/deselecting and added the Trash functionality.
- **Dock**: Improved app icon behavior and added the Trash functionality.
- **App bar**: Removed the search icon as it is not planned to be implemented in the near future.

## v0.6.2-patch3

- **Desktop**: Added dragging constrains to prevent Windows going off-screen.
- **Filesystem**: Improved special folders consistency (.Trash and .Config).
- **Finder**: Fixed visibility of hidden files. Terminal will show hidden files.
- **Dock**: Fixed active Window dot indicator to respect the accent color.
- **Terminal**: Fixed path display in prompt.
- **Finder**: Added full-path breadcrumbs to navigate through directories, with drag-to-move functionality.
- **Finder**: Fixed breadcrumbs to show correct path if opened from Terminal.
- **Environment**: Added Content Security Policy (CSP) to prevent XSS attacks, and other various web-standard security measures.

## v0.6.2-patch2
- **Unified Desktop Aesthetics**: Removed unselected "pill" backgrounds from Desktop icons and aligned text truncation with Finder (single-line).
- **Window Focus UX**: Enabled "Click to Focus" on window content while restricting drag operations to the title bar.
- **Scroll Regressions**: Fixed scrolling issues in Settings, Photos, and Browser apps caused by template refactors.
- **Performance**: Refactored File System logic into utilities and implemented debounced persistence to prevent UI stuttering.

## v0.6.2-patch
- **Build System Fix**: Restored CSS functionality by migrating to a standard Tailwind CSS v4 build pipeline with `@tailwindcss/postcss`.
- **Desktop**: Now uses a grid system inspired by Windows 11. Icons are now cosistend across Desktop and Finder. Drag-and-move functionality.
- **UI Restoration**: Fixed missing scrollbar styling and terminal colors.
- **File System**: Now uses UID for every file and directory instead of name.
- **Terminal**: Improved path resolution to handle absolute paths for user directories (e.g., `/Desktop` -> `~/Desktop`). Consistency with the icons in Finder.
- **Finder**: Fixed issues with dropping files onto sidebar shortcuts. Items organized by name.
- **System Settings**: Performance toggle for gradients across icons and other subtle places.
- **Other**: Repository badges are now simplified.

## v0.6.2
- **Settings Grid Layouts**: Standardized grids in Appearance, Theme Mode, and Theme sections with fixed aspect ratios (1:1 and 16:9) for consistent responsive design.
- **Theme Enhancements**: Implemented dynamic gradients for Theme Mode cards (Neutral/Contrast) and introduced a diverse "2025" Color Palette.
- **Dynamic Versioning**: "About" tab now displays the live application version from package.json.
- **Default Preferences**: Updated default accent color to Indigo (#5755e4) and fixed compatibility with HTML color inputs.

## v0.6.1
- **Desktop Mirroring**: Live synchronization between `~/Desktop` directory and the Desktop UI.
- **Terminal App Launch**: Launch apps (Finder, Browser, etc.) via Terminal with argument support (`Finder /home`).
- **Terminal Enhancements**: Fixed path resolution (`mkdir`, `touch`), added Tab autocomplete, and PATH scanning.
- **Settings**: Added "Danger Zone" with Soft Reset and Hard Reset options.

## v0.6.0
- **Virtual Filesystem**: Linux-inspired filesystem with `/bin`, `/etc`, `/home`, `/var`, and more.
- **Terminal Integration**: Full command-line interface (`ls`, `cd`, `cat`, `mkdir`, `rm`, `whoami`, `hostname`) connected to virtual filesystem.
- **Persistence Layer**: Settings, desktop icons, filesystem, and app states saved to localStorage.
- **App Storage Hook**: New `useAppStorage` hook enabling all apps to persist their state.
- **Window Improvements**: State preservation on minimize/restore, smooth dock-directed animations, auto-focus on next window.
- **Independent Windows**: Multiple Finder/Terminal windows now have independent navigation state.

## v0.5.2
- **Tech Stack Overhaul**: Upgraded to React 19, Vite 7, and Recharts 3.
- **CI/CD**: Added GitHub Actions workflow for automated testing.
- **Code Quality**: Implemented ESLint and fixed code consistency issues.

## v0.5.1
- **Native App Support**: Packaged with Electron for Windows.
- **Window Frame Option**: Added `--frame` flag / `WINDOW_FRAME` env var for native window management.
- **Performance**: Added "Reduce Motion" and "Disable Shadows" settings affecting all system components.
- **Applet Optimizations**: Notification Center and Desktop now respect performance settings.

## v0.5.0
- **Renamed to Aurora OS.js**.
- Implemented Radix UI Checkbox for settings.
- Fixed visual inconsistencies in Switch component.
- Improved window management and dock behavior.
- Refactored multiple apps for consistency.
