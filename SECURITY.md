# Security policy

## Supported versions

This project is an early community release. Security fixes are provided for the latest `0.6.x` release. Older revisions may still work, but they do not receive security updates.

## Report a vulnerability privately

Use GitHub's **Security** tab and choose **Report a vulnerability**. Please do not open a public issue for a suspected vulnerability.

Include:

- the affected version or commit;
- the Hermes version and operating system;
- the security impact and who can trigger it;
- minimal reproduction steps or a proof of concept; and
- any suggested mitigation.

Remove live tokens, credentials, personal paths and private repository content. If a secret was exposed, revoke it before reporting.

The maintainer aims to acknowledge a report within seven days. A validated issue will be coordinated privately until a fix and disclosure plan are ready. There is currently no paid bug-bounty program.

## Security boundary

This library helps users discover and import skills and plugins. Imported plugins are executable code. Hermes' scanner and approval flow reduce risk, but they are not a sandbox or a guarantee of safety. Review a repository, its requested permissions and its dependencies before enabling it.

The read-only browser preview cannot install capabilities. The installed Desktop plugin can write only through the selected Hermes profile and the existing Hermes installation APIs described in [permissions and troubleshooting](docs/OPERATIONS.md).
