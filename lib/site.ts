// Single source of truth for brand + URLs. No brand string should appear
// anywhere else in the codebase — a rename is an edit to this file only.

export const SITE_NAME = "Sysark";
export const SITE_TAGLINE = "See what you actually built";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sysark.dev";
export const SITE_DESCRIPTION =
  "A Claude Code skill that scans your codebase and explains your architecture — components, data flow, and risks — in plain English. With Build Stories and a concepts glossary to go deeper.";

export const WORDMARK_SHORT = "sysark";
export const COPYRIGHT_NAME = "Sysark";

export const PLUGIN_REPO = "lucycrx/architecture-review";
export const PLUGIN_REPO_URL = `https://github.com/${PLUGIN_REPO}`;
export const SITE_REPO_URL = "https://github.com/lucycrx/system-design-dev";

export const INSTALL_COMMANDS = [
  "/plugin marketplace add lucycrx/architecture-review",
  "/plugin install architecture-review@lucycrx-architecture-review",
];
