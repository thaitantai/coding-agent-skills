# Coding Agent Skills

Install Codex skills from this repository.

## Usage

List skills:

```powershell
npx github:thaitantai/coding-agent-skills --list
```

Install one skill:

```powershell
npx github:thaitantai/coding-agent-skills --skill lean-execution
```

Install all skills:

```powershell
npx github:thaitantai/coding-agent-skills --all
```

Replace an existing local skill:

```powershell
npx github:thaitantai/coding-agent-skills --skill lean-execution --force
```

Install to a custom destination:

```powershell
npx github:thaitantai/coding-agent-skills --skill lean-execution --dest C:\tmp\codex-skills
```

The default destination is:

- `$env:CODEX_HOME\skills` when `CODEX_HOME` is set.
- Otherwise `%USERPROFILE%\.codex\skills`.

## URL Form

Prefer the GitHub package spec:

```powershell
npx github:thaitantai/coding-agent-skills --skill lean-execution
```

If using a URL package spec, npm may require the git protocol prefix:

```powershell
npx git+https://github.com/thaitantai/coding-agent-skills.git --skill lean-execution
```

