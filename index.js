#!/usr/bin/env node
import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createWriteStream } from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

const PURPLE   = '#9333ea';
const PINK     = '#ec4899';
const FUCHSIA  = '#d946ef';
const GREEN    = '#22c55e';
const YELLOW   = '#f59e0b';
const INDIGO   = '#6366f1';
const ORANGE   = '#f97316';

const p    = (hex, text) => chalk.hex(hex)(text);
const bold = (hex, text) => chalk.hex(hex).bold(text);

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const PKG = require('./package.json');
const VERSION = PKG.version;

const BANNER = `
${bold(PURPLE,  '  ██╗     ██╗██████╗ ██████╗ ██████╗ ███████╗██╗  ██╗')}
${bold(FUCHSIA, '  ██║     ██║██╔══██╗██╔══██╗██╔══██╗██╔════╝╚██╗██╔╝')}
${bold(PINK,    '  ██║     ██║██║  ██║██████╔╝██████╔╝█████╗   ╚███╔╝ ')}
${bold(FUCHSIA, '  ██║     ██║██║  ██║██╔═══╝ ██╔══██╗██╔══╝   ██╔██╗ ')}
${bold(PURPLE,  '  ███████╗██║██████╔╝██║     ██║  ██║███████╗██╔╝ ██╗')}
${p('#6b21a8',  '  ╚══════╝╚═╝╚═════╝ ╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝')}

  ${p(PINK, '◆')} ${chalk.white.bold('Lidprex CLI')}  ${chalk.gray('v' + VERSION)}  ${p(PURPLE, '— Build. Ship. Repeat.')}
  ${chalk.gray('  github.com/lidprex')}
`;

const DIVIDER = chalk.gray('  ' + '─'.repeat(52));

