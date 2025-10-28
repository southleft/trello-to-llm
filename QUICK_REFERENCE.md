# Trello MCP Server - Quick Reference

## Common Claude Code Prompts

### View Boards & Cards

```
Show me all my Trello boards
```

```
List all cards from board [board-id]
```

```
What cards are in the "To Do" list?
```

### Work on a Specific Card

```
Get details on card [card-id]
```

```
Show me the description and comments for card [card-id]
```

### Update Cards

```
Move card [card-id] to "In Progress"
```

```
Update card [card-id] description to "Updated description here"
```

```
Mark card [card-id] as complete and move to Done
```

### Add Comments

```
Add a comment to card [card-id]: "Started working on this feature"
```

```
Comment on card [card-id] with the PR link: github.com/...
```

### Multi-Step Workflows

```
I want to start working on ticket [card-id]. Show me the details,
move it to In Progress, and add a comment that I'm starting work.
```

```
Find all cards in To Do, show me which ones are high priority,
and I'll pick one to work on.
```

## Finding IDs

### Board ID
- Ask: "Show me all my Trello boards"
- The ID will be in the response

### Card ID
- From the card URL: `https://trello.com/c/abc123/card-name` → ID is `abc123`
- Ask Claude to list cards and the IDs will be shown

### List ID
- Ask: "Get all lists from board [board-id]"
- The list IDs will be in the response

## Advanced Workflows

### Daily Standup Prep
```
Show me all cards assigned to me across all boards
```

### Sprint Planning
```
List all cards from the Sprint board grouped by status
```

### Code Review Process
```
Move card [card-id] to "Code Review" and add a comment with
PR link [github-url]
```

### Bug Triage
```
Find all cards with label "bug" in the Backlog board
```

## Automation Ideas

You can ask Claude to perform complex workflows like:

- "At the end of each day, summarize cards I worked on"
- "Create a git branch name based on this card's title"
- "Check if there are any overdue cards assigned to me"
- "Find cards that are blocked and need attention"

## Tips

1. **Be Natural**: You don't need to remember exact commands - just ask naturally
2. **Chain Operations**: Ask Claude to do multiple things at once
3. **Context Aware**: Claude remembers the conversation, so you can refer to "this card" or "the previous board"
4. **Save Common Board IDs**: Keep frequently-used board IDs handy

## Examples from Real Usage

**Starting Your Day:**
```
User: What should I work on today from our Sprint board?
Claude: [Lists cards, suggests priorities]
User: I'll take the authentication task
Claude: [Shows details]
User: Move it to In Progress
Claude: [Updates status]
```

**During Development:**
```
User: What were the acceptance criteria again?
Claude: [Shows card description]
```

**Code Review:**
```
User: This is ready for review - move to Code Review and
add comment with PR link github.com/org/repo/pull/123
Claude: [Updates card and adds comment]
```

**End of Day:**
```
User: What did I work on today?
Claude: [Shows cards you moved or commented on]
```

## Need Help?

- Full docs: See README.md
- Setup issues: See TEAM_SETUP.md
- Can't find a feature: Just ask Claude - it might already be possible!
