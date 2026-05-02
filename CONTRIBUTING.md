# Contributing

Engineering practices for this project. Both the author and any AI assistants helping with this codebase should follow these conventions. For the *what to build* and *what not to build* rules, see `AGENTS.md` — this document covers *how* changes get committed and reviewed.

## Before You Commit

- Confirm the change is in scope for the **current version** (see `AGENTS.md` — v1 ships before v2 work begins).
- Don't commit `.env` or `.env.local`. If a new env var is needed, add it to `.env.example` in the same commit.
- If the change relies on a new or modified backend route, plan a matching PR in `../flowlist-api`.

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) spec: `<type>(<scope>): <short description>`

### Common types

- `feat` — new feature
- `fix` — bug fix
- `chore` — maintenance, config, tooling
- `docs` — documentation only
- `refactor` — code change that isn't a fix or feature
- `test` — adding or updating tests
- `style` — formatting, no logic change

### Scopes (typical)

`schedule`, `auth`, `bookings`, `config`, `styles`, `deps`, `readme`. Use the lowercase area of the UI the change touches; if it touches several, drop the scope.

### Examples

- `feat(schedule): render upcoming classes from /api/classes`
- `feat(schedule): add empty-state message when no classes are upcoming`
- `fix(schedule): convert starts_at to user's local time zone`
- `fix(config): read API base URL from VITE_API_URL instead of hard-coded localhost`
- `chore(deps): upgrade vite to 5.4.0`
- `docs(readme): document VITE_API_URL setup`
- `refactor(schedule): extract ClassCard into its own component`
- `style(schedule): align class metadata column widths`

### Rules

- Keep the subject line under 72 characters.
- Use the imperative mood — "add", not "added" or "adds".
- Lowercase after the colon.
- No period at the end.

This follows the Conventional Commits spec, which is the most common standard in professional projects.

## Pull Request Description Format

When opening a pull request, use the following format:

```md
## Summary
Briefly explain what this pull request does.

## Changes
- List the main changes made in this PR
- Keep each bullet short and specific
- Focus on what changed, not every tiny implementation detail

## Testing
- Explain how the change was tested
- If no tests were run, explain why
```

### Example

```md
## Summary
Replaces the default Vite scaffold with the v1 schedule page.

## Changes
- Removes starter content from src/App.tsx
- Adds fetch to GET /api/classes via VITE_API_URL
- Renders each class with name, instructor, local-time start, and duration
- Adds basic loading and error states

## Testing
- Visual verification: opened the page, confirmed three classes from Supabase
- Confirmed start times display in the local zone, not UTC
```

## Code Comment Guidelines

1. Comment **why**, not just **what**.
2. Use comments only for **non-obvious logic**, not every simple line.
3. Prefer **short comments above a block** instead of line-by-line narration.
4. Keep comments **brief, specific, and direct**.
5. Use comments to explain **flow, intent, business rules, or edge cases** (e.g. why a fetch uses `credentials: "include"`, why a date is formatted with `toLocaleString` instead of a library).
6. Avoid comments that simply **repeat the code**.
7. Prefer **clear component and variable names** before adding extra comments.
8. Use comments to explain **important assumptions** and **security-sensitive behavior**.
9. Remove or tighten **temporary learning comments** before finishing the file.
10. Keep comment style **consistent** across the project.
11. Update comments whenever the code changes so they do not go stale.
12. When a section needs too much explanation, consider **extracting a helper component or function** instead of adding more comments.
