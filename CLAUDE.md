# CLAUDE.md - Rules for Claude Code

## Section 0 — Top Priority Principles
- **Project**: Chrome Resizer Extension. Chrome extension to instantly resize browser windows to specific resolutions.
- **Language/Stack**: HTML, CSS, JavaScript (Chrome Extension Manifest V3)
- **Rules**: Core extension logic resides in `popup.js` and `background.js`. UI is managed via `popup.html` and `popup.css`.
- **Constraint**: Ensure `manifest.json` compatibility with Manifest V3 restrictions (e.g., service workers instead of background pages).

## Section 1 — Repository Structure
```text
Chrome Resizer Extension/
├── .github/             # GitHub templates and workflows
├── icons/               # Extension icons (16, 32, 48, 128)
├── scripts/             # Local tooling scripts
├── background.js        # Service worker for hotkeys and background processes
├── manifest.json        # Extension configuration (Manifest V3)
├── popup.css            # Styles for the extension popup (Light/Dark themes)
├── popup.html           # HTML template for the extension popup
└── popup.js             # Logic for popup interactions
```

- **`background.js`**: Handles background behavior like command listeners (shortcuts) and first-time installation setup.
- **`popup.js`**: Drives the user interface, managing DOM state and bridging storage.
- **`scripts/make-icons.js`**: Zero-dependency Node script to generate the icon sets.

## Section 2 — Development Rules
- **Naming Conventions**: Use `camelCase` for JS variables, `kebab-case` for file names and CSS classes.
- **Styling**: Stick to Vanilla CSS. Use CSS variables for theming (dark/light mode).
- **Format**: Rely on standard Prettier formatting if integrated, or fallback to clean, legible indentation (2 spaces).

## Section 3 — Git Rules
### Allowed Commands
- `git status`
- `git diff [--cached] [--stat] [file]`
- `git log [--oneline] [-n N]`
- `git add <specific-files>`     # Must specify files explicitly
- `git commit -m "..."`
- `git push`                     # Only when explicitly requested

### Prohibited Actions
- `git add -A`              # Full staging prohibited
- `git add .`               # Full staging prohibited
- `git push --force`        # Force push prohibited
- `git reset --hard`        # Hard reset prohibited

### Commit Format
Conventional Commits style with scope (e.g. `feat`, `fix`, `docs`, `chore`).
- `feat(popup): add new custom resolution preset`
- `fix(background): resolve hotkey conflict`

### Branching
Use prefixes: `feature/`, `fix/`, `chore/`

## Section 4 — Workflow
- **Plan Mode**: Always form an `implementation_plan.md` artifact before making broad, structural modifications or applying complex DOM logic.
- **Verification**: Local Chrome testing validation is typically required. Update components to be simple and directly isolated.

## Section 5 — Task Management
- Initialize task tracking in an artifact or `tasks/todo.md`.
- Explicitly check off items once confirmed.
- Avoid large blocking commits; stage code sequentially.

## Section 6 — Core Principles
- Simplicity first. Keep the popup lightweight to ensure it renders instantly.
- Always check `chrome.storage.sync` quotas and error states.
- Follow MV3 permissions accurately (e.g., `windows`, `storage`, `system.display`).
