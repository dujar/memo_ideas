import axios, { AxiosInstance } from "axios";

export interface Idea {
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
    return [{ id: "x", body: "", title: "", created_date: "date creation x" }];
    const result = await this.client.get("/ideas");

    return result.data;
  };

  getNew = async (): Promise<Pick<Idea, "id" | "created_date">> => {
    return { id: "ff", created_date: "df" };
    const result = await this.client.get("/ideas/new");

    return result.data;
  };

  updateIdea = async (idea: Omit<Idea, "created_date">): Promise<Idea> => {
    const data = idea;
    const result = await this.client.post("/ideas/update", data);
    return result.data;
  };

  deleteIdea = async (id: Pick<Idea, "id">): Promise<Idea> => {
    const result = await this.client.post(`/ideas/delete`, { id });
    return result.data;
  };
}
