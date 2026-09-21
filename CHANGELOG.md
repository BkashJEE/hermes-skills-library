# Changelog

Notable changes to this project are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and releases use semantic versioning while the project remains pre-1.0.

## 0.6.3 - 2026-09-21

### Changed

- Discover now contains only capabilities available to add, while Installed contains only capabilities already present on the selected Agent.
- The two views use a compact segmented control with icons and live counts, plus view-specific summaries and empty states.
- The README now includes a compact repository-health widget linking to CI, Dependabot, security, release and community reports.

## 0.6.2 - 2026-09-21

### Fixed

- Guided recreation now resolves the selected Agent through `host.profileRoutes()` and uses the same route for session retention, creation, opening and prompt submission.
- Duplicate profile names across local and remote connections are constrained to the active Hermes connection instead of relying on ambiguous profile-only routing.

## 0.6.1 - 2026-09-21

### Added

- Workflow-first recreation for official Nous use cases.
- Agent-versus-Bot recommendations and a Bot Forge-style blueprint covering role, tools, routines, memory, permissions, tests and rollback.
- Approval gate before bot creation, installation, configuration, credential use, schedules or external actions.

### Changed

- Use-case detail cards now explain the analysis and bot-design stages before creation.

## 0.6.0 - 2026-09-21

### Added

- **Recreate** actions that open a guided chat on the selected Hermes Agent.
- Read-only workspace inspection, setup disclosure, failure-mode review and approval gates.

## 0.5.3 - 2026-09-21

### Added

- Author collections for official use cases.
- Compact creator credits on Skills and Plugins cards.

## 0.5.2 - 2026-09-21

### Added

- Hover and keyboard previews for community use cases.
- Plain-language category names.

## 0.5.1 - 2026-09-21

### Added

- Refresh support for the official Nous user-stories dataset.

## 0.5.0 - 2026-09-20

### Added

- A Use Cases catalog sourced from the official Nous documentation.

## 0.4.1 - 2026-09-20

### Fixed

- Desktop loading and bundled fallback behavior.

## 0.4.0 - 2026-09-20

### Added

- Community browsing inside the Desktop plugin.

## 0.3.0 - 2026-09-20

### Added

- Compact Skills and Plugins cards, author and category browsing, profile-aware imports and the paired installer.
