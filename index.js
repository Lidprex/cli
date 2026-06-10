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
import { pipeline } from 'stream/promises';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

const PURPLE = '#9333ea';
const PINK = '#ec4899';
const FUCHSIA = '#d946ef';

const p = (hex, text) => chalk.hex(hex)(text);
const bold = (hex, text) => chalk.hex(hex).bold(text);

const BANNER = `
${bold(PURPLE, '  ██╗     ██╗██████╗ ██████╗ ██████╗ ███████╗██╗  ██╗')}
${bold(FUCHSIA, '  ██║     ██║██╔══██╗██╔══██╗██╔══██╗██╔════╝╚██╗██╔╝')}
${bold(PINK, '  ██║     ██║██║  ██║██████╔╝██████╔╝█████╗   ╚███╔╝ ')}
${bold(FUCHSIA, '  ██║     ██║██║  ██║██╔═══╝ ██╔══██╗██╔══╝   ██╔██╗ ')}
${bold(PURPLE, '  ███████╗██║██████╔╝██║     ██║  ██║███████╗██╔╝ ██╗')}
${p('#6b21a8', '  ╚══════╝╚═╝╚═════╝ ╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝')}

  ${p(PINK, '◆')} ${chalk.white.bold('Lidprex CLI')}  ${chalk.gray('v1.0.0')}  ${p(PURPLE, '— Build. Ship. Repeat.')}
  ${chalk.gray('  github.com/lidprex')}
`;

const PROJECTS = [
  {
    name: `${bold(PINK, 'Idea2Project')}  ${chalk.gray('AI project blueprints')}`,
    value: 'idea2project',
    zip: 'https://github.com/Lidprex/Idea2Project/archive/refs/heads/main.zip',
    folder: 'Idea2Project-main',
    tech: 'Node.js + React + PostgreSQL',
    status: p('#22c55e', '● Live'),
  },
  {
    name: `${bold(FUCHSIA, 'LidBridge')}     ${chalk.gray('Clean & push to GitHub')}`,
    value: 'lidbridge',
    zip: 'https://github.com/Lidprex/LidBridge/archive/refs/heads/main.zip',
    folder: 'LidBridge-main',
    tech: 'Electron + Node.js',
    status: p('#f59e0b', '◐ Beta'),
  },
  {
    name: `${bold(PURPLE, 'LeakShield')}    ${chalk.gray('Local-first secret scanner')}`,
    value: 'leakshield',
    zip: 'https://github.com/Lidprex/LeakShield/archive/refs/heads/main.zip',
    folder: 'LeakShield-main',
    tech: 'Python',
    status: p('#f59e0b', '◐ Beta'),
  },
  {
    name: `${bold('#a855f7', 'RepoPrep')}      ${chalk.gray('Clean repos, faster handoffs')}`,
    value: 'repoprep',
    zip: 'https://github.com/Lidprex/RepoPrep-Pro/archive/refs/heads/main.zip',
    folder: 'RepoPrep-main',
    tech: 'Python',
    status: p('#6366f1', '○ Internal'),
  },
  {
  name: `${bold('#00cec9', 'LidPush')}       ${chalk.gray('Smart GitHub sync tool')}`,
  value: 'lidpush',
  zip: 'https://github.com/Lidprex/Lidpush/archive/refs/heads/main.zip',
  folder: 'Lidpush-main',
  tech: 'Tauri + Rust + React',
  status: p('#22c55e', '● Live'),
  },
];

const DIVIDER = chalk.gray('  ' + '─'.repeat(52));

function printBanner() {
  console.log(BANNER);
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const followRedirect = (url) => {
      https.get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          followRedirect(res.headers.location);
          return;
        }
        const total = parseInt(res.headers['content-length'] || '0', 10);
        let downloaded = 0;
        const file = createWriteStream(dest);
        res.on('data', (chunk) => {
          downloaded += chunk.length;
          if (total > 0) {
            const pct = Math.round((downloaded / total) * 100);
            const bar = '█'.repeat(Math.floor(pct / 5)) + '░'.repeat(20 - Math.floor(pct / 5));
            process.stdout.write(`\r  ${p(PINK, bar)} ${chalk.white(pct + '%')} ${chalk.gray(Math.round(downloaded / 1024) + ' KB')}`);
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
        execSync(`powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${destDir}' -Force"`, { stdio: 'ignore' });
        resolve();
      } catch (e) {
        reject(e);
      }
    }
  });
}

program
  .name('lidprex')
  .description(chalk.white('Lidprex CLI — manage and clone Lidprex open source projects'))
  .version('1.0.0', '-v, --version', 'show version');

