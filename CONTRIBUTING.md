# Contributing

Use small changes that preserve the independent sidebar tab and existing profile isolation. Keep core Hermes files untouched. Do not commit credentials, local source overrides, generated preview bundles or personal screenshots.

Run `npm ci`, `npm run check`, `npm run build:preview`, and `python -m unittest test_installer test_library` using Hermes' Python environment. For UI changes inspect desktop/narrow widths, Skills/Plugins, category/author filtering, empty states, keyboard focus and details dialogs. Keep cards compact and full information available in details.

Bug reports should include the OS, Hermes revision, library revision, reproduction steps and expected behavior. Remove private names, paths and tokens from reports. Never include live credentials.

Author corrections should preserve original full credits. Do not assume a repository owner authored all its contents. New source directories must be optional and portable.

## Suggest a community build

Open an issue with the original public repository, repository owner, a short factual description, category and two things people can explore. Entries live in `dashboard/community.json`. Verify the primary source, update `checked_on` when the collection is reviewed, and keep claims brief. Do not add tracking links, private posts, scraped personal data, invented ratings or unverified installation promises. The showcase is curated, not a live feed or an endorsement.
