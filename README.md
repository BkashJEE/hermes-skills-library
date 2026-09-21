# Hermes Skills & Plugins Library

A community-built **Skills & Plugins** sidebar tab for Hermes Desktop. Browse compact flashcards, understand a capability before opening it, and filter by category or author.

This is an independent plugin by Bikash Joshi. It does not replace Hermes' built-in Capabilities screens and is not an official Nous Research product.

![Skills catalog](docs/skills.png)

## Features

- **Use Cases** brings the official Nous documentation’s user stories into the library, with category/author/source filters, details and links to the docs and original stories.
- Skills and plugins share a compact, responsive card layout with colorful icons and brief summaries.
- Switch **Categories / Authors** to browse chips with counts, arrows, or a keyboard-accessible slider.
- Short author labels keep the rail readable; hover or open details for full attribution. Maintainers and repository owners are explicitly identified as fallbacks, not assumed authors.
- Search, source filters, Discover/Installed views, and explicit profile selection.
- Fixed browsing controls and a floating scrollbar. Cards open full details.
- Skill imports preserve resource files and reuse Hermes' scanner/quarantine flow.
- Plugin imports reuse Hermes' existing installer, begin disabled, and reject duplicates. Catalog imports preserve the reviewed revision.

## Requirements and status

**Early community release, v0.5.0.** Tested on Linux (Omarchy), with Hermes source revision `bce20d0b1f08518b499d06109f2b027519ddeca5`. macOS and Windows are not yet verified. Hermes' internal Python and Desktop SDK APIs can change between updates.

You need a working Hermes Desktop installation and access to its Python environment. This repository contains the plugin; it does not bundle Hermes, third-party skills, credentials, or connector packages.

## Install

Clone this repository, then run the installer using **Hermes' Python environment**. In a typical Linux/macOS source installation:

```bash
git clone https://github.com/BkashJEE/hermes-skills-library.git
cd hermes-skills-library
PYTHONPATH="$HOME/.hermes/hermes-agent" "$HOME/.hermes/hermes-agent/venv/bin/python" install.py --profile default --dry-run
PYTHONPATH="$HOME/.hermes/hermes-agent" "$HOME/.hermes/hermes-agent/venv/bin/python" install.py --profile default
```

Adjust the Hermes repository/interpreter paths if your installation differs. `--profile` accepts an existing profile and can be repeated. `--all-profiles` is an explicit opt-in; without either option, files are copied but no profile configuration is enabled.

The installer places the backend in `<Hermes root>/plugins/hermes-skills-library/` and the Desktop entry in `<Hermes root>/desktop-plugins/hermes-skills-library/`. It backs up existing files and selected profile configurations first, preserves unrelated settings, and respects explicit disable settings. No skills or other plugins are bulk-installed.

**Reopen Hermes Desktop**, choose the local connection, then open **Skills & Plugins** in the sidebar or command palette. This release uses the paired installer above; generic Git import of this library itself is not the documented installation path.

## Use

1. Choose the destination **Agent** profile.
2. Choose **Skills** or **Plugins**, then search or browse Categories / Authors. Filters combine; **Clear author & category** clears both grouping filters.
3. Open **View card** to read the full description, attribution, requirements and available details.
4. Install a skill for that profile, or import a plugin and enable it when ready. Skill changes apply to new conversations; plugin changes may require reopening Hermes.

Cards use author metadata exactly as supplied. Short labels are presentation only: matching preserves complete attribution, so separate credits are not silently merged. Missing attribution is labeled **Not listed**. Common skills have curated brief summaries; other cards use description excerpts. Categories are inferred and may need correction.

## Use cases from the Nous docs

Open **Use Cases** beside Skills and Plugins to browse [Nous Research’s official User Stories & Use Cases collection](https://hermes-agent.nousresearch.com/docs/user-stories). This snapshot contains 326 stories across 15 categories. Search by headline or author, filter by source, switch Categories / Authors, or sort A–Z. **View use case** opens details; **Original story** opens the post linked by Nous; **Nous use-case docs** opens the official collection.

![Use cases from the Nous docs](docs/community.png)

Only entries from the official docs dataset are included. Titles, authors, categories, dates and source links are preserved; original post quotations are not copied. These are attributed user experiences, not independently verified outcomes. Counts reflect the bundled snapshot, not a live feed.

The source revision and sync date are recorded in `dashboard/community.json`. The snapshot is embedded in the Desktop entry, so it appears even without a backend or social sign-in. To refresh it, run `python scripts/import-nous-stories.py --revision <full NousResearch/hermes-agent commit SHA>`, then `npm run sync:community` and the checks. Review the diff before publishing.

## Optional local skill sources

`dashboard/sources.json` lists optional home-relative Codex, shared-agent and OpenClaw skill directories. Missing folders are skipped. To use other roots, create `sources.local.json` beside the **installed backend's** `sources.json`; this overrides defaults and is preserved by updates. Its format is an array of `{ "path": "~/my-skills", "label": "My skills" }` objects.

Reading another runtime's skill does not install its apps, connectors, credentials or dependencies. Instructions may need adaptation. Unsupported operating-system requirements are surfaced.

## Permissions and failure modes

Read [permissions and troubleshooting](docs/OPERATIONS.md) before enabling the plugin. It reads configured skill directories and profile/plugin metadata; actions can write to the selected profile and clone public or authenticated repositories through Hermes. Plugins are executable code: scanner approval is not a sandbox or guarantee of safety.

## Development and read-only preview

Node.js 20+ is only needed to build the optional browser preview. Hermes provides React and its SDK in Desktop; the installed entry needs no JavaScript build.

```bash
npm ci
npm run check
npm run build:preview
# Use Hermes' Python environment with its repository on PYTHONPATH:
python -m unittest test_installer test_library
python -m uvicorn preview.server:app --host 127.0.0.1 --port 8788
```

The preview reads local catalog data. **Do not expose it publicly.** It blocks all non-GET/HEAD requests, and installation controls are disabled. It is not a hosted installer.

Tests use a disposable Hermes home for skill/plugin imports and profile isolation. `test_installer` only needs PyYAML; `test_library` also needs Hermes, FastAPI and httpx. CI checks syntax, preview build and installer config preservation; integration tests are run separately against Hermes. See the [audit and validation report](docs/AUDIT.md) for scope and limitations.

## Update, disable and remove

Pull the desired revision and rerun the paired installer. Backups are printed by the command. Your `sources.local.json` is preserved.

Disable `hermes-skills-library` for each profile where you enabled it and disable its Desktop entry in Hermes' plugin settings. Reopen Hermes. For full removal, move the two installation directories listed above into a backup folder after disabling them. The Desktop entry/backend are shared across profiles; do not remove them while another profile still uses the library. Skills/plugins imported through the library remain installed and can be managed in Hermes.

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md). Reports with OS, Hermes revision, reproduction steps and redacted screenshots are welcome. This independent tab retains the custom design; the earlier built-in UI proposal [#114003](https://github.com/NousResearch/hermes-agent/pull/114003) was closed after its upstream card-browser foundation was reverted.

MIT licensed. See [LICENSE](LICENSE) and [icon notices](THIRD_PARTY_NOTICES.md).
