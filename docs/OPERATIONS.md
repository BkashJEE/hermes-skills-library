# Permissions, failure modes and recovery

| Operation | Access | Common failure / recovery |
| --- | --- | --- |
| Browse local skills | Reads SKILL.md metadata in configured directories | Missing source folder is skipped; check sources.local.json and refresh. |
| Browse profiles and plugins | Reads Hermes profiles, installed manifests and public catalog metadata | API changes or missing backend can fail loading. Check Hermes revision, local connection and backend enable state; reopen Desktop. |
| Hub search | Contacts Hermes-supported skill indexes | Offline, throttled or partial results can occur. Retry or use local entries. |
| Install a skill | Downloads or copies resources, scans/quarantines them, writes selected profile's skills and install records | Scanner rejection, duplicate name, unsupported OS, or missing runtime setup. Review the message; there is no force-overwrite button. |
| Import a plugin | Hermes clones a repository and writes plugin/install metadata for the selected profile | Bad repository, missing Git/authentication, incompatible manifest or duplicate. Correct the input. Imported plugins start disabled. |
| Enable/disable | Updates the selected profile's configuration | Missing environment variables or dependencies may prevent use. Reopen Hermes for plugin changes; use new conversations for skills. |
| Install/update this library | Writes the shared Desktop/backend plugin pair and explicitly selected profile configurations; backs up prior state | Run --dry-run first. Unsupported config shape is rejected. Restore files from the printed backup if needed. |

This plugin does not add a per-plugin permission sandbox. The permissions a third-party package needs may be absent or incomplete in its metadata. Catalog/scanner checks reduce some risks but do not establish that code is safe. Review a package before enabling it. Full failure-mode and permission declarations on every card are not implemented in this release.

The optional preview binds to loopback and blocks installation/configuration writes; Use Cases refresh may update its local public-metadata cache. It exposes local catalog/profile information to a browser on your computer; do not proxy it onto the public Internet.

No telemetry, analytics endpoint or credential import is implemented by this library. Hermes and imported packages have their own networking behavior. Repository cloning can use credentials already configured in Git/Hermes.

Remote Hermes connections require the backend on the remote machine. The local installer does not configure remote hosts. Standalone desktop-only packages should use Hermes' built-in Desktop plugin installer.

To recover, disable this plugin and reopen Hermes. Installed skills and other plugins remain available through Hermes' built-in management screens. Preserve backups and compare config changes before restoring an older entire configuration over newer settings.

The Use Cases tab serves a bundled snapshot of the official Nous documentation’s user stories without reading profiles or contacting project sites. External links open only when clicked (through the Desktop SDK on supported hosts, normal links in the browser preview). Clicking Refresh contacts the fixed official Nous GitHub commit API and downloads its story metadata from that immutable revision. It does not fetch individual posts or use a GitHub token. Requests have timeouts and size limits; invalid or failed updates keep the previous collection. Successful metadata is saved atomically under `$HERMES_HOME/cache/hermes-skills-library/user-stories.json` (default `~/.hermes/cache/hermes-skills-library/user-stories.json`). Reopening reads that cache without contacting Nous. New installs and unavailable/corrupt caches fall back to the bundled snapshot. GitHub rate limits or network outages can prevent a refresh; retry later. The preview allows this catalog refresh while continuing to block installation writes. Inclusion does not establish installability or compatibility.

Community ships inside the Desktop entry as of 0.4.1; it does not wait on a backend route. If upgrading from 0.4.0, reload the Desktop plugin or reopen Desktop to load the new JavaScript. The public `/community` backend route remains available for consumers.

### Build previews

Hovering or focusing Preview opens a non-modal preview using the Desktop SDK popover. Brief story excerpts load lazily from the fixed official dataset revision, are held in memory, and are never saved as full quotations. Preview requests accept only an ID from the current collection, never a caller-provided URL. YouTube thumbnails load directly from `i.ytimg.com` only when a preview opens, with no referrer. There are no embedded players, autoplay, external page scraping or generated screenshots. Missing content falls back to the original-story link. Escape, close, pointer exit and scrolling outside the preview dismiss it; clicking Preview retains the details dialog on mouse and touch devices.

Recreate uses Hermes Desktop's selected Agent and active workspace to create a normal visible chat, then submits a structured setup request. The request requires read-only inspection first, explains that the source story is inspiration rather than verified instructions, asks the Agent to distinguish a close recreation from an adaptation, and requires the Agent to disclose tools, permissions, credentials, costs, failure modes and recovery steps. The Agent must wait for approval before installs, file or configuration changes, credential use, or external actions. Browser preview mode shows the explanation but does not create or submit a Hermes chat. Desktop versions without the required routed-session SDK return an update message instead of falling back to an unsafe or incomplete launch.
