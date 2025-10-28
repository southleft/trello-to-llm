# Team Setup Guide - Trello MCP Server

Quick setup instructions for team members to get the Trello integration working with Claude Code.

## Prerequisites

- Node.js 18+ installed
- Claude Code installed
- Access to your team's Trello boards

## Setup Steps (5 minutes)

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

### 4. Configure Claude Code

**macOS/Linux:**
Edit `~/.config/claude/claude_desktop_config.json`

**Windows:**
Edit `%APPDATA%\Claude\claude_desktop_config.json`

Add this configuration (create the file if it doesn't exist):

```json
{
  "mcpServers": {
    "trello": {
      "command": "node",
      "args": ["/REPLACE/WITH/FULL/PATH/TO/trello-mcp-server/dist/index.js"],
      "env": {
        "TRELLO_API_KEY": "paste_your_api_key_here",
        "TRELLO_API_TOKEN": "paste_your_token_here"
      }
    }
  }
}
```

**Important:**
- Replace `/REPLACE/WITH/FULL/PATH/TO/` with the actual absolute path
- To get the full path, run `pwd` in the project directory on Mac/Linux or `cd` on Windows
- Replace the API key and token with your actual credentials

### 5. Restart Claude Code

Completely close and reopen Claude Code.

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

## Common Issues

### "Command not found" or "Cannot find module"

- Check that the path in `claude_desktop_config.json` is absolute (not relative)
- Make sure you ran `npm run build`
- Verify the path ends with `/dist/index.js`

### "TRELLO_API_KEY and TRELLO_API_TOKEN must be set"

- Double-check your credentials in `claude_desktop_config.json`
- Make sure there are no extra spaces in the JSON
- Verify the JSON is valid (no missing commas or brackets)

### Tools not appearing in Claude Code

- Restart Claude Code completely
- Check the Claude Code logs for errors
- Verify the `mcpServers` section is properly formatted

### "Unauthorized" or API errors

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

## Tips

- **Board IDs**: Save frequently-used board IDs in your notes
- **Card IDs**: You can use Trello short URLs instead of long IDs
- **Natural Language**: Just talk naturally - Claude will figure out which tools to use
- **Batch Operations**: You can ask Claude to perform multiple operations at once

Enjoy your enhanced development workflow! 🚀
