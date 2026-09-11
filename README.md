# @lidprex/cli

> **The Lidprex command line interface — discover, download, and manage all Lidprex open source projects from your terminal.**

[![npm version](https://img.shields.io/npm/v/@lidprex/cli)](https://www.npmjs.com/package/@lidprex/cli)
[![license](https://img.shields.io/npm/l/@lidprex/cli)](./LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)
[![maintained](https://img.shields.io/badge/maintained-yes-brightgreen.svg)](https://github.com/Lidprex/cli)

`lidprex` is an interactive CLI that lets you browse every Lidprex project, pick a release version, and download **source code or prebuilt binaries** — all from a single terminal. It ships with a colorful banner, progress bars, live service-status checks, and a full changelog viewer.

---

## Version

**Current release: `2.1.2`**

| Version | Highlights |
|---|---|
| **2.1.2** (latest) | Root `license: GPL-3.0` for correct npmjs metadata |
| **2.1.1** | `#!/usr/bin/env node` shebang — the CLI now runs as the `lidprex` command on all platforms (no more opening in an editor) |
| **2.1.0** | **Multi-release support** — pick a release version per project (LidBridge v1/v2, RepoPrep v1/v2, LidPush v1/v2); "back" escape everywhere; smarter extraction |
| **2.0.0** | Binary downloads (`.exe` / `.msi`), `docs` / `update` / `changelog` commands, MGS-GenX preview |
| **1.0.0** | Initial release — `init`, `list`, `status` |

---

## Installation

Requires **Node.js >= 18**.

```bash
npm install -g @lidprex/cli
```

Verify the install:

```bash
lidprex --version
# → 2.1.2
```

---

## Quick Start

The fastest way to grab a project:

```bash
lidprex init
```

Pick a project → choose a release version → choose a file (source or binary) → done. No signing in, no digging through GitHub.

---

## Commands

### `lidprex init`
Interactive downloader. Walks through project → release version → file variant → save folder, and optionally runs `npm install` for source projects.

```bash
lidprex init
```

- **Back navigation** — press "Back to projects" anytime to change your selection without restarting.
- At the folder prompt, type **`back`** to return to the previous step.

### `lidprex list`
List every Lidprex project with tech stack, status, and all available release versions/variants.

```bash
lidprex list
```

### `lidprex status`
Check the live status of all Lidprex services with response times.

```bash
lidprex status
```

### `lidprex docs [project]`
Open a project's README in your browser. Without a project argument, shows every docs link.

```bash
lidprex docs idea2project
```

### `lidprex update`
Check npm for a newer CLI version and get upgrade instructions.

```bash
lidprex update
```

### `lidprex changelog`
View the version history and changelog inline, right in your terminal.

```bash
lidprex changelog
```

### `lidprex -v` / `lidprex --version`
Print the installed version.

```bash
lidprex -v
```

### `lidprex --help`
Show all available commands.

```bash
lidprex --help
```

---

## What's New in v2.1

- **Multi-release support** — projects now offer separate release versions, each with its own downloads (e.g. LiDBridge v1.0.0 and v2.0.0, RepoPrep v1/v2, LidPush v1/v2).
- **Version picker** — a dedicated "Which release version do you want?" step before choosing a file.
- **Back navigation everywhere** — "Back to projects" plus typing `back` at the folder prompt returns you a step instead of restarting.
- **Smarter extraction** — `resolveExtractedDirectory` finds the real extracted folder even when GitHub archive names mismatch, with a triple fallback (`tar` → `Expand-Archive` → `.NET ZipFile`).
- **Live refresh** — LidBridge is marked **Live**, RepoPrep links renamed to the new `RepoPrep` repo, and **Oathkeeper** was added.
- **Reliable startup** — native `#!/usr/bin/env node` shebang so `lidprex` runs correctly on Windows, macOS, and Linux.
- **Correct metadata** — `license: GPL-3.0` at the package root for accurate npmjs display.

---

## Available Projects

| Project | Tech | Status | Release versions |
|---|---|---|---|
| **Idea2Project** | Node.js + React + PostgreSQL | ● Live | Source |
| **LidBridge** | Electron + Node.js | ● Live | v2.0.0, v1.0.0 (source / `.exe` / `.msi`) |
| **LeakShield** | Python | ◐ Beta | Source |
| **RepoPrep** | Python | ○ Internal | v2.2.0, v1.1.0 (source / `.exe`) |
| **LidPush** | Tauri + Rust + React | ● Live | v2.0.0, v1.1.0 (source / `.exe` / `.msi`) |
| **Oathkeeper** | C++ + C# + Windows | ◐ Beta | v1.0.0-beta (source / setup / `.msi`) |
| **MGS-GenX** | Closed Source | ✦ Coming Soon | Preview only |

---

## Comparison: v1 → v2

| Feature | v1.0.0 | v2.x |
|---|---|---|
| Commands | `init`, `list`, `status` | + `docs`, `update`, `changelog` |
| Downloads | Source code only | Source **and** binaries (`.exe` / `.msi`) |
| Releases per project | Single | Multiple (v1/v2 picker) |
| Back navigation | ✗ | ✓ everywhere |
| Extraction | Single fallback | Triple fallback + smart folder detection |
| Metadata | — | Root license, shebang, dynamic version |

---

## Development

```bash
git clone https://github.com/Lidprex/cli.git
cd cli
npm install
node index.js        # run locally without global install
```

---

## License

[GPL-3.0](./LICENSE) — © 2026 Lidprex
