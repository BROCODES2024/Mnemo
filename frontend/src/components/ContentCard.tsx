import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  FileText,
  Image,
  Link2,
  Share2,
  Trash2,
  // Twitter,
  Video,
} from "lucide-react";
import type { Content } from "../store/content";
import { format } from "date-fns";

interface ContentCardProps {
  content: Content;
  onDelete: (id: string) => void;
  onShare: () => void;
}

const typeIcons: Record<string, React.ComponentType<any>> = {
  tweet: Link2, // Replace with a suitable icon for tweets
  video: Video,
  document: FileText,
  link: Link2,
  image: Image,
  "project ideas": FileText,
  article: FileText,
};

export const ContentCard: React.FC<ContentCardProps> = ({
  content,
  onDelete,
  onShare,
}) => {
  const Icon = typeIcons[content.type.toLowerCase()] || FileText;

  const renderBody = () => {
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

  return (
    <Card className="content-card hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-gray-500" />
            <Badge variant="secondary" className="text-xs">
              {content.type}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDelete(content._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardTitle className="text-lg mt-2">{content.title}</CardTitle>
      </CardHeader>

      <CardContent>{renderBody()}</CardContent>

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
            Added on {format(new Date(content.createdAt), "MM/dd/yyyy")}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};
