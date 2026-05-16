# Coding Agent Skills

Install Codex skills from this repository.

## Usage

List skills:

```powershell
npx https://github.com/thaitantai/coding-agent-skills list
```

Install one skill into the current directory:

```powershell
npx https://github.com/thaitantai/coding-agent-skills install lean-execution
```

Install all skills into the current directory:

```powershell
npx https://github.com/thaitantai/coding-agent-skills install --all
```

Uninstall one skill from the current directory:

```powershell
npx https://github.com/thaitantai/coding-agent-skills uninstall lean-execution
```

Uninstall all skills from the current directory:

```powershell
npx https://github.com/thaitantai/coding-agent-skills uninstall --all
```

By default, skills are installed into the directory where you run `npx`.
For example, running from `F:\Projects\mcp-manager-server` installs skill folders
directly under `F:\Projects\mcp-manager-server`.

## Options

Replace an existing skill:

```powershell
npx https://github.com/thaitantai/coding-agent-skills install lean-execution --force
```

Preview changes without writing files:

```powershell
npx https://github.com/thaitantai/coding-agent-skills install lean-execution --dry-run
npx https://github.com/thaitantai/coding-agent-skills uninstall lean-execution --dry-run
```

Install to a custom destination:

```powershell
npx https://github.com/thaitantai/coding-agent-skills install lean-execution --dest C:\tmp\codex-skills
```

Run against a different working directory:

```powershell
npx https://github.com/thaitantai/coding-agent-skills install lean-execution --cwd F:\Projects\mcp-manager-server
```

Install to global Codex skills:

```powershell
npx https://github.com/thaitantai/coding-agent-skills install --all --global
```

Uninstall from global Codex skills:

```powershell
npx https://github.com/thaitantai/coding-agent-skills uninstall lean-execution --global
```

Machine-readable output:

```powershell
npx https://github.com/thaitantai/coding-agent-skills list --json
npx https://github.com/thaitantai/coding-agent-skills install lean-execution --json
```

## Backward Compatibility

The previous flag-first form still works:

```powershell
npx https://github.com/thaitantai/coding-agent-skills --list
npx https://github.com/thaitantai/coding-agent-skills --skill lean-execution
npx https://github.com/thaitantai/coding-agent-skills --uninstall --skill lean-execution
```

## URL Form

Preferred URL form:

```powershell
npx https://github.com/thaitantai/coding-agent-skills install lean-execution
```

Equivalent GitHub package spec:

```powershell
npx github:thaitantai/coding-agent-skills install lean-execution
```

If npm reports `UNABLE_TO_VERIFY_LEAF_SIGNATURE`, fix the local npm/Node
certificate configuration or corporate proxy CA. The installer is being reached,
but npm cannot verify GitHub's tarball certificate.
