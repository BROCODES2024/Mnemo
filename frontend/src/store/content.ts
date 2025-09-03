import { create } from "zustand";
import api from "../lib/api";

export interface Content {
  _id: string;
  title: string;
  body: string | string[];
  type: string;
  tags: string[];
  link?: string; // Added optional link field
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ContentState {
  contents: Content[];
  filteredContents: Content[];
  selectedType: string;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  shareLink: string | null;

  // Actions
  fetchContents: () => Promise<void>;
  addContent: (
    content: Omit<Content, "_id" | "userId" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  deleteContent: (contentId: string) => Promise<void>;
  filterByType: (type: string) => void;
  searchContents: (query: string) => void;
  manageShareLink: (share: boolean) => Promise<void>;
  clearError: () => void;

  // Helper
  filterAndSearch: (
    contents: Content[],
    type?: string,
    query?: string
  ) => Content[];
}

export const useContentStore = create<ContentState>((set, get) => ({
  contents: [],
  filteredContents: [],
  selectedType: "all",
  searchQuery: "",
  isLoading: false,
  error: null,
  shareLink: null,

  fetchContents: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/content");
      const contents = response.data.content;
      set({
        contents,
        filteredContents: contents,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.msg || "Failed to fetch contents",
        isLoading: false,
      });
    }
  },

  addContent: async (content) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/content", content);
      const newContent = response.data.content;

      set((state) => {
        const updatedContents = [newContent, ...state.contents];
        return {
          contents: updatedContents,
          filteredContents: get().filterAndSearch(updatedContents),
          isLoading: false,
        };
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.msg || "Failed to add content",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteContent: async (contentId: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/content/${contentId}`);

      set((state) => {
        const updatedContents = state.contents.filter(
          (c) => c._id !== contentId
        );
        return {
          contents: updatedContents,
          filteredContents: get().filterAndSearch(updatedContents),
          isLoading: false,
        };
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.msg || "Failed to delete content",
        isLoading: false,
      });
    }
  },

  filterByType: (type: string) => {
    set((state) => {
      const filtered = get().filterAndSearch(state.contents, type);
      return { selectedType: type, filteredContents: filtered };
    });
  },

  searchContents: (query: string) => {
    set((state) => {
      const filtered = get().filterAndSearch(
        state.contents,
        state.selectedType,
        query
      );
      return { searchQuery: query, filteredContents: filtered };
    });
  },

  manageShareLink: async (share: boolean) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/content/share", { share });
      const hash = response.data.hash || null;
      set({ shareLink: hash, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.msg || "Failed to manage share link",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),

  // Helper function - updated to include link in search
  filterAndSearch: (contents: Content[], type?: string, query?: string) => {
    const currentType = type ?? get().selectedType;
    const currentQuery = query ?? get().searchQuery;

    let filtered = contents;

    // Filter by type
    if (currentType && currentType !== "all") {
      filtered = filtered.filter(
        (c) => c.type.toLowerCase() === currentType.toLowerCase()
      );
    }

    // Search - now includes link field
    if (currentQuery) {
      const lowerQuery = currentQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(lowerQuery) ||
          (typeof c.body === "string" ? c.body : c.body.join(" "))
            .toLowerCase()
            .includes(lowerQuery) ||
          c.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
          (c.link && c.link.toLowerCase().includes(lowerQuery))
      );
    }

    return filtered;
  },
}));
