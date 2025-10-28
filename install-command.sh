#!/bin/bash
# Install trello-import slash command to a project

if [ -z "$1" ]; then
  echo "Usage: ./install-command.sh /path/to/project"
  echo ""
  echo "Example:"
  echo "  ./install-command.sh ~/projects/eagle-project"
  echo ""
  echo "Or install to current directory:"
  echo "  ./install-command.sh ."
  exit 1
fi

TARGET_DIR="$1"

if [ ! -d "$TARGET_DIR" ]; then
  echo "Error: Directory $TARGET_DIR does not exist"
  exit 1
fi

# Create .claude/commands directory if it doesn't exist
mkdir -p "$TARGET_DIR/.claude/commands"

# Copy the command
cp .claude/commands/trello-import.md "$TARGET_DIR/.claude/commands/"

echo "✅ Installed /trello-import command to $TARGET_DIR"
echo ""
echo "You can now use it in that project:"
echo "  cd $TARGET_DIR"
echo "  claude"
echo "  /trello-import board=abc123 list=\"Ready for Development\" count=5"
