# Design QA — guided use-case recreation

Date: 2026-09-21

Release: 0.6.3

Final result: passed

## Visual truth and implementation evidence

- Source visual truth: `docs/community.png`, the established Use Cases screen in the Linux dark theme.
- Verified implementation: local browser preview at the normal desktop viewport, category browsing mode, all 326 bundled stories, and both catalog library states.
- Focused states: the first story's recreation details dialog plus the Skills Discover and Installed views.
- Density: 1× CSS pixels.

## Full-view comparison

The header, tabs, toolbar, category rail, count line, fixed results pane and 180px card grid remain unchanged. Each card footer now fits the category, **Preview**, and **Recreate** actions on one line. The screenshot check showed no horizontal page overflow, clipped labels, overlapping footers or card height changes across the visible five-column grid.

## Focused-region comparison

- **Preview** retains the existing lightweight popover and details behavior.
- **Recreate** uses the card accent color and the existing Codicon family, so it reads as an action without adding another filled control.
- The details dialog adds one tinted explanation block and a full **Build with Hermes** action. It fits within the existing 620px dialog and keeps the source links and Close action visible without scrolling at the tested viewport.
- The explanation uses plain language: map the workflow first, recommend the current Agent or a dedicated Bot, then create only after review.

## Required surfaces

- Typography: existing system type, weights and compact labels preserved.
- Spacing: card height remains 180px; footer gaps were reduced only for the two adjacent actions.
- Theme: existing Hermes background, stroke, text and per-card accent tokens reused.
- Icons: existing colorful card icons and Codicons reused; no new asset dependency.
- Responsive behavior: actions remain keyboard-addressable and the existing single-column narrow layout continues to apply.

## Interaction and accessibility checks

- Discover and Installed use one segmented control with distinct search and check icons, live totals, visible active state and accessible names. Discover showed 453 available skills with no installed duplicates; Installed showed the selected Agent's 79 canonical installed skills with Manage actions.
- Each library state recomputes the source menu, category totals, summary and empty-state copy from the rows it can actually display.
- All 326 cards render **Preview** and **Recreate** with unique accessible names tied to the story and selected Agent.
- Browser preview makes the environment limit explicit and opens the explanatory details dialog instead of creating a chat.
- The dialog exposes the story, author, source, recreation boundary, original link and Nous docs link.
- The generated Hermes prompt contains source-first workflow mapping, the active workspace, source attribution, fact/assumption separation, close-recreation/adaptation choice, read-only inspection, an Agent-versus-Bot recommendation, Bot Forge-style blueprint, permissions, credentials, costs, failure modes, recovery steps and an approval gate.
- Automated launch-contract coverage verifies routed session retention, foreground session creation, eager title, visible session open, prompt submission and release order.

## Findings

No P0, P1 or P2 visual issues remained after the desktop and dialog inspection. The direct Hermes session path is covered by the current Desktop SDK contract and automated RPC-order test; browser preview intentionally stops at the explanation because it has no live Hermes gateway.