const PROJECTS = [
  {
    name: `${bold(PINK, 'Idea2Project')}  ${chalk.gray('AI project blueprints')}`,
    value: 'idea2project',
    tech: 'Node.js + React + PostgreSQL',
    status: p(GREEN, '● Live'),
    docs: 'https://github.com/Lidprex/Idea2Project#readme',
    variants: [
      {
        label: 'Source Code',
        type: 'source',
        zip: 'https://github.com/Lidprex/Idea2Project/archive/refs/heads/main.zip',
        folder: 'Idea2Project-main',
      },
    ],
  },
  {
    name: `${bold(FUCHSIA, 'LidBridge')}     ${chalk.gray('Clean & push to GitHub')}`,
    value: 'lidbridge',
    tech: 'Electron + Node.js',
    status: p(GREEN, '● Live'),
    docs: 'https://github.com/Lidprex/Lidbridge',
    versions: [
      {
        label: 'v2.0.0 — Complete rewrite',
        value: 'v2.0.0',
        summary: 'New push engine, more security, full multi-platform support',
        variants: [
          {
            label: 'Windows Installer (.exe)  — Recommended',
            type: 'binary',
            url: 'https://github.com/Lidprex/Lidbridge/releases/download/LidBridge-v2.0.0/LidBridge_2.0.0_x64-setup.exe',
            filename: 'LidBridge_2.0.0_x64-setup.exe',
          },
          {
            label: 'Windows Installer (.msi)  — Enterprise install',
            type: 'binary',
            url: 'https://github.com/Lidprex/Lidbridge/releases/download/LidBridge-v2.0.0/LidBridge_2.0.0_x64_en-US.msi',
            filename: 'LidBridge_2.0.0_x64_en-US.msi',
          },
          {
            label: 'Source Code (.zip)',
            type: 'source',
            zip: 'https://github.com/Lidprex/Lidbridge/archive/refs/tags/LidBridge-v2.0.0.zip',
            folder: 'Lidbridge-LidBridge-v2.0.0',
          },
          {
            label: 'Source Code (.tar.gz)',
            type: 'source',
            zip: 'https://github.com/Lidprex/Lidbridge/archive/refs/tags/LidBridge-v2.0.0.tar.gz',
            folder: 'Lidbridge-LidBridge-v2.0.0',
          },
        ],
      },
      {
        label: 'v1.0.0 — Original release',
        value: 'v1.0.0',
        summary: 'Original clean-and-push release',
        variants: [
          {
            label: 'Windows Portable (.exe)  — No install required',
            type: 'binary',
            url: 'https://github.com/Lidprex/Lidbridge/releases/download/LidBridge-v1.0.0/lidbridge.exe',
            filename: 'lidbridge.exe',
          },
          {
            label: 'Windows Installer (.exe)  — Standard installer',
            type: 'binary',
            url: 'https://github.com/Lidprex/Lidbridge/releases/download/LidBridge-v1.0.0/LidBridge_1.0.0_x64-setup.exe',
            filename: 'LidBridge_1.0.0_x64-setup.exe',
          },
          {
            label: 'Windows Installer (.msi)  — Enterprise install',
            type: 'binary',
            url: 'https://github.com/Lidprex/Lidbridge/releases/download/LidBridge-v1.0.0/LidBridge_1.0.0_x64_en-US.msi',
            filename: 'LidBridge_1.0.0_x64_en-US.msi',
          },
          {
            label: 'Source Code (.zip)',
            type: 'source',
            zip: 'https://github.com/Lidprex/Lidbridge/archive/refs/tags/LidBridge-v1.0.0.zip',
            folder: 'Lidbridge-LidBridge-v1.0.0',
          },
          {
            label: 'Source Code (.tar.gz)',
            type: 'source',
            zip: 'https://github.com/Lidprex/Lidbridge/archive/refs/tags/LidBridge-v1.0.0.tar.gz',
            folder: 'Lidbridge-LidBridge-v1.0.0',
          },
        ],
      },
    ],
  },
  {
    name: `${bold(PURPLE, 'LeakShield')}    ${chalk.gray('Local-first secret scanner')}`,
    value: 'leakshield',
    tech: 'Python',
    status: p(YELLOW, '◐ Beta'),
    docs: 'https://github.com/Lidprex/LeakShield#readme',
    variants: [
      {
        label: 'Source Code',
        type: 'source',
        zip: 'https://github.com/Lidprex/LeakShield/archive/refs/heads/main.zip',
        folder: 'LeakShield-main',
      },
    ],
  },
  {
    name: `${bold('#a855f7', 'RepoPrep')}      ${chalk.gray('Clean repos, faster handoffs')}`,
    value: 'repoprep',
    tech: 'Python',
    status: p(INDIGO, '○ Internal'),
    docs: 'https://github.com/Lidprex/RepoPrep',
    repo: 'https://github.com/Lidprex/RepoPrep',
    versions: [
      {
        label: 'v2.2.0 — Ultra-lightweight rebuild',
        value: 'v2.2.0',
        summary: '11.1 MB executable, direct run, AI flatten mode',
        variants: [
          {
            label: 'Windows Executable (.exe)  — Recommended',
            type: 'binary',
            url: 'https://github.com/Lidprex/RepoPrep/releases/download/V2.2.0/RepoPrep.exe',
            filename: 'RepoPrep.exe',
          },
          {
            label: 'Source Code (.zip)',
            type: 'source',
            zip: 'https://github.com/Lidprex/RepoPrep/archive/refs/tags/V2.2.0.zip',
            folder: 'RepoPrep-V2.2.0',
          },
          {
            label: 'Source Code (.tar.gz)',
            type: 'source',
            zip: 'https://github.com/Lidprex/RepoPrep/archive/refs/tags/V2.2.0.tar.gz',
            folder: 'RepoPrep-V2.2.0',
          },
        ],
      },
      {
        label: 'v1.1.0 — First stable release',
        value: 'v1.1.0',
        summary: '45.5 MB portable tool, Python-free runtime',
        variants: [
          {
            label: 'Windows Executable (.exe)  — Ready to run',
            type: 'binary',
            url: 'https://github.com/Lidprex/RepoPrep/releases/download/V1.1.0/RepoPrep.exe',
            filename: 'RepoPrep.exe',
          },
          {
            label: 'Source Code (.zip)',
            type: 'source',
            zip: 'https://github.com/Lidprex/RepoPrep/archive/refs/tags/V1.1.0.zip',
            folder: 'RepoPrep-V1.1.0',
          },
          {
            label: 'Source Code (.tar.gz)',
            type: 'source',
            zip: 'https://github.com/Lidprex/RepoPrep/archive/refs/tags/V1.1.0.tar.gz',
            folder: 'RepoPrep-V1.1.0',
          },
        ],
      },
    ],
  },
  {
    name: `${bold('#00cec9', 'LidPush')}       ${chalk.gray('Smart GitHub sync tool')}`,
    value: 'lidpush',
    tech: 'Tauri + Rust + React',
    status: p(GREEN, '● Live'),
    docs: 'https://github.com/Lidprex/Lidpush',
    versions: [
      {
        label: 'v2.0.0 — Rebuilt push engine',
        value: 'v2.0.0',
        variants: [
          {
            label: 'Windows Installer (.exe)  — Recommended',
            type: 'binary',
            url: 'https://github.com/Lidprex/Lidpush/releases/download/2.0.0/LidPush_2.0.0_x64-setup.exe',
            filename: 'LidPush_2.0.0_x64-setup.exe',
          },
          {
            label: 'Windows Installer (.msi)  — English package',
            type: 'binary',
            url: 'https://github.com/Lidprex/Lidpush/releases/download/2.0.0/LidPush_2.0.0_x64_en-US.msi',
            filename: 'LidPush_2.0.0_x64_en-US.msi',
          },
          {
            label: 'Source Code (.zip)',
            type: 'source',
            zip: 'https://github.com/Lidprex/Lidpush/archive/refs/tags/2.0.0.zip',
            folder: 'Lidpush-2.0.0',
          },
          {
            label: 'Source Code (.tar.gz)',
            type: 'source',
            zip: 'https://github.com/Lidprex/Lidpush/archive/refs/tags/2.0.0.tar.gz',
            folder: 'Lidpush-2.0.0',
          },
        ],
      },
      {
        label: 'v1.1.0 — Original release',
        value: 'v1.1.0',
        variants: [
          {
            label: 'Windows Installer (.exe)  — Standard installer',
            type: 'binary',
            url: 'https://github.com/Lidprex/Lidpush/releases/download/1.1.0/LidPush_1.1.0_x64-setup.exe',
            filename: 'LidPush_1.1.0_x64-setup.exe',
          },
          {
            label: 'Windows Installer (.msi)  — English package',
            type: 'binary',
            url: 'https://github.com/Lidprex/Lidpush/releases/download/1.1.0/LidPush_1.1.0_x64_en-US.msi',
            filename: 'LidPush_1.1.0_x64_en-US.msi',
          },
          {
            label: 'Source Code (.zip)',
            type: 'source',
            zip: 'https://github.com/Lidprex/Lidpush/archive/refs/tags/1.1.0.zip',
            folder: 'Lidpush-1.1.0',
          },
          {
            label: 'Source Code (.tar.gz)',
            type: 'source',
            zip: 'https://github.com/Lidprex/Lidpush/archive/refs/tags/1.1.0.tar.gz',
            folder: 'Lidpush-1.1.0',
          },
        ],
      },
    ],
  },
  {
    name: `${bold('#8b5cf6', 'Oathkeeper')} ${chalk.gray('Self-applied accountability')}`,
    value: 'oathkeeper',
    tech: 'C++ + C# + Windows',
    status: p(YELLOW, '◐ Beta'),
    docs: 'https://github.com/Lidprex/Oathkeeper',
    versions: [
      {
        label: 'v1.0.0-beta — Windows focus guard',
        value: 'v1.0.0-beta',
        variants: [
          {
            label: 'Windows Setup (.exe)  — Recommended',
            type: 'binary',
            url: 'https://github.com/Lidprex/Oathkeeper/releases/download/v1.0.0-beta/Oathkeeper_Setup_v1.0.0-beta.exe',
            filename: 'Oathkeeper_Setup_v1.0.0-beta.exe',
          },
          {
            label: 'Windows Installer (.msi)  — Standard install',
            type: 'binary',
            url: 'https://github.com/Lidprex/Oathkeeper/releases/download/v1.0.0-beta/Oathkeeper_v1.0.0-beta.msi',
            filename: 'Oathkeeper_v1.0.0-beta.msi',
          },
          {
            label: 'Source Code',
            type: 'source',
            zip: 'https://github.com/Lidprex/Oathkeeper/archive/refs/heads/main.zip',
            folder: 'Oathkeeper-main',
          },
        ],
      },
    ],
  },
  {
    name: `${bold(ORANGE, 'MGS-GenX')}      ${p(ORANGE, '✦ Coming Soon')}`,
    value: 'mgs-genx',
    tech: 'Closed Source',
    status: p(ORANGE, '✦ Coming Soon'),
    comingSoon: true,
    info: {
      description: "MGS-GenX is Lidprex's upcoming streaming platform — a next-generation experience built for creators and audiences.",
      features: [
        'Stream movies, series, and anime in one place',
        'Smart recommendations powered by AI',
        'Multi-profile support with parental controls',
        'Offline download support',
        'Discord integration & community features',
        'Available on Web, Desktop, and Mobile',
      ],
      release: 'Expected later in 2026',
      access: 'Closed source — early access program coming soon',
      site: 'https://lidprex.onrender.com/companies/mgs-genx',
    },
  },
];

