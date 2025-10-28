#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import dotenv from 'dotenv';
import { TrelloClient } from './trello-client.js';

dotenv.config();

// Validate required environment variables
const TRELLO_API_KEY = process.env.TRELLO_API_KEY;
const TRELLO_API_TOKEN = process.env.TRELLO_API_TOKEN;

if (!TRELLO_API_KEY || !TRELLO_API_TOKEN) {
  console.error('Error: TRELLO_API_KEY and TRELLO_API_TOKEN must be set in environment variables');
  process.exit(1);
}

// Initialize Trello client
const trelloClient = new TrelloClient(TRELLO_API_KEY, TRELLO_API_TOKEN);

// Create MCP server
const server = new Server(
  {
    name: 'trello-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Tool input schemas
const ListBoardsSchema = z.object({});

const ListCardsSchema = z.object({
  boardId: z.string().describe('The ID of the Trello board'),
});

const GetCardSchema = z.object({
  cardId: z.string().describe('The ID or short URL of the Trello card'),
});

const UpdateCardSchema = z.object({
  cardId: z.string().describe('The ID of the Trello card'),
  name: z.string().optional().describe('New name for the card'),
  description: z.string().optional().describe('New description for the card'),
  listId: z.string().optional().describe('ID of the list to move the card to'),
  dueDate: z.string().optional().describe('Due date in ISO format (or null to remove)'),
  dueComplete: z.boolean().optional().describe('Whether the due date is complete'),
});

const AddCommentSchema = z.object({
  cardId: z.string().describe('The ID of the Trello card'),
  comment: z.string().describe('The comment text to add'),
});

const GetListsSchema = z.object({
  boardId: z.string().describe('The ID of the Trello board'),
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_boards',
        description: 'List all Trello boards accessible to the authenticated user',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'list_cards',
        description: 'List all cards from a specific Trello board',
        inputSchema: {
          type: 'object',
          properties: {
            boardId: {
              type: 'string',
              description: 'The ID of the Trello board',
            },
          },
          required: ['boardId'],
        },
      },
      {
        name: 'get_card',
        description: 'Get detailed information about a specific Trello card, including description, comments, members, labels, and attachments',
        inputSchema: {
          type: 'object',
          properties: {
            cardId: {
              type: 'string',
              description: 'The ID or short URL of the Trello card',
            },
          },
          required: ['cardId'],
        },
      },
      {
        name: 'get_lists',
        description: 'Get all lists from a Trello board (useful for moving cards between lists)',
        inputSchema: {
          type: 'object',
          properties: {
            boardId: {
              type: 'string',
              description: 'The ID of the Trello board',
            },
          },
          required: ['boardId'],
        },
      },
      {
        name: 'update_card',
        description: 'Update a Trello card (move to different list, update name, description, due date, etc.)',
        inputSchema: {
          type: 'object',
          properties: {
            cardId: {
              type: 'string',
              description: 'The ID of the Trello card',
            },
            name: {
              type: 'string',
              description: 'New name for the card',
            },
            description: {
              type: 'string',
              description: 'New description for the card',
            },
            listId: {
              type: 'string',
              description: 'ID of the list to move the card to',
            },
            dueDate: {
              type: 'string',
              description: 'Due date in ISO format',
            },
            dueComplete: {
              type: 'boolean',
              description: 'Whether the due date is complete',
            },
          },
          required: ['cardId'],
        },
      },
      {
        name: 'add_comment',
        description: 'Add a comment to a Trello card',
        inputSchema: {
          type: 'object',
          properties: {
            cardId: {
              type: 'string',
              description: 'The ID of the Trello card',
            },
            comment: {
              type: 'string',
              description: 'The comment text to add',
            },
          },
          required: ['cardId', 'comment'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_boards': {
        const boards = await trelloClient.getBoards();
        const boardsList = boards
          .filter(board => !board.closed)
          .map(board => `- ${board.name} (ID: ${board.id})\n  URL: ${board.shortUrl}`)
          .join('\n');

        return {
          content: [
            {
              type: 'text',
              text: `Found ${boards.filter(b => !b.closed).length} active boards:\n\n${boardsList}`,
            },
          ],
        };
      }

      case 'list_cards': {
        const validated = ListCardsSchema.parse(args);
        const [cards, lists, board] = await Promise.all([
          trelloClient.getCards(validated.boardId),
          trelloClient.getLists(validated.boardId),
          trelloClient.getBoard(validated.boardId),
        ]);

        const listMap = new Map(lists.map(list => [list.id, list.name]));

        const cardsList = cards.map(card => {
          const listName = listMap.get(card.idList) || 'Unknown List';
          const labels = card.labels.map(l => l.name).filter(Boolean).join(', ');
          const members = card.members.map(m => m.fullName).join(', ');

          return `- [${listName}] ${card.name}
  ID: ${card.id}
  URL: ${card.shortUrl}
  ${labels ? `Labels: ${labels}` : ''}
  ${members ? `Members: ${members}` : ''}
  ${card.due ? `Due: ${new Date(card.due).toLocaleDateString()}${card.dueComplete ? ' ✓' : ''}` : ''}`;
        }).join('\n\n');

        return {
          content: [
            {
              type: 'text',
              text: `Board: ${board.name}\nFound ${cards.length} cards:\n\n${cardsList}`,
            },
          ],
        };
      }

      case 'get_card': {
        const validated = GetCardSchema.parse(args);
        const [card, comments] = await Promise.all([
          trelloClient.getCard(validated.cardId),
          trelloClient.getCardComments(validated.cardId),
        ]);

        const labels = card.labels.map(l => l.name).filter(Boolean).join(', ');
        const members = card.members.map(m => m.fullName).join(', ');

        const commentsText = comments.length > 0
          ? '\n\nComments:\n' + comments.map(c =>
              `- ${c.memberCreator.fullName} (${new Date(c.date).toLocaleDateString()}):\n  ${c.data.text || ''}`
            ).join('\n')
          : '';

        const cardDetails = `Card: ${card.name}
ID: ${card.id}
URL: ${card.shortUrl}

Description:
${card.desc || '(No description)'}

${labels ? `Labels: ${labels}` : 'No labels'}
${members ? `Members: ${members}` : 'No members assigned'}
${card.due ? `Due Date: ${new Date(card.due).toLocaleDateString()}${card.dueComplete ? ' ✓' : ''}` : 'No due date'}

Attachments: ${card.badges.attachments}
Comments: ${card.badges.comments}
Checklist Items: ${card.badges.checkItemsChecked}/${card.badges.checkItems}${commentsText}`;

        return {
          content: [
            {
              type: 'text',
              text: cardDetails,
            },
          ],
        };
      }

      case 'get_lists': {
        const validated = GetListsSchema.parse(args);
        const lists = await trelloClient.getLists(validated.boardId);

        const listsList = lists
          .filter(list => !list.closed)
          .map(list => `- ${list.name} (ID: ${list.id})`)
          .join('\n');

        return {
          content: [
            {
              type: 'text',
              text: `Found ${lists.filter(l => !l.closed).length} lists:\n\n${listsList}`,
            },
          ],
        };
      }

      case 'update_card': {
        const validated = UpdateCardSchema.parse(args);

        const updates: Record<string, string | boolean | null> = {};
        if (validated.name !== undefined) updates.name = validated.name;
        if (validated.description !== undefined) updates.desc = validated.description;
        if (validated.listId !== undefined) updates.idList = validated.listId;
        if (validated.dueDate !== undefined) {
          updates.due = validated.dueDate === 'null' ? null : validated.dueDate;
        }
        if (validated.dueComplete !== undefined) updates.dueComplete = validated.dueComplete;

        const updatedCard = await trelloClient.updateCard(validated.cardId, updates);

        return {
          content: [
            {
              type: 'text',
              text: `Successfully updated card: ${updatedCard.name}\nURL: ${updatedCard.shortUrl}`,
            },
          ],
        };
      }

      case 'add_comment': {
        const validated = AddCommentSchema.parse(args);
        await trelloClient.addComment(validated.cardId, validated.comment);

        return {
          content: [
            {
              type: 'text',
              text: `Successfully added comment to card ${validated.cardId}`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid arguments: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    throw error;
  }
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'trello://boards',
        mimeType: 'application/json',
        name: 'All Trello Boards',
        description: 'List of all accessible Trello boards',
      },
    ],
  };
});

// Handle resource reads
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === 'trello://boards') {
    const boards = await trelloClient.getBoards();
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(boards, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Trello MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