program
  .command('init')
  .description('download a Lidprex project to your machine')
  .action(async () => {
    printBanner();
    console.log(DIVIDER);
    console.log(`  ${p(PINK, '◆')} ${chalk.white.bold('Project Setup')}\n`);

    const { project } = await inquirer.prompt([
      {
        type: 'select',
        name: 'project',
        message: chalk.white('Which project do you want to download?'),
        choices: PROJECTS.map(pr => ({ name: pr.name, value: pr.value })),
        loop: false,
      },
    ]);

    const selected = PROJECTS.find(pr => pr.value === project);

    const { dir } = await inquirer.prompt([
      {
        type: 'input',
        name: 'dir',
        message: chalk.white('Save to folder:'),
        default: selected.value,
      },
    ]);

    const { install } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'install',
        message: chalk.white('Run npm install after download?'),
        default: true,
      },
    ]);

    console.log();
    console.log(DIVIDER);
    console.log(`  ${p(FUCHSIA, '◆')} ${chalk.white.bold(selected.value)}  ${chalk.gray(selected.tech)}  ${selected.status}`);
    console.log(DIVIDER);
    console.log();

    const tmpZip = path.join(process.cwd(), `${selected.value}-tmp.zip`);
    const tmpDir = process.cwd();
    const finalDir = path.join(process.cwd(), dir);

    console.log(`  ${chalk.gray('Downloading')} ${p(PINK, selected.value)} ${chalk.gray('...')}\n`);

    try {
      await downloadFile(selected.zip, tmpZip);
    } catch (e) {
      console.log(`\n  ${chalk.red('✗')} Download failed — check your connection`);
      process.exit(1);
    }

    const spinner = ora({ text: chalk.white('Extracting...'), color: 'magenta' }).start();
    try {
      await unzip(tmpZip, tmpDir);
      const extractedPath = path.join(tmpDir, selected.folder);
      if (fs.existsSync(finalDir)) fs.rmSync(finalDir, { recursive: true });
      fs.renameSync(extractedPath, finalDir);
      fs.unlinkSync(tmpZip);
      spinner.succeed(p(PINK, 'Extracted successfully'));
    } catch (e) {
      spinner.fail(chalk.red('Extraction failed'));
      process.exit(1);
    }

    if (install) {
      const spinner2 = ora({ text: chalk.white('Installing dependencies...'), color: 'magenta' }).start();
      try {
        execSync(`cd "${finalDir}" && npm install`, { stdio: 'ignore', shell: true });
        spinner2.succeed(p(PINK, 'Dependencies installed'));
      } catch {
        spinner2.warn(chalk.yellow('npm install failed — run it manually'));
      }
    }

    console.log();
    console.log(DIVIDER);
    console.log(`  ${p('#22c55e', '✓')} ${chalk.white.bold('Ready!')} Project saved to ${chalk.hex(PINK)(dir)}`);
    console.log();
    console.log(`  ${chalk.gray('Next steps:')}`);
    console.log(`  ${p(PURPLE, '→')} ${chalk.white(`cd ${dir}`)}`);
    console.log(`  ${p(PURPLE, '→')} ${chalk.white('npm run dev')}`);
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
      { name: 'Lidprex Main', url: 'lidprex.onrender.com' },
      { name: 'Idea2Project', url: 'idea2project.onrender.com' },
      { name: 'LidBridge', url: 'lidbridge.onrender.com' },
      { name: 'Lidprex Labs', url: 'lidprex-labs.onrender.com' },
      { name: 'RepoPrep', url: 'repoprep.onrender.com' },
      { name: 'LeakShield', url: 'leakshield.onrender.com' },
    ];

    const checkService = (url) => {
      return new Promise((resolve) => {
        const start = Date.now();
        const req = https.get(`https://${url}`, { timeout: 5000 }, (res) => {
          const ms = Date.now() - start;
          resolve({ ok: res.statusCode < 500, ms, code: res.statusCode });
        });
        req.on('error', () => resolve({ ok: false, ms: 0, code: 0 }));
        req.on('timeout', () => { req.destroy(); resolve({ ok: false, ms: 0, code: 408 }); });
      });
    };

    for (const svc of services) {
      const lineSpinner = ora({ text: `  Checking ${chalk.gray(svc.name)}...`, color: 'magenta' }).start();
      const result = await checkService(svc.url);
      const nameCol = chalk.white(svc.name.padEnd(16));
      const urlCol = chalk.gray(svc.url.padEnd(32));
      if (result.ok) {
        lineSpinner.succeed(`  ${nameCol} ${urlCol} ${p('#22c55e', '● Operational')}  ${chalk.gray(result.ms + 'ms')}`);
      } else {
        const code = result.code === 408 ? 'Timeout' : result.code === 0 ? 'Unreachable' : `HTTP ${result.code}`;
        lineSpinner.fail(`  ${nameCol} ${urlCol} ${chalk.red('✗ ' + code)}`);
      }
    }

    console.log();
    console.log(DIVIDER);
    console.log(`  ${chalk.gray('Full status page →')} ${p(PINK, 'https://lidprex.onrender.com/status')}`);
    console.log(DIVIDER);
    console.log();
  });

program
  .command('list')
  .description('list all available Lidprex open source projects')
  .action(() => {
    printBanner();
    console.log(DIVIDER);
    console.log(`  ${p(PINK, '◆')} ${chalk.white.bold('Open Source Projects')}\n`);
    for (const proj of PROJECTS) {
      console.log(`  ${p(PINK, '→')} ${proj.name}`);
      console.log(`     ${chalk.gray('Tech:')} ${chalk.white(proj.tech)}   ${proj.status}`);
      console.log();
    }
    console.log(DIVIDER);
    console.log(`  ${chalk.gray('GitHub →')} ${p(PINK, 'github.com/lidprex')}`);
    console.log(DIVIDER);
    console.log();
  });

program.addHelpText('before', BANNER);
program.parse();