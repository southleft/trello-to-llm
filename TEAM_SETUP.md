# Team Setup Guide - Trello MCP Server

Quick setup instructions for team members to get the Trello integration working with Claude Code or Claude Desktop.

## Prerequisites

- Node.js 18+ installed
- Claude Code CLI or Claude Desktop installed
- Access to your team's Trello boards

## Choose Your Setup Path

- **Claude Code CLI** (Terminal-based): Follow the "Quick Setup" below
- **Claude Desktop** (Desktop app): Follow the "Desktop Setup" section

---

## Quick Setup for Claude Code CLI (5 minutes)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd trello-mcp-server
```

### 2. Install Dependencies

```bash
npm install
npm run build
```

### 3. Get Your Trello Credentials

**Get API Key:**
1. Visit: https://trello.com/app-key
2. Copy your API Key

**Generate Token:**
1. Replace `YOUR_API_KEY` in the URL below with your actual API key:
   ```
   https://trello.com/1/authorize?expiration=never&name=TrelloMCPServer&scope=read,write&response_type=token&key=YOUR_API_KEY
   ```
2. Visit that URL in your browser
3. Click "Allow" to authorize the application
4. Copy the token that appears

### 4. Add to Claude Code

Run this command from anywhere (replace with your actual credentials and path):

```bash
claude mcp add --scope user --transport stdio trello \
  -e TRELLO_API_KEY=paste_your_api_key_here \
  -e TRELLO_API_TOKEN=paste_your_token_here \
  -- node /FULL/PATH/TO/trello-mcp-server/dist/index.js
```

**Get the full path**: Run `pwd` while in the `trello-mcp-server` directory.

**Verify it worked**:
```bash
claude mcp list
```

You should see: `trello: node /path/to/dist/index.js - ✓ Connected`

### 5. Start a New Session

Start a fresh Claude Code session to load the MCP server.

## Verify It's Working

Open Claude Code and try these commands:

1. **List your boards:**
   ```
   Show me all my Trello boards
   ```

2. **List cards from a board:**
   ```
   Show me all cards from board <board-id>
   ```
   (Use a board ID from the previous command)

3. **Get card details:**
   ```
   Get details on card <card-id>
   ```

If you see Trello data, you're all set! 🎉

---

## Desktop Setup for Claude Desktop (5 minutes)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd trello-mcp-server
```

### 2. Install Dependencies

```bash
npm install
npm run build
```

### 3. Get Your Trello Credentials

Follow the same steps as above (Step 3 in Quick Setup)

### 4. Configure Claude Desktop

**macOS**: Edit `~/.config/claude/claude_desktop_config.json`
**Windows**: Edit `%APPDATA%\Claude\claude_desktop_config.json`

Add this configuration (create the file if it doesn't exist):

```json
{
  "mcpServers": {
    "trello": {
      "command": "node",
      "args": ["/FULL/PATH/TO/trello-mcp-server/dist/index.js"],
      "env": {
        "TRELLO_API_KEY": "paste_your_api_key_here",
        "TRELLO_API_TOKEN": "paste_your_token_here"
      }
    }
  }
}
```

**Important**: Replace `/FULL/PATH/TO/` with the actual absolute path (run `pwd` in the project directory).

### 5. Restart Claude Desktop

Completely close and reopen the Claude Desktop app.

---

## Common Issues

### For Claude Code CLI

**Server not listed**:
```bash
claude mcp list
```
If not shown, re-run the `claude mcp add` command.

**Check health**:
```bash
claude doctor
```

### For Both Claude Code CLI and Desktop

**"Command not found" or "Cannot find module"**:
- Check that the path is absolute (not relative)
- Make sure you ran `npm run build`
- Verify the path ends with `/dist/index.js`

**"TRELLO_API_KEY and TRELLO_API_TOKEN must be set"**:
- **Claude Code CLI**: Verify you passed credentials with `-e` flags
- **Claude Desktop**: Check credentials in `claude_desktop_config.json`
- Make sure there are no extra spaces

**Tools not appearing**:
- **Claude Code CLI**: Start a fresh session (MCP servers load at startup)
- **Claude Desktop**: Completely restart the app
- Run `claude doctor` (CLI) or check logs (Desktop)

**"Unauthorized" or API errors**:
- Regenerate your Trello token (they can expire)
- Make sure you clicked "Allow" when authorizing

## Getting Help

If you run into issues:
1. Check this troubleshooting section
2. Look at the main README.md for more details
3. Ask in the team chat or create an issue in the repo

## Example Workflows

### Starting a Task

```
User: List cards from our Sprint board (abc123)
Claude: [Shows all cards]

User: I'll work on card xyz789 - show me the details
Claude: [Shows full card with description, acceptance criteria, comments]

User: Move it to "In Progress" and add a comment "Starting work"
Claude: [Updates the card]
```

### Quick Status Check

```
User: What cards are in the "In Progress" column?
Claude: [Filters and shows in-progress cards]
```

### Completing Work

```
User: Move card xyz789 to "Done" and mark the due date complete
Claude: [Updates card status]
```

## Bonus: Import Tasks with `/trello-import`

After setting up, you can import Trello cards as task files in your project:

```bash
# Copy the .claude/commands directory to your project
cp -r /path/to/trello-mcp-server/.claude /path/to/your/project/

# Then in your project
/trello-import board=abc123 list="Ready for Development" count=5
```

This creates structured task files in `.agent-os/tasks/trello/` (or `tasks/trello/` if no `.agent-os/`).

**See README.md** for full `/trello-import` documentation.

## Tips

- **Board IDs**: Save frequently-used board IDs in your notes
- **Card IDs**: You can use Trello short URLs instead of long IDs
- **Natural Language**: Just talk naturally - Claude will figure out which tools to use
- **Batch Operations**: You can ask Claude to perform multiple operations at once
- **Task Import**: Use `/trello-import` to pull tickets into your repo for context

Enjoy your enhanced development workflow! 🚀
