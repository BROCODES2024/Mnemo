// Path: frontend/src/store/content.ts
import { create } from "zustand";
import api from "../lib/api";

// Define a type for our content items
export interface Content {
  _id: string;
  title: string;
  body: string | string[];
  type: string;
  tags: string[];
  createdAt: string;
}

interface ContentState {
  content: Content[];
  fetchContent: () => Promise<void>;
  addContent: (newContent: {
    title: string;
    body: string;
    type: string;
    tags: string[];
  }) => Promise<void>;
  deleteContent: (contentId: string) => Promise<void>;
}

export const useContentStore = create<ContentState>((set) => ({
  content: [],
  fetchContent: async () => {
    try {
      const response = await api.get("/content");
      set({ content: response.data.content });
    } catch (error) {
      console.error("Failed to fetch content:", error);
    }
  },
  addContent: async (newContent) => {
    try {
      const response = await api.post("/content", newContent);
      set((state) => ({
        content: [response.data.content, ...state.content],
      }));
    } catch (error) {
      console.error("Failed to add content:", error);
      throw error;
    }
  },
  deleteContent: async (contentId) => {
    try {
      await api.delete(`/content/${contentId}`);
      set((state) => ({
        content: state.content.filter((item) => item._id !== contentId),
      }));
    } catch (error) {
      console.error("Failed to delete content:", error);
    }
  },
}));
