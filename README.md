# Project Links

A small Claude Code mod that helps Cooper's six Claude projects work together.

- Every session gets the same short project map: what each project does and which kinds of work go where.
- When work belongs to another project, Claude adds a row to the shared "Claude handoffs" Google Sheet and says so in one line.
- Each project checks that Sheet only during scheduled runs or when asked, so it costs very little.
- `/projects` shows the map, the routes and a link to the Sheet.

To change a project or route, edit `PROJECTS` or `ROUTES` in `hooks/register.ts`.

## Install

```
/plugin marketplace add simscooper14-droid/claude-project-links
/plugin install project-links@claude-project-links
```
