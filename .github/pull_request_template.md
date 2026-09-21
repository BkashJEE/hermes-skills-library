## What changed

Describe the user-visible problem and resulting behavior.

## Scope

- [ ] The change stays within this plugin and does not modify core Hermes files.
- [ ] Profile isolation and explicit destination selection are preserved.
- [ ] New external data has clear provenance and attribution.

## Validation

- [ ] `npm run check`
- [ ] `npm run test:community`
- [ ] `npm run build:preview`
- [ ] `python -m unittest test_installer test_stories`
- [ ] Hermes-backed `test_library`, or an explanation below when unavailable
- [ ] UI review for affected desktop and narrow layouts

## Security and privacy

- [ ] No credentials, private content, personal paths or generated preview bundles are included.
- [ ] New permissions, network requests and failure modes are documented.

## Notes for reviewers

List compatibility limits, skipped checks or follow-up work.
