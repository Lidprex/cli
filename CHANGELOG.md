# Changelog

All notable changes to `@lidprex/cli` will be documented here.

---

## [2.0.0] - 2026-06-04

### Added
- Binary (.exe / .msi) download support for desktop applications (LidBridge, RepoPrep, LidPush)
- Multiple release variants per project — source code, stable releases, latest releases, binaries
- `lidprex docs [project]` — open project documentation in your default browser
- `lidprex update` — check npm registry for a newer CLI version
- `lidprex changelog` — view CLI version history in the terminal
- MGS-GenX preview entry with feature list, release info, and website link
- Back navigation in project variant selection ("Back to projects")
- `engines` field in package.json requiring Node.js >= 18

### Changed
- Version is now read dynamically from package.json instead of hardcoded
- `npm install` now uses `cwd` option instead of shell string concatenation (more secure)
- `list` command now shows available variants per project
- Redirect handling improved — supports 301, 302, 307, 308 with 10-redirect cap
- Color constants centralized at top of file for maintainability

### Projects added
- **LidPush** — Tauri + Rust + React smart GitHub sync tool

---

## [1.0.0] - 2026-06-01

### Added
- `lidprex init` — download any Lidprex project with interactive setup
- `lidprex list` — list all available open source projects with tech stack and status
- `lidprex status` — check live status and response time of all Lidprex services
- `lidprex -v` / `--version` — display installed CLI version
- `lidprex --help` — show help menu
- Support for Idea2Project, LidBridge, LeakShield, RepoPrep Pro, LidPush
- Auto redirect follow for GitHub zip downloads
- Progress bar during download
- Optional `npm install` after project extraction
- ASCII banner with colored output
