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
    status: p(YELLOW, '◐ Beta'),
    docs: 'https://github.com/Lidprex/LidBridge#readme',
    variants: [
      {
        label: 'Source Code                    — View & build yourself',
        type: 'source',
        zip: 'https://github.com/Lidprex/Lidbridge/archive/refs/tags/LidBridge-v1.0.0.zip',
        folder: 'Lidbridge-LidBridge-v1.0.0',
      },
      {
        label: 'Windows Portable      (.exe)   — No installation required',
        type: 'binary',
        url: 'https://github.com/Lidprex/Lidbridge/releases/download/LidBridge-v1.0.0/LidBridge.exe',
        filename: 'LidBridge.exe',
      },
      {
        label: 'Windows Installer NSIS (.exe)  — Standard installer',
        type: 'binary',
        url: 'https://github.com/Lidprex/Lidbridge/releases/download/LidBridge-v1.0.0/LidBridge_1.0.0_x64-setup.exe',
        filename: 'LidBridge_1.0.0_x64-setup.exe',
      },
      {
        label: 'Windows Installer MSI  (.msi)  — Enterprise installer',
        type: 'binary',
        url: 'https://github.com/Lidprex/Lidbridge/releases/download/LidBridge-v1.0.0/LidBridge_1.0.0_x64_en-US.msi',
        filename: 'LidBridge_1.0.0_x64_en-US.msi',
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
    docs: 'https://github.com/Lidprex/RepoPrep-Pro#readme',
    variants: [
      {
        label: 'Source Code        (v1 Stable) — View & build yourself',
        type: 'source',
        zip: 'https://github.com/Lidprex/RepoPrep-Pro/archive/refs/tags/V1.1.0.zip',
        folder: 'RepoPrep-Pro-V1.1.0',
      },
      {
        label: 'Windows (.exe)     (v1 Stable) — Ready to run',
        type: 'binary',
        url: 'https://github.com/Lidprex/RepoPrep-Pro/releases/download/V1.1.0/RepoPrep.exe',
        filename: 'RepoPrep.exe',
      },
      {
        label: 'Source Code        (v2 Latest) — View & build yourself',
        type: 'source',
        zip: 'https://github.com/Lidprex/RepoPrep-Pro/archive/refs/tags/V2.2.0.zip',
        folder: 'RepoPrep-Pro-V2.2.0',
      },
      {
        label: 'Windows (.exe)     (v2 Latest) — Ready to run',
        type: 'binary',
        url: 'https://github.com/Lidprex/RepoPrep-Pro/releases/download/V2.2.0/RepoPrep-Pro.exe',
        filename: 'RepoPrep-Pro.exe',
      },
    ],
  },
{
  name: `${bold('#00cec9', 'LidPush')}       ${chalk.gray('Smart GitHub sync tool')}`,
  value: 'lidpush',
  tech: 'Tauri + Rust + React',
  status: p(GREEN, '● Live'),
  docs: 'https://github.com/Lidprex/Lidpush#readme',
  variants: [
    {
      label: 'Source Code                    — View & build yourself',
      type: 'source',
      zip: 'https://github.com/Lidprex/Lidpush/archive/refs/heads/main.zip',
      folder: 'Lidpush-main',
    },
    {
      label: 'Windows Installer NSIS (.exe)  — Standard installer',
      type: 'binary',
      url: 'https://github.com/Lidprex/Lidpush/releases/download/1.1.0/LidPush_1.1.0_x64-setup.exe',
      filename: 'LidPush_1.1.0_x64-setup.exe',
    },
    {
      label: 'Windows Installer EN (.exe)    — English only installer',
      type: 'binary',
      url: 'https://github.com/Lidprex/Lidpush/releases/download/1.1.0/LidPush_1.1.0_x64_en-US.msi',
      filename: 'LidPush_1.1.0_x64_en-US.exe',
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
    try {
      execSync(`tar -xf "${zipPath}" -C "${destDir}"`, { stdio: 'ignore' });
      resolve();
    } catch {
      try {
        execSync(
          `powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${destDir}' -Force"`,
          { stdio: 'ignore' }
        );
        resolve();
      } catch (e) {
        reject(e);
      }
    }
  });
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

      if (selected.variants.length === 1) {
        variant = selected.variants[0];
      } else {
        const { variantChoice } = await inquirer.prompt([{
          type: 'select',
          name: 'variantChoice',
          message: chalk.white('Which version do you want?'),
          choices: [
            new inquirer.Separator(chalk.gray('  ────────────────────────────────────────────')),
            { name: `${chalk.gray('‹')} ${chalk.gray('Back to projects')}`, value: BACK },
            new inquirer.Separator(chalk.gray('  ────────────────────────────────────────────')),
            ...selected.variants.map((v, i) => ({ name: chalk.white(v.label), value: i })),
          ],
          loop: false,
        }]);

        if (variantChoice === BACK) continue;
        variant = selected.variants[variantChoice];
      }

      continueLoop = false;

      if (variant.type === 'binary') {
        const { destDir } = await inquirer.prompt([{
          type: 'input',
          name: 'destDir',
          message: chalk.white('Save to folder:'),
          default: process.cwd(),
        }]);

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
        message: chalk.white('Save to folder:'),
        default: selected.value,
      }]);

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
        const extractedPath = path.join(tmpDir, variant.folder);
        if (fs.existsSync(finalDir)) fs.rmSync(finalDir, { recursive: true });
        fs.renameSync(extractedPath, finalDir);
        fs.unlinkSync(tmpZip);
        spinner.succeed(p(PINK, 'Extracted successfully'));
      } catch {
        spinner.fail(chalk.red('Extraction failed'));
        process.exit(1);
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
        const variantLabels = proj.variants.map(v => chalk.gray(v.label.split('(')[0].trim())).join('  |  ');
        console.log(`     ${chalk.gray('Variants:')} ${variantLabels}`);
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