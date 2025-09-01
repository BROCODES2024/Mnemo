// src/pages/SharePage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Brain, Loader2, Home, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";
import api from "../lib/api";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

interface SharedContent {
  _id: string;
  title: string;
  body: string | string[];
  type: string;
  tags: string[];
  createdAt: string;
}

interface SharedBrainData {
  username: string;
  contents: SharedContent[];
}

export const SharePage: React.FC = () => {
  const { shareHash } = useParams<{ shareHash: string }>();
  const [data, setData] = useState<SharedBrainData | null>(null);
  const [filteredContents, setFilteredContents] = useState<SharedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    const fetchSharedContent = async () => {
      if (!shareHash) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get(`/brain/${shareHash}`);

        // Normalize common response shapes
        let brainData: any = response.data;

        // e.g. { brain: { username, contents } }
        if (brainData.brain) {
          brainData = brainData.brain;
        }

        // e.g. { content: [...] } -> normalize to contents
        if (!brainData.contents && brainData.content) {
          brainData.contents = brainData.content;
        }

        const normalized = {
          username: brainData.username ?? "Unknown",
          contents: Array.isArray(brainData.contents) ? brainData.contents : [],
        };

        setData(normalized);
        setFilteredContents(normalized.contents);
      } catch (err: any) {
        console.error("Failed to fetch shared brain:", err);
        if (err.response?.status === 404) {
          setError("This shared brain link is invalid or has expired.");
        } else {
          setError("Failed to load shared content. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedContent();
  }, [shareHash]);

  useEffect(() => {
    if (!data) return;

    let filtered = data.contents;

    // Filter by type
    if (selectedType && selectedType !== "all") {
      filtered = filtered.filter(
        (c) => c.type.toLowerCase() === selectedType.toLowerCase()
      );
    }

    // Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(lowerQuery) ||
          (typeof c.body === "string" ? c.body : c.body.join(" "))
            .toLowerCase()
            .includes(lowerQuery) ||
          c.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    }

    setFilteredContents(filtered);
  }, [searchQuery, selectedType, data]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const renderBody = (content: SharedContent) => {
    if (typeof content.body === "string") {
      return <p className="text-gray-600 line-clamp-3">{content.body}</p>;
    } else if (Array.isArray(content.body)) {
      return (
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          {content.body.slice(0, 3).map((item, idx) => (
            <li key={idx} className="line-clamp-1">
              {item}
            </li>
          ))}
          {content.body.length > 3 && (
            <li className="text-gray-400">
              ...and {content.body.length - 3} more
            </li>
          )}
        </ul>
      );
    }
    return null;
  };

  // Get unique types from contents
  const contentTypes =
    data?.contents && data.contents.length > 0
      ? Array.from(new Set(data.contents.map((c) => c.type)))
      : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading shared brain...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/auth">
            <Button variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  {data.username}'s Second Brain
                </h1>
                <p className="text-sm text-gray-500">
                  {data?.contents?.length ?? 0} shared
                  {(data?.contents?.length ?? 0) === 1 ? "item" : "items"}
                </p>
              </div>
            </div>

            <Link to="/auth">
              <Button variant="outline" className="gap-2">
                <Brain className="h-4 w-4" />
                Create Your Own
              </Button>
            </Link>
          </div>

          {/* Search and Filter Bar */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search shared content..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>

            {contentTypes.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedType === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType("all")}
                >
                  All
                </Button>
                {contentTypes.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredContents.length === 0 ? (
          <div className="text-center py-16">
            <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">
              {searchQuery
                ? "No matching content found"
                : "No content to display"}
            </p>
            {searchQuery && (
              <p className="text-sm text-gray-500">
                Try adjusting your search query
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContents.map((content) => (
              <Card
                key={content._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {content.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">
                    {content.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>{renderBody(content)}</CardContent>

                <CardFooter className="pt-3">
                  <div className="flex flex-wrap gap-2 items-center justify-between w-full">
                    <div className="flex flex-wrap gap-1">
                      {content.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      {format(new Date(content.createdAt), "MM/dd/yyyy")}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>This is a read-only view of {data.username}'s shared content.</p>
            <p className="mt-2">
              Want to create your own Second Brain?{" "}
              <Link
                to="/auth"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Get started here
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