const CHANGELOG = [
  {
    version: '2.1.0',
    date: '2026/9/11',
    changes: [
      'Multi-release support — multiple release versions per project with own variants',
      'Release-version selection step in `init` before choosing a file variant',
      'LidBridge updated to v2.0.0 and marked Live',
      'RepoPrep repo renamed from RepoPrep-Pro to RepoPrep',
      'LidPush v2.0.0 — rebuilt push engine with new installer packages',
      'Smart folder detection after extraction (resolveExtractedDirectory)',
      'Improved unzip fallback chain (bsdtar → Expand-Archive → .NET ZipFile)',
      '`list` now shows version labels per project',
      'Fixed LidBridge docs link',
    ],
  },
  {
    version: '2.0.0',
    date: '2026/6/4',
    changes: [
      'Added binary (.exe) download support for desktop apps',
      'Added multiple release variants per project (stable / v2 / source / binary)',
      'Added MGS-GenX preview entry (coming soon)',
      'Added back navigation in project variant selection',
      'Added `docs` command — open project README in browser',
      'Added `update` command — check for CLI updates',
      'Added `changelog` command',
      'Dynamic version from package.json',
      'Improved npm install (cwd-based, no shell injection)',
      'Post-download success message with next steps',
    ],
  },
  {
    version: '1.0.0',
    date: '2026/6/2',
    changes: [
      'Initial release',
      'Commands: init, status, list',
      'Download & extract source code for all Lidprex projects',
    ],
  },
];

