---
description: Import Trello cards as task documentation in the current repository
---

Import Trello cards and convert them to structured task documentation files.

## Instructions for Claude

When the user runs `/trello-import`, follow these steps:

### 1. Parse Parameters

Ask the user for any missing parameters:
- `board`: Board ID or name (if name, search boards to find ID)
- `list`: List name to filter by (e.g., "Ready for Development")
- `count`: Number of cards to import (default: 5)
- `label`: (Optional) Filter by label name

**Example:** `/trello-import board=abc123 list="Ready for Development" count=5`

### 2. Determine Output Directory

Check if `.agent-os/tasks/` exists:
- **If YES**: Use `.agent-os/tasks/trello/`
- **If NO**: Use `tasks/trello/` (create if needed)

Create the output directory if it doesn't exist.

### 3. Fetch Cards from Trello

Use the Trello MCP tools to:
1. If board is a name (not ID), use `list_boards` to find the board ID
2. Use `get_lists` to find the list ID from the list name
3. Use `list_cards` to get all cards from the board
4. Filter cards by the specified list name
5. Filter by label if specified
6. Limit to `count` cards
7. For each card, use `get_card` to get full details including comments

### 4. Create Task Files

For each card, create a markdown file with this format:

**Filename**: `CARD-{first-6-chars-of-id}-{slugified-name}.md`

**Content**:
```markdown
# {Card Name}

**Trello Card**: {shortUrl}
**List**: {list name}
**Labels**: {comma-separated label names}
**Members**: {comma-separated member names}
**Due Date**: {due date if exists, "None" otherwise}

## Description

{card description, or "(No description provided)" if empty}

## Acceptance Criteria

{If description contains bullet points or checklist items, extract them here}
{If no clear criteria, write: "See description above"}

## Comments

{List recent comments in this format:}
- **{author name}** ({date}): {comment text}

{If no comments: "(No comments)"}

## Checklist Progress

{If card has checklists:}
- {checkItemsChecked} of {checkItems} items completed

## Links

- [View on Trello]({shortUrl})
- Card ID: `{id}`

---
*Imported from Trello on {current date}*
```

### 5. Create Index File

Create/update `index.md` in the output directory:

```markdown
# Imported Trello Tasks

Last updated: {current date}

## Summary

- **Total tasks**: {count}
- **Board**: {board name}
- **List**: {list name}
- **Import date**: {current date}

## Tasks

{For each imported task:}
- [{card name}](CARD-{id}-{slug}.md) - {labels} - Due: {due date or "No due date"}

## Quick Links

{For each task:}
- [{card name}]({trello shortUrl})
```

### 6. Report Results

Show the user:
- ✅ Number of tasks imported
- 📁 Output directory used
- 📋 List of task files created
- 🔗 Trello board link

**Example output:**
```
✅ Imported 5 tasks from Trello

📁 Output directory: .agent-os/tasks/trello/

📋 Created task files:
  - CARD-abc123-implement-auth.md
  - CARD-def456-api-endpoint.md
  - CARD-ghi789-database-migration.md
  - CARD-jkl012-ui-component.md
  - CARD-mno345-unit-tests.md

📝 Index file: .agent-os/tasks/trello/index.md

🔗 Trello board: https://trello.com/b/...

You can now reference these tasks in your development work!
```

## Error Handling

- If board not found: Ask user to run `/trello-import` with `list_boards` first to see available boards
- If list not found: Show available lists from the board
- If no cards match: Inform user and suggest checking board/list name
- If Trello API fails: Show error and suggest checking MCP configuration

## Notes

- Task files are git-trackable markdown
- Cards stay linked to Trello via shortUrl
- Updates don't sync back to Trello automatically
- Re-running import will update existing task files
- Works with or without `.agent-os/` directory
