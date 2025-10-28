# Changelog

All notable changes to the Trello MCP Server will be documented in this file.

## [1.0.0] - 2025-10-28

### Initial Release

#### Features
- **Board Management**
  - List all accessible Trello boards
  - Get board details

- **Card Operations**
  - List all cards from a board with full metadata
  - Get detailed card information including:
    - Description
    - Comments
    - Members
    - Labels
    - Due dates
    - Attachment counts
    - Checklist progress
  - Update card properties:
    - Name
    - Description
    - List assignment (move between lists)
    - Due date
    - Due date completion status
  - Add comments to cards

- **List Management**
  - Get all lists from a board
  - Filter active/closed lists

- **MCP Integration**
  - Full Model Context Protocol compliance
  - Stdio transport for Claude Code integration
  - Resource endpoints for board data
  - Tool-based interactions with comprehensive schemas

#### Documentation
- Comprehensive README with setup and usage instructions
- Team setup guide for easy onboarding
- Quick reference guide for common operations
- Roadmap for future enhancements
- TypeScript definitions for all API types

#### Developer Experience
- TypeScript implementation with strict typing
- No `any` types (following engineering principles)
- Zod schema validation for all inputs
- Proper error handling and validation
- Build system with source maps

#### Configuration
- Environment-based authentication
- Support for both .env files and Claude config
- Example configuration files included

---

## Future Releases

See [ROADMAP.md](ROADMAP.md) for planned features and enhancements.
