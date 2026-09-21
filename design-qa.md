# Design QA — author collections and card credits

Date: 2026-09-20  
Release: 0.5.3  
Final result: passed

## Visual truth and implementation evidence

- Source visual truth: `docs/community.png`, the established Use Cases screen at 866×1199 pixels in the Linux dark theme.
- Matched implementation state: `docs/design-qa-category-current.jpg`, captured at the same category-browsing state. The browser content capture is 846×1171 because its visible page excludes the window frame; both images were normalized to the same displayed width in a side-by-side comparison.
- New extension state: `docs/author-grouping.png`, showing the grouped Authors view with the exact author selector and repeat-contributor sections.
- Density: 1× CSS pixel captures.

## Full-view comparison

The existing header, navigation, search/filter toolbar, category rail, counts, compact card grid and dark theme remain visually consistent with the source. Author grouping begins inside the existing results region and does not disturb the fixed browsing controls. All 326 use-case cards render in 27 visual groups (26 repeat contributors plus one compact single-story group), with no horizontal document overflow or clipped card footers at the tested desktop viewport.

## Focused-region comparison

- Category/author rail: unchanged chip geometry, icon treatment, counts and slider behavior; `Grouped by author` establishes the new default Authors mode.
- Author controls: the selector aligns with existing fields and uses the same host-theme surface, border and text tokens.
- Collection headers: use the established spacing, stroke and muted metadata hierarchy; they separate contributors without competing with card titles.
- Skills/Plugins attribution: the small `by …` addition stays on the existing source line and preserves full credit in the title text.

## Required surfaces

- Typography: existing system font family, weights and compact sizes preserved.
- Spacing and layout rhythm: 180px cards, grid gaps, rail spacing and result-pane rhythm preserved.
- Tokens and colors: existing Hermes background, stroke, text and accent variables reused; no new hard-coded theme introduced.
- Image quality and assets: existing Codicons and story thumbnails reused; no generated decorative assets added.
- Copy and content: plain labels describe grouping, author selection and missing attribution without changing source metadata.

## Interaction checks

- Authors mode groups repeated contributors and renders every bundled story exactly once.
- Selecting `@emmagine79` shows the contributor’s four stories together.
- Switching back to Categories and selecting Everyday help while that author remains selected narrows the collection to three stories.
- Plugins search shows the compact `Hermes community · by agentchatme` credit.
- Browser console: no warnings or errors in the verified flow.

## Findings and comparison history

First-pass side-by-side comparison found no P0, P1 or P2 visual differences. No corrective iteration was required. Native Hermes Desktop rendering remains a reopen-and-observe step because this QA run used the local browser preview.