function printBanner() {
  console.log(BANNER);
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const followRedirect = (currentUrl, redirectCount = 0) => {
      if (redirectCount > 10) return reject(new Error('Too many redirects'));
      https.get(currentUrl, (res) => {
        if ([301, 302, 307, 308].includes(res.statusCode)) {
          return followRedirect(res.headers.location, redirectCount + 1);
        }
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));

        const total = parseInt(res.headers['content-length'] || '0', 10);
        let downloaded = 0;
        const file = createWriteStream(dest);

        res.on('data', (chunk) => {
          downloaded += chunk.length;
          if (total > 0) {
            const pct = Math.round((downloaded / total) * 100);
            const filled = Math.floor(pct / 5);
            const bar = p(PINK, '█'.repeat(filled)) + chalk.gray('░'.repeat(20 - filled));
            process.stdout.write(`\r  ${bar} ${chalk.white(pct + '%')} ${chalk.gray(Math.round(downloaded / 1024) + ' KB')}`);
          }
        });

        res.pipe(file);
        file.on('finish', () => { file.close(); console.log(); resolve(); });
        file.on('error', reject);
      }).on('error', reject);
    };
    followRedirect(url);
  });
}

function unzip(zipPath, destDir) {
  return new Promise((resolve, reject) => {
    const candidateExtensions = ['.zip', '.tar.gz', '.tgz'];
    const hasSupportedArchive = candidateExtensions.some(ext => zipPath.toLowerCase().endsWith(ext));

    if (!hasSupportedArchive) {
      reject(new Error('Unsupported archive type'));
      return;
    }

    try {
      execSync(`tar -xf "${zipPath}" -C "${destDir}"`, { stdio: 'ignore' });
      resolve();
      return;
    } catch {
      try {
        execSync(
          `powershell -Command "$ErrorActionPreference='Stop'; Expand-Archive -Path '${zipPath}' -DestinationPath '${destDir}' -Force"`,
          { stdio: 'ignore' }
        );
        resolve();
        return;
      } catch (e) {
        try {
          execSync(
            `powershell -Command "$ErrorActionPreference='Stop'; if (Test-Path '${zipPath}') { Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::ExtractToDirectory('${zipPath}', '${destDir}'); }"`,
            { stdio: 'ignore' }
          );
          resolve();
          return;
        } catch (err) {
          reject(err);
        }
      }
    }
  });
}

function resolveExtractedDirectory(baseDir, expectedName) {
  const candidates = [];

  if (expectedName) candidates.push(path.join(baseDir, expectedName));

  const entries = fs.existsSync(baseDir) ? fs.readdirSync(baseDir, { withFileTypes: true }) : [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      candidates.push(path.join(baseDir, entry.name));
      if (expectedName) {
        const normalized = entry.name.toLowerCase();
        const expected = expectedName.toLowerCase();
        if (normalized === expected || normalized.includes(expected) || expected.includes(normalized)) {
          return path.join(baseDir, entry.name);
        }
      }
    }
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) return candidate;
  }

  return null;
}

