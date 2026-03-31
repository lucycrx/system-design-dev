# CLAUDE.md

## Auto-commit

After completing a major change (new feature, significant bug fix, refactor, or meaningful edit across multiple files), automatically stage the relevant files and create a git commit. Do not wait for the user to ask. Use a clear, concise commit message that describes what changed and why. Only skip auto-committing for minor or exploratory changes (e.g., small typo fixes mid-task, temporary debugging code).

## Architecture Review Plugin

The `architecture-review` skill is published as a Claude Code plugin at https://github.com/lucycrx/architecture-review. The source of truth is the separate repo at `/Users/lucychen/Code/architecture-review-plugin/`. The skill directory in this project (`.claude/skills/architecture-review/`) is a symlink pointing there. When making changes to the skill, commit and push from the plugin repo, not this one.

## Deployment

The site is hosted on Vercel at https://system-design-dev.vercel.app/. The GitHub repo is https://github.com/lucycrx/system-design-dev. Vercel auto-deploys on every push to `main`, so always push after committing changes.
