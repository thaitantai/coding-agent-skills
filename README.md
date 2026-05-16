# Coding Agent Skills

Install Codex skills from this repository.

## Usage

List skills:

```powershell
npx https://github.com/thaitantai/coding-agent-skills --list
```

Install one skill:

```powershell
npx https://github.com/thaitantai/coding-agent-skills --skill lean-execution
```

Install all skills:

```powershell
npx https://github.com/thaitantai/coding-agent-skills --all
```

Replace an existing local skill:

```powershell
npx https://github.com/thaitantai/coding-agent-skills --skill lean-execution --force
```

Install to a custom destination:

```powershell
npx https://github.com/thaitantai/coding-agent-skills --skill lean-execution --dest C:\tmp\codex-skills
```

The default destination is:

- `$env:CODEX_HOME\skills` when `CODEX_HOME` is set.
- Otherwise `%USERPROFILE%\.codex\skills`.

## URL Form

Preferred URL form:

```powershell
npx https://github.com/thaitantai/coding-agent-skills --skill lean-execution
```

Equivalent GitHub package spec:

```powershell
npx github:thaitantai/coding-agent-skills --skill lean-execution
```

If npm reports `UNABLE_TO_VERIFY_LEAF_SIGNATURE`, fix the local npm/Node
certificate configuration or corporate proxy CA. The installer is being reached,
but npm cannot verify GitHub's tarball certificate.