function openBrowser(url) {
  const platform = process.platform;
  try {
    if (platform === 'win32')       execSync(`start "" "${url}"`, { stdio: 'ignore' });
    else if (platform === 'darwin') execSync(`open "${url}"`,     { stdio: 'ignore' });
    else                            execSync(`xdg-open "${url}"`, { stdio: 'ignore' });
  } catch {
    console.log(`  ${chalk.gray('Open manually:')} ${p(PINK, url)}`);
  }
}

program
  .name('lidprex')
  .description(chalk.white('Lidprex CLI — manage and download Lidprex projects'))
  .version(VERSION, '-v, --version', 'show version');

program
  .command('init')
  .description('download a Lidprex project to your machine')
  .action(async () => {
    printBanner();

    const BACK = '__back__';
    let continueLoop = true;

    while (continueLoop) {
      console.log(DIVIDER);
      console.log(`  ${p(PINK, '◆')} ${chalk.white.bold('Project Setup')}\n`);

      const { project } = await inquirer.prompt([{
        type: 'select',
        name: 'project',
        message: chalk.white('Which project do you want to download?'),
        choices: PROJECTS.map(pr => ({ name: pr.name, value: pr.value })),
        loop: false,
      }]);

      const selected = PROJECTS.find(pr => pr.value === project);

      let release = null;
      if (selected.versions && selected.versions.length > 1) {
        const { versionChoice } = await inquirer.prompt([{
          type: 'select',
          name: 'versionChoice',
          message: chalk.white('Which release version do you want?'),
          choices: [
            new inquirer.Separator(chalk.gray('  ────────────────────────────────────────────')),
            { name: `${chalk.gray('‹')} ${chalk.gray('Back to projects')}`, value: BACK },
            new inquirer.Separator(chalk.gray('  ────────────────────────────────────────────')),
            ...selected.versions.map((v, i) => ({
              name: `${chalk.white(v.label)}${v.summary ? chalk.gray(' — ' + v.summary) : ''}`,
              value: i,
            })),
          ],
          loop: false,
        }]);

        if (versionChoice === BACK) continue;
        release = selected.versions[versionChoice];
      } else if (selected.versions && selected.versions.length === 1) {
        release = selected.versions[0];
      }

      if (selected.comingSoon) {
        const info = selected.info;
        console.log();
        console.log(DIVIDER);
        console.log(`  ${p(ORANGE, '✦')} ${bold(ORANGE, 'MGS-GenX')}  ${chalk.gray('— Coming Soon')}`);
        console.log(DIVIDER);
        console.log();
        console.log(`  ${chalk.white(info.description)}`);
        console.log();
        console.log(`  ${p(PINK, '◆')} ${chalk.white.bold('Features:')}`);
        for (const feature of info.features) {
          console.log(`    ${p(PURPLE, '→')} ${chalk.white(feature)}`);
        }
        console.log();
        console.log(`  ${chalk.gray('Release:')}  ${chalk.white(info.release)}`);
        console.log(`  ${chalk.gray('Access:')}   ${chalk.white(info.access)}`);
        console.log(`  ${chalk.gray('Website:')}  ${p(PINK, info.site)}`);
        console.log();
        console.log(DIVIDER);
        console.log();

        const { action } = await inquirer.prompt([{
          type: 'select',
          name: 'action',
          message: chalk.white('What do you want to do?'),
          choices: [
            { name: chalk.white('Open website'),               value: 'site' },
            { name: `${chalk.gray('‹')} ${chalk.gray('Back to projects')}`, value: 'back' },
            { name: chalk.white('Exit'),                        value: 'exit' },
          ],
          loop: false,
        }]);

        if (action === 'site') {
          openBrowser(info.site);
          console.log(`  ${p(GREEN, '→')} Opening ${p(PINK, info.site)}...\n`);
        }
        if (action === 'exit') continueLoop = false;
        continue;
      }

      let variant = null;
      const variants = release ? release.variants : (selected.variants || []);
      let confirmed = false;
      let backToProjects = false;

      while (!confirmed) {
        if (variants.length === 1) {
          variant = variants[0];
        } else {
          const { variantChoice } = await inquirer.prompt([{
            type: 'select',
            name: 'variantChoice',
            message: chalk.white('Which file do you want to download?'),
            choices: [
              new inquirer.Separator(chalk.gray('  ────────────────────────────────────────────')),
              { name: `${chalk.gray('↗')} ${chalk.gray('Open repo')}`, value: '__repo__' },
              { name: `${chalk.gray('‹')} ${chalk.gray('Back to projects')}`, value: BACK },
              new inquirer.Separator(chalk.gray('  ────────────────────────────────────────────')),
              ...variants.map((v, i) => ({ name: chalk.white(`${release ? release.label : ''} ${v.label}`.trim()), value: i })),
            ],
            loop: false,
          }]);

          if (variantChoice === BACK) { backToProjects = true; break; }
          if (variantChoice === '__repo__') {
            const repoUrl = selected.repo || selected.docs;
            openBrowser(repoUrl);
            console.log(`  ${p(GREEN, '→')} Opening repo: ${p(PINK, repoUrl)}\n`);
            continue;
          }
          variant = variants[variantChoice];
        }

        if (variant.type === 'binary') {
          const { destDir } = await inquirer.prompt([{
            type: 'input',
            name: 'destDir',
            message: chalk.white('Save to folder (type "back" to go back):'),
            default: process.cwd(),
          }]);

          if (destDir.trim().toLowerCase() === 'back') {
            if (variants.length === 1) { backToProjects = true; break; }
            continue;
          }
          confirmed = true;

          console.log();
          console.log(DIVIDER);
          console.log(`  ${p(FUCHSIA, '◆')} ${chalk.white.bold(selected.value)}  ${chalk.gray(selected.tech)}  ${selected.status}`);
          console.log(DIVIDER);
          console.log();

          const destPath = path.join(destDir, variant.filename);
          console.log(`  ${chalk.gray('Downloading')} ${p(PINK, variant.filename)} ${chalk.gray('...')}\n`);

          try {
            await downloadFile(variant.url, destPath);
          } catch {
            console.log(`\n  ${chalk.red('✗')} Download failed — check your connection`);
            process.exit(1);
          }

          console.log();
          console.log(DIVIDER);
          console.log(`  ${p(GREEN, '✓')} ${chalk.white.bold('Done!')} Saved to ${p(PINK, destPath)}`);
          console.log();
          console.log(`  ${chalk.gray('Run the installer and follow the setup wizard.')}`);
          console.log(`  ${p(PURPLE, '→')} ${chalk.white('Good luck! 🚀')}`);
          console.log(DIVIDER);
          console.log();
          return;
        }

        const { dir } = await inquirer.prompt([{
          type: 'input',
          name: 'dir',
          message: chalk.white('Save to folder (type "back" to go back):'),
          default: selected.value,
        }]);

        if (dir.trim().toLowerCase() === 'back') {
          if (variants.length === 1) { backToProjects = true; break; }
          continue;
        }
        confirmed = true;

        const { install } = await inquirer.prompt([{
          type: 'confirm',
          name: 'install',
          message: chalk.white('Run npm install after download?'),
          default: true,
        }]);

        console.log();
        console.log(DIVIDER);
        console.log(`  ${p(FUCHSIA, '◆')} ${chalk.white.bold(selected.value)}  ${chalk.gray(selected.tech)}  ${selected.status}`);
        console.log(DIVIDER);
        console.log();

        const tmpZip   = path.join(process.cwd(), `${selected.value}-tmp.zip`);
        const tmpDir   = process.cwd();
        const finalDir = path.join(process.cwd(), dir);

        console.log(`  ${chalk.gray('Downloading')} ${p(PINK, selected.value)} ${chalk.gray('...')}\n`);

        try {
          await downloadFile(variant.zip, tmpZip);
        } catch {
          console.log(`\n  ${chalk.red('✗')} Download failed — check your connection`);
          process.exit(1);
        }

        const spinner = ora({ text: chalk.white('Extracting...'), color: 'magenta' }).start();
        try {
          await unzip(tmpZip, tmpDir);
          const extractedPath = resolveExtractedDirectory(tmpDir, variant.folder || selected.value);
          if (!extractedPath) {
            throw new Error('Extracted folder not found');
          }

          if (fs.existsSync(finalDir)) fs.rmSync(finalDir, { recursive: true, force: true });
          fs.renameSync(extractedPath, finalDir);
          fs.unlinkSync(tmpZip);
          spinner.succeed(p(PINK, 'Extracted successfully'));
        } catch {
          const fallbackDir = resolveExtractedDirectory(tmpDir, selected.value);
          if (fallbackDir && !fs.existsSync(finalDir)) {
            try {
              fs.renameSync(fallbackDir, finalDir);
              if (fs.existsSync(tmpZip)) fs.unlinkSync(tmpZip);
              spinner.succeed(p(PINK, 'Extracted successfully'));
            } catch {
              spinner.fail(chalk.red('Extraction failed'));
              process.exit(1);
            }
          } else {
            spinner.fail(chalk.red('Extraction failed'));
            process.exit(1);
          }
        }

        if (install) {
          const spinner2 = ora({ text: chalk.white('Installing dependencies...'), color: 'magenta' }).start();
          try {
            execSync('npm install', { cwd: finalDir, stdio: 'ignore' });
            spinner2.succeed(p(PINK, 'Dependencies installed'));
          } catch {
            spinner2.warn(chalk.yellow('npm install failed — run it manually'));
          }
        }

        console.log();
        console.log(DIVIDER);
        console.log(`  ${p(GREEN, '✓')} ${chalk.white.bold('Ready!')} Project saved to ${p(PINK, dir)}`);
        console.log();
        console.log(`  ${chalk.gray('Next steps:')}`);
        console.log(`  ${p(PURPLE, '→')} ${chalk.white(`cd ${dir}`)}`);
        console.log(`  ${p(PURPLE, '→')} ${chalk.white('npm run dev')}`);
        console.log();
        console.log(`  ${p(GREEN, '✓')} ${chalk.white.bold('Good luck! 🚀')}`);
        console.log(DIVIDER);
        console.log();
        return;
      }

      if (backToProjects) continue;
    }
  });

