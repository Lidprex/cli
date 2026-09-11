# @lidprex/cli

Lidprex CLI — manage and download Lidprex open source projects from your terminal.

[![npm version](https://img.shields.io/npm/v/@lidprex/cli)](https://www.npmjs.com/package/@lidprex/cli)
[![license](https://img.shields.io/npm/l/@lidprex/cli)](./LICENSE)

---

## Installation

```bash
npm install -g @lidprex/cli
```

Requires **Node.js >= 18**.

---

## Commands

### `lidprex init`
Download a Lidprex project to your machine. Walks you through picking a project, choosing a version variant (source code or prebuilt binary), selecting a folder, and optionally running `npm install` for source projects.

```bash
lidprex init
```

Supports **back navigation** — use "Back to projects" to change your selection without restarting.

---

### `lidprex list`
Show all available Lidprex open source projects with their tech stack, status, and available download variants.

```bash
lidprex list
```

---

### `lidprex status`
Check the live status of all Lidprex services and see response times.

```bash
lidprex status
```

---

### `lidprex docs [project]`
Open a project's documentation (README) in your default browser. Run without a project name to see all available docs links.

```bash
lidprex docs idea2project
```

---

### `lidprex update`
Check the npm registry for a newer version of the CLI and display upgrade instructions if one is available.

```bash
lidprex update
```

---

### `lidprex changelog`
View the full CLI version history and changelog in your terminal.

```bash
lidprex changelog
```

---

### `lidprex -v` / `--version`
Display the currently installed CLI version.

```bash
lidprex -v
```

---

### `lidprex --help`
Show all available commands.

```bash
lidprex --help
```

---

## What's New in v2

- **Binary downloads** — download prebuilt `.exe` and `.msi` installers for desktop apps (LidBridge, RepoPrep, LidPush)
- **Multiple variants per project** — choose between source code, stable releases, latest releases, or binaries
- **New projects** — LidPush (Tauri + Rust + React) added, MGS-GenX preview with feature overview
- **Back navigation** — go back to project selection without restarting the CLI
- **`docs` command** — open any project's README directly from the terminal
- **`update` command** — check for CLI updates on npm
- **`changelog` command** — view version history inline
- **Safer npm install** — uses `cwd` option instead of shell string concatenation
- **Better redirect handling** — supports 301, 302, 307, 308 with a 10-redirect limit

---

## Available Projects

| Project | Tech | Status | Variants |
|---|---|---|---|
| Idea2Project | JavaScript, PHP, Blade, CSS | Active | Source Code |
| LidBridge | Rust, TypeScript, CSS, JavaScript | Active | Source Code, Windows Portable (.exe), NSIS Installer, MSI Installer |
| LeakShield | Python | Active | Source Code |
| RepoPrep | Python, Batchfile | Active | Source Code (v1/v2), Binary (v1/v2) |
| LidPush | Tauri + Rust + React | Active | Source Code, NSIS Installer, MSI Installer |
| MGS-GenX | React, TypeScript, Node.js | Coming Soon | Preview only |

---

## License

[GPL-3.0](./LICENSE) — © 2026 Lidprex
