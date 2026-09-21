# Design QA — guided use-case recreation

Date: 2026-09-21

Release: 0.6.0

Final result: passed

## Visual truth and implementation evidence

- Source visual truth: `docs/community.png`, the established Use Cases screen in the Linux dark theme.
- Verified implementation: local browser preview at the normal desktop viewport, category browsing mode, all 326 bundled stories.
- Focused state: the first story's recreation details dialog, opened from the new card action.
- Density: 1× CSS pixels.

## Full-view comparison

The header, tabs, toolbar, category rail, count line, fixed results pane and 180px card grid remain unchanged. Each card footer now fits the category, **Preview**, and **Recreate** actions on one line. The screenshot check showed no horizontal page overflow, clipped labels, overlapping footers or card height changes across the visible five-column grid.

## Focused-region comparison

- **Preview** retains the existing lightweight popover and details behavior.
- **Recreate** uses the card accent color and the existing Codicon family, so it reads as an action without adding another filled control.
- The details dialog adds one tinted explanation block and a full **Build with Hermes** action. It fits within the existing 620px dialog and keeps the source links and Close action visible without scrolling at the tested viewport.
- The explanation uses plain language: inspect first, ask about needs, show permissions and failure points, then change only after approval.

## Required surfaces

- Typography: existing system type, weights and compact labels preserved.
- Spacing: card height remains 180px; footer gaps were reduced only for the two adjacent actions.
- Theme: existing Hermes background, stroke, text and per-card accent tokens reused.
- Icons: existing colorful card icons and Codicons reused; no new asset dependency.
- Responsive behavior: actions remain keyboard-addressable and the existing single-column narrow layout continues to apply.

## Interaction and accessibility checks

- All 326 cards render **Preview** and **Recreate** with unique accessible names tied to the story and selected Agent.
- Browser preview makes the environment limit explicit and opens the explanatory details dialog instead of creating a chat.
- The dialog exposes the story, author, source, recreation boundary, original link and Nous docs link.
- The generated Hermes prompt contains the active workspace, source attribution, close-recreation/adaptation choice, read-only first step, permissions, credentials, costs, failure modes, recovery steps and an approval gate.
- Automated launch-contract coverage verifies routed session retention, foreground session creation, eager title, visible session open, prompt submission and release order.

## Findings

No P0, P1 or P2 visual issues remained after the desktop and dialog inspection. The direct Hermes session path is covered by the current Desktop SDK contract and automated RPC-order test; browser preview intentionally stops at the explanation because it has no live Hermes gateway.
