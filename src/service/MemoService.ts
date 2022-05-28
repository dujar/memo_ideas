import axios, { AxiosInstance } from "axios";

interface Idea {
  id: string;
  created_date: string;
  title: string;
  body: string;
}

export class MemoService {
  private client: AxiosInstance;
  constructor() {
    this.client = axios.create({
      baseURL: process.env.MEMO_BASE_URL || "",
    });
  }
  get = async (): Promise<Idea[]> => {
    const result = await this.client.get("/ideas");

    return result.data;
  };

  getNew = async (): Promise<Pick<Idea, "id" | "created_date">> => {
    const result = await this.client.get("/ideas/new");

    return result.data;
  };

  updateIdea = async (idea: Omit<Idea, "created_date">): Promise<Idea> => {
    const data = idea;
    const result = await this.client.post("/ideas/new", data);
    return result.data;
  };

  deleteIdea = async (id: Pick<Idea, "id">): Promise<Idea> => {
    const result = await this.client.post(`/ideas/delete`, { id });
    return result.data;
  };
}
