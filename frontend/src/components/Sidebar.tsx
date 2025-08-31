import React from "react";
import { Brain, Twitter, Video, FileText, Link, Hash } from "lucide-react";
import { useContentStore } from "../store/content";
import { cn } from "../lib/utils";

const sidebarItems = [
  { id: "tweets", label: "Tweets", icon: Twitter, type: "tweet" },
  { id: "videos", label: "Videos", icon: Video, type: "video" },
  { id: "documents", label: "Documents", icon: FileText, type: "document" },
  { id: "links", label: "Links", icon: Link, type: "link" },
  { id: "tags", label: "Tags", icon: Hash, type: "tag" },
];

export const Sidebar: React.FC = () => {
  const { selectedType, filterByType } = useContentStore();

  return (
    <div className="w-64 h-screen bg-gray-50 border-r border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-8">
        <Brain className="h-8 w-8 text-indigo-600" />
        <span className="text-xl font-semibold text-gray-800">
          Second Brain
        </span>
      </div>

      <nav className="space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = selectedType === item.type;

          return (
            <button
              key={item.id}
              onClick={() => filterByType(item.type)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors",
                isActive && "bg-gray-100 text-indigo-600"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