program
  .command('list')
  .description('list all available Lidprex open source projects')
  .action(() => {
    printBanner();
    console.log(DIVIDER);
    console.log(`  ${p(PINK, '◆')} ${chalk.white.bold('Open Source Projects')}\n`);
    for (const proj of PROJECTS) {
      if (proj.comingSoon) {
        console.log(`  ${p(ORANGE, '✦')} ${proj.name}`);
        console.log(`     ${chalk.gray('Tech:')}     ${chalk.white(proj.tech)}`);
        console.log(`     ${chalk.gray('Status:')}   ${proj.status}`);
      } else {
        console.log(`  ${p(PINK, '→')} ${proj.name}`);
        console.log(`     ${chalk.gray('Tech:')}     ${chalk.white(proj.tech)}`);
        console.log(`     ${chalk.gray('Status:')}   ${proj.status}`);

        const versionLabels = (proj.versions || []).map(v => chalk.gray(v.label)).join('  |  ');
        const variantLabels = (proj.variants || []).map(v => chalk.gray(v.label.split('(')[0].trim())).join('  |  ');
        const display = versionLabels || variantLabels || '—';
        console.log(`     ${chalk.gray('Versions:')} ${display}`);
      }
      console.log();
    }
    console.log(DIVIDER);
    console.log(`  ${chalk.gray('GitHub →')} ${p(PINK, 'github.com/lidprex')}`);
    console.log(DIVIDER);
    console.log();
  });

