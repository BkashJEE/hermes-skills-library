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

The optional preview binds to loopback and blocks writes. It exposes local catalog/profile information to a browser on your computer; do not proxy it onto the public Internet.

No telemetry, analytics endpoint or credential import is implemented by this library. Hermes and imported packages have their own networking behavior. Repository cloning can use credentials already configured in Git/Hermes.

Remote Hermes connections require the backend on the remote machine. The local installer does not configure remote hosts. Standalone desktop-only packages should use Hermes' built-in Desktop plugin installer.

To recover, disable this plugin and reopen Hermes. Installed skills and other plugins remain available through Hermes' built-in management screens. Preserve backups and compare config changes before restoring an older entire configuration over newer settings.
