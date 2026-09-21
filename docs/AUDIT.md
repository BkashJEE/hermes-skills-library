# Release audit — 0.3.0

Audit date: 2026-09-20. Scope: the independent Skills & Plugins sidebar plugin, its local browser preview, paired installer and backend integration. This does not audit Hermes' built-in Capabilities screens or certify third-party plugins.

**Verdict:** suitable for an early community release with the compatibility and permissions limits below. The primary browse/detail flow works at the tested sizes. Installation behavior was exercised with real Hermes APIs in disposable profiles; a fresh live Electron installation was not part of this audit.

## 1. Find a capability — working

![Skills browsing](skills.png)

Consistent 180px cards, brief summaries, colored icons and clear action placement make the catalog scannable. Reduced header spacing gives cards more room. Search with no matches shows a recovery action; Clear filters restores results. The results pane scrolls while the header stays fixed (observed header top remained 20px after results scroll exceeded 1,300px).

Card actions were increased from approximately 22px to 32px high. Five columns fit at 1280px. No horizontal document overflow or clipped card footers was observed at 1280×900 or 1280×600; the short window retained a 224px results pane on the Plugins screen.

Remaining: the header still consumes considerable vertical space. A collapsible filter area would help short windows. Descriptions are excerpts, not a complete account of what a package can do. Some long names and summaries are truncated; open details to read them.

## 2. Browse by author — working with metadata limits

![Author filtering](authors.png)

The same rail supports categories and authors, with counts and a keyboard-operable range control. ArrowRight on the category slider selected Development and updated results. Selecting Anthropic returned seven matching skills in the observed official catalog. The full supplied credit remains in chip tooltips, accessible labels and the details dialog. Clear author & category resets the combined grouping filters.

Remaining: attribution depends on supplied metadata. Missing authors read Not listed. Different full credits can share the same short display label; full metadata stays distinct to avoid merging people incorrectly. Categories are inferred and can be wrong. Large author lists need a dedicated author search in a future release.

## 3. Inspect and import — working within the tested boundary

![Plugin catalog](plugins.png)

![Plugin details](details.png)

Plugins use the same layout. Details show the full description, attribution, selected profile and reviewed revision where available. The tested dialog showed the maintainer label correctly. Escape closed both detail and import dialogs.

The browser preview now explains that it is read-only, disables install/import/enable actions and blocks non-GET/HEAD requests in its server middleware. The repository import dialog fits a 390px viewport. Hermes Desktop remains the installation surface.

Backend integration tests cover resource-preserving skill installation, duplicate protection, profile isolation, enable/disable, invalid targets, symlink bundles, OS/dependency detection, plugin import/toggle/duplicate behavior, reviewed catalog revision and author metadata. Imported test plugins began disabled. These are API integration tests, not a live Electron click-through claim.

Remaining: structured permissions and failure modes are not supplied for every package. They cannot be inferred reliably from a summary. See [operations and recovery](OPERATIONS.md). Third-party plugin safety, remote hosts, authenticated repository imports and every external connector's runtime were not validated.

## 4. Narrow layout and accessibility — basic checks passed

![Narrow category view](narrow.png)

At 390×844, cards use one column; controls wrap without horizontal overflow and action footers remain inside their cards. The fixed filter area is tall, leaving roughly one and a half cards visible when a grouping filter is active.

Visible focus styles, labeled inputs, full author accessible names, keyboard slider operation, live result counts and Escape dismissal were checked. This is not a WCAG conformance assessment. Screen-reader interaction, color contrast across host themes, text zoom/reflow and touch ergonomics still need dedicated testing. Source dropdowns currently assume a dark host theme. The smallest 10px metadata text is a readability tradeoff of the compact design.

## Packaging and validation

- MIT license, third-party icon notices, contribution guide, installation/removal instructions and GitHub Actions checks added.
- Removed machine-specific source paths and preview build dependency paths. Optional source roots use home-relative paths; sources.local.json stays private and survives updates.
- Installer enables only explicitly selected profiles, preserves unrelated settings/comments and backs up existing files/configurations. Dry-run performs validation without writes.
- `npm run check` and `npm run build:preview`: passed.
- `python -m unittest test_installer test_library`: 11 tests passed against Hermes revision `bce20d0b1f08518b499d06109f2b027519ddeca5` on Linux.
- Disposable-home installer smoke: dry-run wrote no installation directories; real install created both entries, enabled the selected default profile, preserved its comment and left another profile unchanged.
- CI covers JavaScript syntax, preview build, installer configuration tests and Python compilation. Full Hermes integration tests are separate.

Screenshots were captured and inspected during this audit from the local preview using real catalog data. Counts are observations, not fixed inventory promises. Linux dark mode is the tested environment; macOS, Windows, light themes and future Hermes API revisions remain unverified.