program
  .command('status')
  .description('check the status of all Lidprex services')
  .action(async () => {
    printBanner();
    console.log(DIVIDER);
    console.log(`  ${p(PINK, '◆')} ${chalk.white.bold('Service Status')}\n`);

    const services = [
      { name: 'Lidprex Main',   url: 'lidprex.onrender.com' },
      { name: 'Idea2Project',   url: 'idea2project.onrender.com' },
      { name: 'LidBridge',      url: 'lidbridge.onrender.com' },
      { name: 'Lidprex Labs',   url: 'lidprex-labs.onrender.com' },
      { name: 'RepoPrep',       url: 'repoprep.onrender.com' },
      { name: 'LeakShield',     url: 'leakshield.onrender.com' },
    ];

    const checkService = (url) => new Promise((resolve) => {
      const start = Date.now();
      const req = https.get(`https://${url}`, { timeout: 5000 }, (res) => {
        resolve({ ok: res.statusCode < 500, ms: Date.now() - start, code: res.statusCode });
      });
      req.on('error', () => resolve({ ok: false, ms: 0, code: 0 }));
      req.on('timeout', () => { req.destroy(); resolve({ ok: false, ms: 0, code: 408 }); });
    });

    for (const svc of services) {
      const sp = ora({ text: `  Checking ${chalk.gray(svc.name)}...`, color: 'magenta' }).start();
      const result = await checkService(svc.url);
      const nameCol = chalk.white(svc.name.padEnd(16));
      const urlCol  = chalk.gray(svc.url.padEnd(32));
      if (result.ok) {
        sp.succeed(`  ${nameCol} ${urlCol} ${p(GREEN, '● Operational')}  ${chalk.gray(result.ms + 'ms')}`);
      } else {
        const code = result.code === 408 ? 'Timeout' : result.code === 0 ? 'Unreachable' : `HTTP ${result.code}`;
        sp.fail(`  ${nameCol} ${urlCol} ${chalk.red('✗ ' + code)}`);
      }
    }

    console.log();
    console.log(DIVIDER);
    console.log(`  ${chalk.gray('Full status page →')} ${p(PINK, 'https://lidprex.onrender.com/status')}`);
    console.log(DIVIDER);
    console.log();
  });

