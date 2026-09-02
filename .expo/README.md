> Why do I have a folder named ".expo" in my project?

The ".expo" folder is created when an Expo project is started using `expo start`. It stores local, machine-specific state used by the Expo CLI and development builds.

> What do the files contain?

- `devices.json`: Information about devices that have recently opened this project (used to populate the "Development sessions" list in development builds).
- `settings.json`: Server and development settings used to serve your application manifest and configure the development server.
- Other runtime/state files: The folder may also contain ephemeral files created by the Expo CLI or development tools.

> Should I commit the ".expo" folder?

No — you should not commit or share the ".expo" folder. It is specific to your machine and developer environment and does not contain project source code or configuration needed by other contributors. On project creation, the ".expo" folder is typically added to `.gitignore` by default.

Best practices and notes
- Keep `.expo` listed in `.gitignore`. If it's not already ignored, add the following to your `.gitignore`:
  ```
  .expo/
  ```
- Committing `.expo` can leak local device/session information and cause merge noise. Only commit files from `.expo` if you have an explicit, project-wide reason and your team agrees.
- For sharing configuration that matters for all developers (e.g., Expo SDK versions, app.json/app.config.js settings), use the project files at the repository root (app.json / app.config.js), not files inside `.expo`.

Troubleshooting
- If you see stale device entries in the Expo Dev Client or "Development sessions" list, safely delete `.expo/devices.json` and restart the development server.
- If your development server settings are misbehaving, delete `.expo/settings.json` and re-run `expo start` to regenerate defaults.

If you're unsure whether a specific file in `.expo` needs to be kept, ask your team or open an issue in this repository before committing it.
