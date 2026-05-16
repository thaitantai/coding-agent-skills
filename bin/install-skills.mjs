#!/usr/bin/env node

import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function usage() {
  return `Usage:
  npx github:thaitantai/coding-agent-skills --skill <skill-name>
  npx github:thaitantai/coding-agent-skills --all
  npx github:thaitantai/coding-agent-skills --list

Options:
  --skill <name>     Install one skill
  --all              Install all skills
  --list             List available skills
  --dest <path>      Install destination (default: current working directory)
  --global           Install to CODEX_HOME/skills or ~/.codex/skills
  --force            Replace existing skill directory
  --help             Show help`;
}

function parseArgs(argv) {
  const args = {
    skill: null,
    all: false,
    list: false,
    dest: null,
    global: false,
    force: false,
    help: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--skill") {
      args.skill = argv[++i];
    } else if (arg === "--all") {
      args.all = true;
    } else if (arg === "--list") {
      args.list = true;
    } else if (arg === "--dest") {
      args.dest = argv[++i];
    } else if (arg === "--global") {
      args.global = true;
    } else if (arg === "--force") {
      args.force = true;
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!args.help && !args.list && !args.all && !args.skill) {
    throw new Error("Choose --skill <name>, --all, or --list.");
  }

  if (args.dest && args.global) {
    throw new Error("Use either --dest <path> or --global, not both.");
  }

  return args;
}

function globalDest() {
  const codexHome = process.env.CODEX_HOME;
  if (codexHome) {
    return path.join(codexHome, "skills");
  }

  const home = process.env.USERPROFILE || process.env.HOME;
  if (!home) {
    throw new Error("Cannot determine home directory. Pass --dest <path>.");
  }

  return path.join(home, ".codex", "skills");
}

function defaultDest(args) {
  if (args.dest) {
    return args.dest;
  }

  if (args.global) {
    return globalDest();
  }

  return process.cwd();
}

async function listSkills() {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const skills = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === "bin" || entry.name === ".git") {
      continue;
    }

    const skillPath = path.join(rootDir, entry.name, "SKILL.md");
    if (existsSync(skillPath)) {
      skills.push(entry.name);
    }
  }

  return skills.sort();
}

async function copySkill(skillName, destRoot, force) {
  if (!/^[a-z0-9-]+$/.test(skillName)) {
    throw new Error(`Invalid skill name: ${skillName}`);
  }

  const source = path.join(rootDir, skillName);
  const skillFile = path.join(source, "SKILL.md");
  if (!existsSync(skillFile)) {
    throw new Error(`Skill not found: ${skillName}`);
  }

  const target = path.join(destRoot, skillName);
  if (existsSync(target)) {
    if (!force) {
      throw new Error(`Target already exists: ${target}. Re-run with --force to replace it.`);
    }
    const info = await stat(target);
    if (!info.isDirectory()) {
      throw new Error(`Target exists but is not a directory: ${target}`);
    }
    await rm(target, { recursive: true, force: true });
  }

  await mkdir(destRoot, { recursive: true });
  await cp(source, target, { recursive: true });
  return target;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }

  const skills = await listSkills();
  if (args.list) {
    console.log(skills.join("\n"));
    return;
  }

  const selected = args.all ? skills : [args.skill];
  const destRoot = path.resolve(defaultDest(args));
  const installed = [];

  for (const skill of selected) {
    installed.push(await copySkill(skill, destRoot, args.force));
  }

  console.log(`Installed ${installed.length} skill(s) to ${destRoot}`);
  for (const target of installed) {
    console.log(`- ${path.basename(target)}`);
  }
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  console.error("");
  console.error(usage());
  process.exit(1);
});
