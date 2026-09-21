# Contributing

Use small changes that preserve the independent sidebar tab and existing profile isolation. Keep core Hermes files untouched. Do not commit credentials, local source overrides, generated preview bundles or personal screenshots.

Open an issue before starting a large behavior or data-model change. For a focused fix, create a branch, keep commits reviewable and open a pull request with the supplied template. By contributing, you agree to follow the [code of conduct](CODE_OF_CONDUCT.md).

Run `npm ci --ignore-scripts`, `npm run check`, `npm run test:community`, `npm run build:preview`, and `python -m unittest test_installer test_stories`. Run `python -m unittest test_installer test_library test_stories` using Hermes' Python environment when the change touches imports, profiles or backend behavior. For UI changes inspect desktop/narrow widths, Skills/Plugins/Use Cases, category/author filtering, empty states, keyboard focus and details dialogs. Keep cards compact and full information available in details.

Bug reports should include the OS, Hermes revision, library revision, reproduction steps and expected behavior. Remove private names, paths and tokens from reports. Never include live credentials.

Author corrections should preserve original full credits. Do not assume a repository owner authored all its contents. New source directories must be optional and portable.

Security reports belong in GitHub's private vulnerability-reporting flow described in [SECURITY.md](SECURITY.md), not in public issues.

## Update official use cases

Use Cases must come from the official Nous Research `website/src/data/userStories.json` dataset. Do not add independent project selections. Suggest new stories to the upstream documentation; import a reviewed upstream commit with `python scripts/import-nous-stories.py --revision <full SHA>`, then run `npm run sync:community`. Preserve attribution and original HTTPS source links, and do not copy third-party post quotations. `npm run check` verifies snapshot synchronization; `npm run test:community` verifies the tab renders without a backend.
