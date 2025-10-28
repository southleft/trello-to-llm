import axios, { AxiosInstance } from 'axios';

export interface TrelloCard {
  id: string;
  name: string;
  desc: string;
  url: string;
  shortUrl: string;
  idList: string;
  idBoard: string;
  labels: Array<{ id: string; name: string; color: string }>;
  due: string | null;
  dueComplete: boolean;
  members: Array<{ id: string; fullName: string; username: string }>;
  badges: {
    attachments: number;
    comments: number;
    checkItems: number;
    checkItemsChecked: number;
  };
}

export interface TrelloList {
  id: string;
  name: string;
  closed: boolean;
  idBoard: string;
  pos: number;
}

export interface TrelloBoard {
  id: string;
  name: string;
  desc: string;
  url: string;
  shortUrl: string;
  closed: boolean;
}

export interface TrelloComment {
  id: string;
  type: string;
  date: string;
  memberCreator: {
    id: string;
    fullName: string;
    username: string;
  };
  data: {
    text?: string;
  };
}

export class TrelloClient {
  private client: AxiosInstance;
  private apiKey: string;
  private apiToken: string;

  constructor(apiKey: string, apiToken: string) {
    this.apiKey = apiKey;
    this.apiToken = apiToken;
    this.client = axios.create({
      baseURL: 'https://api.trello.com/1',
      params: {
        key: this.apiKey,
        token: this.apiToken,
      },
    });
  }

  async getBoards(): Promise<TrelloBoard[]> {
    const response = await this.client.get<TrelloBoard[]>('/members/me/boards');
    return response.data;
  }

  async getBoard(boardId: string): Promise<TrelloBoard> {
    const response = await this.client.get<TrelloBoard>(`/boards/${boardId}`);
    return response.data;
  }

  async getLists(boardId: string): Promise<TrelloList[]> {
    const response = await this.client.get<TrelloList[]>(`/boards/${boardId}/lists`);
    return response.data;
  }

  async getCards(boardId: string): Promise<TrelloCard[]> {
    const response = await this.client.get<TrelloCard[]>(`/boards/${boardId}/cards`, {
      params: {
        members: 'true',
        labels: 'all',
        customFieldItems: 'true',
      },
    });
    return response.data;
  }

  async getCard(cardId: string): Promise<TrelloCard> {
    const response = await this.client.get<TrelloCard>(`/cards/${cardId}`, {
      params: {
        members: 'true',
        labels: 'all',
        attachments: 'true',
        actions: 'commentCard',
      },
    });
    return response.data;
  }

  async getCardComments(cardId: string): Promise<TrelloComment[]> {
    const response = await this.client.get<TrelloComment[]>(`/cards/${cardId}/actions`, {
      params: {
        filter: 'commentCard',
      },
    });
    return response.data;
  }

  async updateCard(cardId: string, updates: {
    name?: string;
    desc?: string;
    idList?: string;
    due?: string | null;
    dueComplete?: boolean;
  }): Promise<TrelloCard> {
    const response = await this.client.put<TrelloCard>(`/cards/${cardId}`, updates);
    return response.data;
  }

  async addComment(cardId: string, text: string): Promise<TrelloComment> {
    const response = await this.client.post<TrelloComment>(`/cards/${cardId}/actions/comments`, {
      text,
    });
    return response.data;
  }

  async moveCard(cardId: string, listId: string): Promise<TrelloCard> {
    return this.updateCard(cardId, { idList: listId });
  }
}
