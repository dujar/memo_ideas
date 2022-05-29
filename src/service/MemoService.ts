import axios, { AxiosInstance } from "axios";
import { defaultsDeep } from "lodash";
import moment from "moment";
import { v4 as uuid } from "uuid";
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
      baseURL: process.env.REACT_APP_MEMO_BASE_URL || "",
    });
  }
  get = async (): Promise<Idea[]> => {
    const blankIdea = [
      {
        id: uuid(),
        body: "",
        title: "",
        created_date: moment().format("LLLL"),
      },
    ];
    try {
      const result = await this.client.get("/ideas");

      return result.data;
    } catch {
      if (localStorage) {
        const ideas = localStorage.getItem("ideas");
        if (ideas) {
          return JSON.parse(ideas);
        } else {
          localStorage.setItem("ideas", JSON.stringify(blankIdea));
        }
      }
      return blankIdea;
    }
  };

  getNew = async (): Promise<Pick<Idea, "id" | "created_date">> => {
    try {
      const result = await this.client.get("/ideas/new");
      return result.data;
    } catch {
      const blankIdea = {
        id: uuid(),
        body: "",
        title: "",
        created_date: moment().format("LLLL"),
      };
      if (localStorage) {
        const ideas = localStorage.getItem("ideas");
        if (ideas) {
          const localIdeas = JSON.parse(ideas) || [];
          console.log({ localIdeas });
          localStorage.setItem(
            "ideas",
            JSON.stringify(localIdeas.concat(ideas))
          );
        } else {
          localStorage.setItem("ideas", JSON.stringify(blankIdea));
        }
      }

      return blankIdea;
    }
  };

  updateIdea = async (idea: Omit<Idea, "created_date">): Promise<Idea> => {
    try {
      const data = idea;
      const result = await this.client.post("/ideas/update", data);
      return result.data;
    } catch {
      if (localStorage) {
        const ideas = localStorage.getItem("ideas");
        if (ideas) {
          const localIdeas = JSON.parse(ideas);
          localStorage.setItem(
            "ideas",
            JSON.stringify(
              localIdeas.map((lIdea: Idea) => {
                if (idea.id !== lIdea.id) {
                  return lIdea;
                }
                return defaultsDeep(idea, lIdea);
              })
            )
          );
        }
      }

      return {} as Idea;
    }
  };

  deleteIdea = async (idea: Pick<Idea, "id">): Promise<boolean> => {
    try {
      const result = await this.client.post(`/ideas/delete`, idea);
      return result.data;
    } catch {
      if (localStorage) {
        const ideas = localStorage.getItem("ideas");
        if (ideas) {
          const localIdeas = JSON.parse(ideas);
          localStorage.setItem(
            "ideas",
            JSON.stringify(
              localIdeas.filter((lIdea: Idea) => {
                if (idea.id !== lIdea.id) {
                  return true;
                }
                return false;
              })
            )
          );
        }
      }

      return true;
    }
  };
}
