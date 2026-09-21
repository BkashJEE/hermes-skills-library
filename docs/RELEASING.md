# Release procedure

Releases are source releases for the independent Hermes Desktop plugin. They do not publish a package to npm or PyPI.

## 1. Prepare

1. Confirm the working tree is clean and based on the latest `main`.
2. Update the version in `package.json`, `package-lock.json` and `plugin.yaml`.
3. Add the release notes to `CHANGELOG.md`.
4. Update compatibility claims in `README.md`; list only platforms and Hermes revisions that were actually tested.
5. Review the diff for credentials, personal paths, generated bundles and private screenshots.

## 2. Validate

Run:

```bash
npm ci --ignore-scripts
npm run check
npm run test:community
npm run build:preview
python -m unittest test_installer test_stories
git diff --check
```

Run `test_library` with Hermes' repository on `PYTHONPATH` and its Python environment:

```bash
PYTHONPATH="$HOME/.hermes/hermes-agent" \
  "$HOME/.hermes/hermes-agent/venv/bin/python" \
  -m unittest test_installer test_library test_stories
```

For UI changes, inspect Skills, Plugins and Use Cases at desktop and narrow widths. Check keyboard focus, dialogs, empty states, category and author filters, and the browser console. Record the result in `design-qa.md`.

## 3. Verify installation

Use a disposable Hermes home or a non-critical profile first:

```bash
PYTHONPATH="$HOME/.hermes/hermes-agent" \
  "$HOME/.hermes/hermes-agent/venv/bin/python" \
  install.py --profile default --dry-run
```

Review the reported destinations and backups before the real install. Reopen Hermes Desktop and confirm the plugin version and core flows.

## 4. Publish

1. Merge the reviewed change to `main`.
2. Create an annotated `vX.Y.Z` tag at the tested commit.
3. Create a GitHub release from that tag using the matching changelog section.
4. Mark pre-1.0 releases as prereleases while compatibility is still limited.
5. Confirm the release tag, repository `main`, changelog and installed build point to the same commit.

If validation fails after publication, document the limitation, prepare a patch release and leave the affected release available with a clear warning unless it exposes users to an active security risk.