program
  .command('docs [project]')
  .description('open a project\'s documentation in your browser')
  .action((projectArg) => {
    printBanner();

    if (!projectArg) {
      console.log(DIVIDER);
      console.log(`  ${p(PINK, '◆')} ${chalk.white.bold('Documentation')}\n`);
      for (const proj of PROJECTS) {
        if (proj.comingSoon) continue;
        console.log(`  ${p(PURPLE, '→')} ${bold(PINK, proj.value.padEnd(14))} ${chalk.gray(proj.docs)}`);
      }
      console.log();
      console.log(`  ${chalk.gray('Usage:')} ${chalk.white('lidprex docs <project>')}`);
      console.log(DIVIDER);
      console.log();
      return;
    }

    const found = PROJECTS.find(pr => pr.value === projectArg.toLowerCase());
    if (!found) {
      console.log(`  ${chalk.red('✗')} Unknown project "${projectArg}". Run ${chalk.white('lidprex list')} to see all projects.`);
      process.exit(1);
    }
    if (found.comingSoon) {
      console.log(`  ${p(ORANGE, '✦')} MGS-GenX docs are not available yet.`);
      console.log(`  ${chalk.gray('Website:')} ${p(PINK, found.info.site)}`);
      console.log();
      return;
    }

    console.log(`  ${p(GREEN, '→')} Opening docs for ${bold(PINK, found.value)}...`);
    openBrowser(found.docs);
    console.log(`  ${chalk.gray(found.docs)}`);
    console.log();
  });

program
  .command('update')
  .description('check if a newer version of the CLI is available')
  .action(async () => {
    printBanner();
    console.log(DIVIDER);
    console.log(`  ${p(PINK, '◆')} ${chalk.white.bold('Update Check')}\n`);

    const spinner = ora({ text: chalk.white('Checking npm registry...'), color: 'magenta' }).start();

    try {
      const { stdout } = await execAsync('npm show @lidprex/cli version');
      const latest  = stdout.trim();
      const current = VERSION;

      spinner.stop();

      console.log(`  ${chalk.gray('Installed:')} ${chalk.white(current)}`);
      console.log(`  ${chalk.gray('Latest:   ')} ${chalk.white(latest)}`);
      console.log();

      if (latest === current) {
        console.log(`  ${p(GREEN, '✓')} You are on the latest version.`);
      } else {
        console.log(`  ${p(YELLOW, '◆')} Update available: ${chalk.gray(current)} ${chalk.white('→')} ${p(GREEN, latest)}`);
        console.log();
        console.log(`  ${chalk.gray('Run:')} ${chalk.white('npm install -g @lidprex/cli')}`);
      }
    } catch {
      spinner.fail(chalk.red('Could not reach npm registry — check your connection'));
    }

    console.log();
    console.log(DIVIDER);
    console.log();
  });

program
  .command('changelog')
  .description('view the CLI version history')
  .action(() => {
    printBanner();
    console.log(DIVIDER);
    console.log(`  ${p(PINK, '◆')} ${chalk.white.bold('Changelog')}\n`);

    for (const entry of CHANGELOG) {
      const isCurrent = entry.version === VERSION;
      const tag = isCurrent ? p(GREEN, ' ← current') : '';
      console.log(`  ${bold(FUCHSIA, `v${entry.version}`)}  ${chalk.gray(entry.date)}${tag}`);
      for (const change of entry.changes) {
        console.log(`    ${chalk.gray('·')} ${chalk.white(change)}`);
      }
      console.log();
    }

    console.log(DIVIDER);
    console.log();
  });

program.addHelpText('before', BANNER);
program.parse();