#!/usr/bin/env node

import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const version = "0.2.0";

function usage() {
  return `Usage:
  npx github:thaitantai/coding-agent-skills install <skill-name>
  npx github:thaitantai/coding-agent-skills install --all
  npx github:thaitantai/coding-agent-skills uninstall <skill-name>
  npx github:thaitantai/coding-agent-skills uninstall --all
  npx github:thaitantai/coding-agent-skills list

Options:
  --skill <name>     Select one skill (legacy form)
  --all              Select all skills
  --uninstall        Uninstall selected skill(s) (legacy form)
  --list             List available skills (legacy form)
  --cwd <path>       Run as if started in this working directory
  --dest <path>      Install destination (default: current working directory)
  --global           Install to CODEX_HOME/skills or ~/.codex/skills
  --force            Replace existing skill directory
  --dry-run          Preview changes without writing files
  --json             Output machine-readable JSON
  --silent           Minimal output
  --version          Show version
  --help             Show help`;
}

function parseArgs(argv) {
  const args = {
    command: null,
    targets: [],
    skill: null,
    all: false,
    uninstall: false,
    list: false,
    cwd: null,
    dest: null,
    global: false,
    force: false,
    dryRun: false,
    json: false,
    silent: false,
    version: false,
    help: false
  };

  const commands = new Map([
    ["install", "install"],
    ["add", "install"],
    ["uninstall", "uninstall"],
    ["remove", "uninstall"],
    ["rm", "uninstall"],
    ["list", "list"],
    ["ls", "list"]
  ]);

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("-") && !args.command && commands.has(arg)) {
      args.command = commands.get(arg);
    } else if (!arg.startsWith("-")) {
      args.targets.push(arg);
    } else if (arg === "--skill") {
      args.skill = argv[++i];
    } else if (arg === "--all") {
      args.all = true;
    } else if (arg === "--uninstall") {
      args.uninstall = true;
    } else if (arg === "--list") {
      args.list = true;
    } else if (arg === "--cwd") {
      args.cwd = argv[++i];
    } else if (arg === "--dest") {
      args.dest = argv[++i];
    } else if (arg === "--global") {
      args.global = true;
    } else if (arg === "--force") {
      args.force = true;
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--json") {
      args.json = true;
    } else if (arg === "--silent") {
      args.silent = true;
    } else if (arg === "--version" || arg === "-v") {
      args.version = true;
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (args.version || args.help) {
    return args;
  }

  if (args.uninstall && !args.command) {
    args.command = "uninstall";
  } else if (args.list && !args.command) {
    args.command = "list";
  } else if (!args.command) {
    args.command = "install";
  }

  if (args.command === "uninstall") {
    args.uninstall = true;
  } else if (args.command === "list") {
    args.list = true;
  }

  if (args.targets.length > 0 && args.skill) {
    throw new Error("Use either positional skill names or --skill <name>, not both.");
  }

  if (args.targets.length > 1 && !args.all) {
    throw new Error("Install or uninstall one skill at a time, or use --all.");
  }

  if (args.targets.length === 1) {
    args.skill = args.targets[0];
  }

  if (args.all && args.skill) {
    throw new Error("Use either a skill name or --all, not both.");
  }

  if (args.dest && args.global) {
    throw new Error("Use either --dest <path> or --global, not both.");
  }

  if (args.command !== "list" && !args.all && !args.skill) {
    throw new Error("Choose a skill name or --all.");
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

  return args.cwd || process.cwd();
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

async function planInstall(skillName, destRoot, force, dryRun) {
  const source = path.join(rootDir, skillName);
  const skillFile = path.join(source, "SKILL.md");
  if (!existsSync(skillFile)) {
    throw new Error(`Skill not found: ${skillName}`);
  }

  const target = path.join(destRoot, skillName);
  const exists = existsSync(target);
  if (dryRun) {
    return { skill: skillName, target, action: exists && force ? "replace" : exists ? "skip-existing" : "install" };
  }

  return { skill: skillName, target: await copySkill(skillName, destRoot, force), action: exists && force ? "replaced" : "installed" };
}

async function removeSkill(skillName, destRoot) {
  if (!/^[a-z0-9-]+$/.test(skillName)) {
    throw new Error(`Invalid skill name: ${skillName}`);
  }

  const target = path.join(destRoot, skillName);
  if (!existsSync(target)) {
    return { target, removed: false };
  }

  const info = await stat(target);
  if (!info.isDirectory()) {
    throw new Error(`Target exists but is not a directory: ${target}`);
  }

  const skillFile = path.join(target, "SKILL.md");
  if (!existsSync(skillFile)) {
    throw new Error(`Refusing to remove ${target}: missing SKILL.md`);
  }

  await rm(target, { recursive: true, force: true });
  return { target, removed: true };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.version) {
    console.log(version);
    return;
  }

  if (args.help) {
    console.log(usage());
    return;
  }

  const skills = await listSkills();
  if (args.list) {
    if (args.json) {
      console.log(JSON.stringify({ skills }, null, 2));
    } else {
      console.log(skills.join("\n"));
    }
    return;
  }

  const selected = args.all ? skills : [args.skill];
  const destRoot = path.resolve(defaultDest(args));

  if (args.uninstall) {
    const results = [];
    for (const skill of selected) {
      if (args.dryRun) {
        const target = path.join(destRoot, skill);
        results.push({ target, removed: false, action: existsSync(target) ? "would-remove" : "not-found" });
      } else {
        results.push(await removeSkill(skill, destRoot));
      }
    }

    const removed = results.filter((result) => result.removed);
    if (args.json) {
      console.log(JSON.stringify({ command: "uninstall", destination: destRoot, results }, null, 2));
    } else if (!args.silent) {
      const verb = args.dryRun ? "Would uninstall" : "Uninstalled";
      const count = args.dryRun ? results.filter((result) => result.action === "would-remove").length : removed.length;
      console.log(`${verb} ${count} skill(s) from ${destRoot}`);
      for (const result of results) {
        const label = result.action || (result.removed ? "removed" : "not-found");
        console.log(`${label}: ${path.basename(result.target)}`);
      }
    }
    return;
  }

  const results = [];

  for (const skill of selected) {
    results.push(await planInstall(skill, destRoot, args.force, args.dryRun));
  }

  if (args.json) {
    console.log(JSON.stringify({ command: "install", destination: destRoot, results }, null, 2));
  } else if (!args.silent) {
    const verb = args.dryRun ? "Would install" : "Installed";
    console.log(`${verb} ${results.length} skill(s) to ${destRoot}`);
    for (const result of results) {
      console.log(`${result.action}: ${path.basename(result.target)}`);
    }
  }
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  console.error("");
  console.error(usage());
  process.exit(1);
});
