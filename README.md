# Trello MCP Server

A Model Context Protocol (MCP) server that integrates Trello with Claude Code, allowing you to pull tickets, view details, and update card status directly from your AI-powered development environment.

## Features

### MCP Tools
- **List Boards**: View all accessible Trello boards
- **List Cards**: See all cards from a specific board, organized by list
- **Get Card Details**: Pull complete card information including description, comments, members, labels, attachments, and checklist progress
- **Update Cards**: Move cards between lists, update names, descriptions, and due dates
- **Add Comments**: Post comments to cards directly from Claude Code
- **Get Lists**: Retrieve all lists from a board to facilitate card movement

### Slash Command
- **Import Cards as Tasks**: `/trello-import` - Automatically fetch Trello cards and convert them to structured task documentation in your repository (works with or without `.agent-os/`)

## Installation

### 1. Clone and Build

```bash
git clone <your-repo-url> trello-mcp-server
cd trello-mcp-server
npm install
npm run build
```

### 2. Get Trello API Credentials

1. Get your API key from: https://trello.com/app-key
2. Generate an API token by visiting this URL (replace `YOUR_API_KEY` with your actual key):
   ```
   https://trello.com/1/authorize?expiration=never&name=TrelloMCPServer&scope=read,write&response_type=token&key=YOUR_API_KEY
   ```

### 3. Add MCP Server to Claude

Choose the appropriate method based on which Claude application you're using:

#### **For Claude Code CLI** (Recommended)

Run this command from anywhere (replace the credentials with your actual values):

```bash
claude mcp add --scope user --transport stdio trello \
  -e TRELLO_API_KEY=your_api_key_here \
  -e TRELLO_API_TOKEN=your_api_token_here \
  -- node /absolute/path/to/trello-mcp-server/dist/index.js
```

**Important**: Replace `/absolute/path/to/trello-mcp-server` with the actual full path (run `pwd` in the project directory to get it).

**Verify it worked**:
```bash
claude mcp list
```

You should see: `trello: node /path/to/dist/index.js - ✓ Connected`

#### **For Claude Desktop App**

Add the server to your Claude Desktop configuration file:

**macOS**: `~/.config/claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "trello": {
      "command": "node",
      "args": ["/absolute/path/to/trello-mcp-server/dist/index.js"],
      "env": {
        "TRELLO_API_KEY": "your_api_key_here",
        "TRELLO_API_TOKEN": "your_api_token_here"
      }
    }
  }
}
```

**Note**: Replace `/absolute/path/to/trello-mcp-server` with the actual full path to your installation.

### 4. Restart Claude

**Claude Code CLI**: Start a new session
**Claude Desktop**: Completely close and reopen the app

## Usage

Once configured, you can use the Trello tools directly in your Claude Code conversations:

### Example Workflow

```
User: Show me all my Trello boards
Claude: [Uses list_boards tool to show all boards]

User: List all cards from the "Development" board (ID: 60a1b2c3d4e5f6g7h8i9j0k1)
Claude: [Uses list_cards tool to show all cards organized by list]

User: Get details on card abc123
Claude: [Uses get_card tool to show full card details including description, comments, etc.]

User: Move this card to the "In Progress" list
Claude: [Uses get_lists to find the list ID, then update_card to move it]

User: Add a comment saying "Started working on this"
Claude: [Uses add_comment to post the comment]
```

## Available Tools

### `list_boards`
Lists all Trello boards accessible to the authenticated user.

**Parameters**: None

**Example**:
```
User: What Trello boards do I have access to?
```

### `list_cards`
Lists all cards from a specific board, organized by list.

**Parameters**:
- `boardId` (required): The ID of the Trello board

**Example**:
```
User: Show me all cards from board abc123
```

### `get_card`
Gets detailed information about a specific card.

**Parameters**:
- `cardId` (required): The ID or short URL of the card

**Example**:
```
User: Get details on card xyz789
```

### `get_lists`
Gets all lists from a board (useful for moving cards).

**Parameters**:
- `boardId` (required): The ID of the Trello board

**Example**:
```
User: What lists are in board abc123?
```

### `update_card`
Updates a card's properties (move to different list, update name, description, due date, etc.).

**Parameters**:
- `cardId` (required): The ID of the card
- `name` (optional): New card name
- `description` (optional): New card description
- `listId` (optional): ID of the list to move the card to
- `dueDate` (optional): Due date in ISO format
- `dueComplete` (optional): Whether the due date is complete

**Example**:
```
User: Move card xyz789 to the "Done" list
```

### `add_comment`
Adds a comment to a card.

**Parameters**:
- `cardId` (required): The ID of the card
- `comment` (required): The comment text

**Example**:
```
User: Add a comment to card xyz789 saying "Completed testing"
```

## Slash Command: `/trello-import`

The `/trello-import` command automatically imports Trello cards as structured task documentation in your repository.

### Setup

Copy the `.claude/commands/` directory from this repo to your project:

```bash
# From the trello-mcp-server directory
cp -r .claude /path/to/your/project/
```

Or manually create `.claude/commands/trello-import.md` in your project (see `.claude/commands/trello-import.md` in this repo).

### Usage

```bash
/trello-import board=<board-id> list="<list-name>" count=<number>
```

**Parameters**:
- `board`: Board ID or name
- `list`: List name to filter by (e.g., "Ready for Development")
- `count`: Number of cards to import (default: 5)
- `label`: (Optional) Filter by label name

**Examples**:
```bash
# Import 5 cards from "Ready for Development" list
/trello-import board=abc123 list="Ready for Development" count=5

# Import 3 high-priority cards
/trello-import board=my-board list="Backlog" label="high-priority" count=3
```

### Output Structure

The command creates task files in your repository:

**With `.agent-os/` (agentos)**:
```
.agent-os/
  tasks/
    trello/
      index.md                          # Summary of all tasks
      CARD-abc123-implement-auth.md     # Individual task files
      CARD-def456-api-endpoint.md
```

**Without `.agent-os/`**:
```
tasks/
  trello/
    index.md
    CARD-abc123-implement-auth.md
    CARD-def456-api-endpoint.md
```

### Task File Format

Each imported task includes:
- Card title and Trello link
- Current list, labels, and assigned members
- Full description and acceptance criteria
- Recent comments from team members
- Checklist progress
- Import timestamp

**Example task file**:
```markdown
# Implement User Authentication

**Trello Card**: https://trello.com/c/abc123
**List**: Ready for Development
**Labels**: backend, high-priority
**Members**: @jane, @john
**Due Date**: 2025-11-15

## Description

Implement JWT-based authentication for the API...

## Acceptance Criteria

- [ ] Users can register with email/password
- [ ] JWT tokens are issued on login
- [ ] Protected endpoints verify tokens

## Comments

- **Jane Doe** (2025-10-20): We should use bcrypt for hashing
- **John Smith** (2025-10-21): Agreed, also add rate limiting

## Links

- [View on Trello](https://trello.com/c/abc123)
- Card ID: `abc123`

---
*Imported from Trello on 2025-10-28*
```

### Benefits

✅ **Context for Claude**: Claude can reference task details during development
✅ **Git-tracked**: Task documentation lives alongside your code
✅ **Team visibility**: Everyone can see imported tasks
✅ **Trello-linked**: Easy navigation back to original cards
✅ **Portable**: Works with or without `.agent-os/`

### Workflow Example

```bash
# In your project directory
cd ~/my-project
claude

# Import tasks
/trello-import board=my-board list="Ready for Development" count=5

# Claude creates task files and shows summary

# Start working on a task
User: Let's implement the authentication task
Claude: [Reads .agent-os/tasks/trello/CARD-abc123-implement-auth.md]
       I see this task requires JWT authentication with these acceptance criteria...
       Let me start by creating the auth service...
```

## Team Distribution

To share this with your team:

### Option 1: Git Repository (Recommended)

1. Push this project to a shared Git repository
2. Team members clone the repo
3. Each team member:
   - Runs `npm install && npm run build`
   - Gets their own Trello API credentials
   - **For Claude Code CLI**: Runs the `claude mcp add` command with their credentials
   - **For Claude Desktop**: Updates their `claude_desktop_config.json` with the path and their credentials

### Option 2: NPM Package

1. Publish to npm (private or public):
   ```bash
   npm publish
   ```

2. Team members install globally:
   ```bash
   npm install -g trello-mcp-server
   ```

3. **For Claude Code CLI**:
   ```bash
   claude mcp add --scope user --transport stdio trello \
     -e TRELLO_API_KEY=your_key \
     -e TRELLO_API_TOKEN=your_token \
     -- trello-mcp-server
   ```

4. **For Claude Desktop**, update `claude_desktop_config.json`:
   ```json
   {
     "mcpServers": {
       "trello": {
         "command": "trello-mcp-server",
         "env": {
           "TRELLO_API_KEY": "your_api_key_here",
           "TRELLO_API_TOKEN": "your_api_token_here"
         }
       }
     }
   }
   ```

## Development Workflow Examples

### Starting Work on a Ticket

```
User: Show me all cards in the "To Do" list from our Sprint board
Claude: [Lists all To Do cards]

User: I want to work on card #5 - "Implement user authentication"
Claude: [Gets card details, shows acceptance criteria, comments, and attached specs]

User: Move this card to "In Progress" and add a comment that I'm starting work
Claude: [Updates card status and adds comment]
```

### During Development

```
User: What were the acceptance criteria for the card I'm working on?
Claude: [Retrieves card details and shows the description/checklist]
```

### Completing Work

```
User: Move the authentication card to "Code Review" and add a comment with the PR link
Claude: [Updates status and adds comment]
```

## Expanding the Workflow

Here are ideas to enhance this further:

### 1. Auto-Branch Creation
Create a slash command that generates branch names from Trello card IDs:
```bash
# .claude/commands/trello-branch.md
Create a git branch based on the Trello card: ${card_id}
Format: feature/CARD-{card-id}-{slugified-card-name}
```

### 2. PR Integration
Link GitHub PRs to Trello cards automatically by adding the Trello card URL to PR descriptions.

### 3. Time Tracking
Track time spent per card by logging when cards move to/from "In Progress".

### 4. Multi-Board Support
Extend to support multiple project boards with team-specific configurations.

### 5. Smart Card Selection
Use AI to recommend which card to work on next based on priority, due dates, and dependencies.

## Troubleshooting

### "TRELLO_API_KEY and TRELLO_API_TOKEN must be set"

**For Claude Code CLI**: Make sure you passed the credentials when running `claude mcp add` with the `-e` flags.

**For Claude Desktop**: Make sure the environment variables are properly set in `claude_desktop_config.json`.

### "Unknown tool: list_boards" or "No MCP servers configured"

**For Claude Code CLI**:
1. Run `claude mcp list` to verify the server is installed
2. If not listed, re-run the `claude mcp add` command
3. Start a fresh Claude Code session (MCP servers load at startup)

**For Claude Desktop**:
1. Check that the path in `claude_desktop_config.json` is correct and absolute
2. Restart Claude Desktop completely

### Check MCP Server Health

**For Claude Code CLI**: Run `claude doctor` to see server connection status and diagnose issues.

### API Rate Limits

Trello has rate limits (300 requests per 10 seconds per API key). The server doesn't currently implement rate limiting, so be mindful of excessive API calls.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.
