---
description: Version history and guidance
icon: arrows-rotate-reverse
---

# Changelog

{% updates format="full" %}
{% update date="2026-01-10" %}
## v0.8.3

App-by-app review and consistency update

<details>

<summary>Added</summary>

* **Context menu**: Each APP feeds context menu information the same way they feed Menu Bar items. Some apps may not have/require context menu items.
* **Finder**: Recursive search functionality aware of the current location.
* **Music**: Added support for scanning real metadata for files in `/src/assets/sounds` (was relying on filename before).

</details>

<details>

<summary>Improved</summary>

* **Standardized System Notifications**: All feedback notifications (errors, warnings, etc.) now use the same system notification component `notification.tsx`. These are different than App notifications that will go into the notification center (applet).
* **Finder**: Show item count in the sidebar for Favorites and for Locations sections. debar is aware of the existing folders in user's home directory.
* **Finder/Desktop**: Context menu copy/paste functionality.
* **Finder/Desktop**: Improved "Get Info" diagnostic display with rich, internationalized details (Permissions, Owner, Modified, Size).
* **All APPs**: Benefit from optimizations, especially in terms of React drawing and memory usage.
* **Notepad**: Opens with an empty state that propts user to open a file, instead of the clasic "first tab already open" - this gives the posibility to close all tabs.
* **Translation System**: Added `.scripts/check-identical-translations.js` to identify potentially untranslated strings by comparing locales against the English baseline.
* **I18n Coverage**: Fully localized missing strings in `de.ts`, `es.ts`, `fr.ts`, and `pt.ts`, and refined `ro.ts` for natural phrasing.
* **Translation System**: `.scripts/check-i18n.js` script find automatically missing or extra keys in translations as well as all the files in `/src/i18n/locales`. Additional workflow for translations is added in [TRANSLATION.md](https://github.com/mental-os/Aurora-OS.js/blob/main/TRANSLATION.md).

</details>

<details>

<summary>Fixed</summary>

* **Finder**: Drag-to-move to same location bug.
* **Finder**: Drag-to-move from one window to another now corectly checks for permissions (applies to Desktop too).
* **Finder**: Drop highlight issue when it stayed active in some cases.
* **Finder**: Terminal not passing the correct home path to Finder (eg. `su guest` > `finder ~` should open Finder as guest in `/home/guest`, but it opened in `/home/[user]`).
* **Notepad**: Tabs now remain active when closing and opening Notepad. Unsaved files prevent the app from closing.
* **Notepad**: Tabs now remember the mode of each tab (edit / preview) to prevent unwanted preview mode where it is not supported.
* **Music**: Ghost keys issue that appeared even if the app was not installed is now fixed.
* **Music**: The subsystem of scanning metadata, handleling Sound applet, etc. is tied to the actual launch of the Music app, avoiding issues like not having the Music app installed but still producing effects.

</details>
{% endupdate %}

{% update date="2026-01-09" %}
## v0.8.2

App-by-app review and consistency update

<details>

<summary>Added</summary>

* **Gamified Resource Monitor**: Implemented a global RAM monitoring system that simulates resource usage based on active/inactive user sessions, open windows, and background throttling.
* **Memory Applet**: Added a new applet that displays memory usage and provides a way to see memory usage in real-time.
* **Debugging Tools**: Exposed `window.aurora.checkRamUsage()` for real-time resource analysis in the console.
* **Internationalization (i18n)**: Complete translation support for **Battery Applet** and **Audio Applet** across 6 languages (en, es, fr, de, pt, ro).
* **Battery Metrics**: Added detailed battery health, cycle count, temperature, and voltage metrics (visible on supported hardware).
* **Browser**: Added support for multiple tabs (add, close, switch), and implemented bookmark storage, a toggleable star icon, and a bookmark bar that appears when items are saved.
* **Terminal**: Added the `history` command to show command history and clear it.
* **Support for Chinese (simplified) language**

</details>

<details>

<summary>Improved</summary>

* **Realistic App Resources**: Recalibrated all applications with "heavy" modern resource footprints (e.g., Browser \~450MB, DevCenter \~800MB) for better simulation accuracy.
* **Desktop Detection**: Battery applet now intelligently hides sensor data on desktop environments while preserving basic status.
* **Audio Applet**: Refactored to support dynamic localization keys.
* **Browser**: Added a simulated progress bar (loads to 80% -> pauses -> finishes) for better UX.
* **Menu Bar time**: Clicking the time switches from server time to local time.
* **Support for small screens**: Improved support for 1366x768 resolution, adapting the apps spawning position and size relative to the screen size.
* **Music App and applet**: Added seek bar control.
* **Docker**: is now responsive with an "show all apps" features for over 3 apps in the first section.
* **Code Quality**: Enhanced linting rules, resolved React hook dependency warnings, and standardized storage key management in `memory.ts`.

</details>

<details>

<summary>Fixed</summary>

* **Tooltip Alignment**: Fixed tooltip alignment for Docker (vertically centered).
* **Calendar**: Fixed date navigation alignment.

</details>
{% endupdate %}

{% update date="2026-01-06" %}
## v0.8.1

Added functional Mail app and adapted the system to accommodate.

<details>

<summary>Added</summary>

* **Mail App**: Added mail app with basic functionality, to be further enhanced by gameplay logic and features in 0.9.x (just like Messages app should be enhanced by gameplay logic and features in 0.9.x).
* **Browser App**: Vanilla core-websites that can be opened from the browser app. For now only TrustMail produces a result (eg. interoperability with Mail and filesystem).
* **Translation**: ro-RO (Romanian), de-DE (German), and pt-BR (Portuguese) standard language added.

</details>

<details>

<summary>Improved</summary>

* **Apps Main Menu**: Standardized to be included in \[app].tsx files.
* **System States**: Improved the restart/log-out/shutdown logic.
* **Apps**: Added user context to apps, so they can access user-specific data (eg. user specific home directory, user specific downloads directory, etc.)
* **Apps**: Cross-app communication (Browser's TrustMail tied to the Mail app).
* **Main Menu**: Added confirmation exit at "shutdown" and a force-save function, but also translation support (because Main Menu will be visible after language selection, too).
* **Environment**: Improved the synchronization between dev. and build modules (TS > Vite > Electron) and added environment variables for development and production (language sync, etc.).

</details>

<details>

<summary>Fixed</summary>

* **Terminal App**: Fixed issue with terminal app retaining history even after a hard wipe - it should persist only in case of a crash.

</details>

<details>

<summary>Know issues</summary>

* Had to regres `react-day-picker` to 8.10.1 as 9.13.0 was newer than the requirement of shadcn library (that we depend of) and broke the functionality.

No other new known issues reported in this release. You can contribute to the next release by [oppening an Issue](https://github.com/mental-os/Aurora-OS.js/issues) on the official [Aurora OS.js GitHub repository](https://github.com/mental-os/Aurora-OS.js).

</details>
{% endupdate %}

{% update date="2026-01-05" %}
## v0.8

Onboarding experience upon "New Game", core apps functional without placeholders, localization support.

<details>

<summary>Added</summary>

* **Onboarding Wizard**: A new "First Run Experience" (OOBE) that guides users through Language selection, Admin Account creation, and personalization.
* **User Management**: "Users & Groups" settings now support creating, deleting, and editing users (including Admin role toggle).
* **Admin Privileges**: Strict permission model where only `root` or `admin` group members can manage users.
* **Localization (i18n)**: Added foundational support for multi-language interfaces (i18next), starting with English.
* **App Store**: Added install feedback with progress bar dependant of app size and (future) installed hardware.

</details>

<details>

<summary>Improved</summary>

* **Storage Architecture**: Standardized system language persistence using `STORAGE_KEYS.LANGUAGE` (survives soft resets).
* **Build Optimization**: Configured Electron to only bundle necessary locales (`en`) to reduce package size.
* **Boot Sequence**: Fixed duplicate boot glitch and cleaned up the initial boot flow.
* **Ghost Directories**: Resolved the issue where `/home/user` was incorrectly created even when that user didn't exist.
* **Security**: `addUserToGroup` now correctly syncs between user objects and group lists.
* **Terminal**: Command history and visible output are now preserved while the user is still logged in (saves in case of crash).
* **Apps**: Apps now show size.

</details>

<details>

<summary>Know issues</summary>

* Had to regres `react-day-picker` to 8.10.1 as 9.13.0 was newer than the requirement of shadcn library (that we depend of) and broke the functionality.

No other new known issues reported in this release. You can contribute to the next release by [oppening an Issue](https://github.com/mental-os/Aurora-OS.js/issues) on the official [Aurora OS.js GitHub repository](https://github.com/mental-os/Aurora-OS.js).

</details>
{% endupdate %}

{% update date="2026-01-04" %}
## v0.7.9

Added functional Calendar app and adapted the system to accommodate.

<details>

<summary>Added</summary>

* **Calendar App:** with core functionality of adding, removing, and modifying an event. Calendar is one of the first apps that are file dependent, to enhance gameplay. It uses and references \~/.config/calendar.json to create hackable moments.
* CONTRIBUTION.md, CONTRIBUTORS.md

</details>

<details>

<summary>Improved</summary>

* **UI Immersion:** Text is now not selectable by default, except input area such as text area and fields.
* **Apps responsive design:** The sidebar of the apps uses a new way to determine if it requires the condensed or the relaxed variation of it based on the app window width.
* **Notifications:** Instead of the debugging "toast" we use the stylized notifications (success, warning, error).
* **Text highlight:** to follow accent color in input fields.
* **Agentic IDE:** Updated .gitignore to include .agent/rules/codeQuality.md that aims to create a base knowledge for code quality scans and future documentation (CODEBASE.md will be affected by this).
* **OPEN-SOURCE.md:** to reflect newest libs and dependences.

</details>

<details>

<summary>Removed</summary>

* **Videos App (placeholder):** Aurora OS.js experience won't include video files as game world element.
* **Videos Home Directory:** \~/Videos clean-up to not give users false impressions.

</details>

<details>

<summary>Know issues</summary>

* Had to regres `react-day-picker` to 8.10.1 as 9.13.0 was newer than the requirement of shadcn library (that we depend of) and broke the functionality.

No other new known issues reported in this release. You can contribute to the next release by [oppening an Issue](https://github.com/mental-os/Aurora-OS.js/issues) on the official [Aurora OS.js GitHub repository](https://github.com/mental-os/Aurora-OS.js).

</details>
{% endupdate %}

{% update date="2026-01-02" %}
## v0.7.8

UX quality of life enhancements for interacting with files visually.

<details>

<summary>Added</summary>

* **Multi-Selection:** Drag-selection and key-down selection support in both Finder and Desktop.
* **Smart User Provisioning:** New users (and Guest) now start with clean, empty home directories, while the default user retains sample content.

</details>

<details>

<summary>Improved</summary>

* **Grid Fluency:** Desktop grid logic improved for smoother icon snapping and collision handling.
* **Modern Standards:** Default support for ES2022 enhanced across the development environment.
* **Login Screen:** Polished UI consistency for user avatars and overall interface.

</details>

<details>

<summary>Fixed</summary>

* **Enhanced Drag & Drop:** Dragging multiple files between Finder and Desktop now works seamlessly.
* **App Store:** Permission issues when launching newly installed apps via Terminal resolved.
* **Music App:** Infinite scanning loops fixed and directory targeting improved (\~/Music or \~/).

</details>

<details>

<summary>Know issues</summary>

No new known issues reported in this release. You can contribute to the next release by [oppening an Issue](https://github.com/mental-os/Aurora-OS.js/issues) on the official [Aurora OS.js GitHub repository](https://github.com/mental-os/Aurora-OS.js).

</details>
{% endupdate %}
{% endupdates %}
