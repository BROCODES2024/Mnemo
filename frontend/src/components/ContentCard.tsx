import React, { useState, useEffect } from "react";
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
  Video,
  ExternalLink,
  Play,
  MessageCircle,
} from "lucide-react";
import type { Content } from "../store/content";
import { format } from "date-fns";

interface ContentCardProps {
  content: Content;
  onDelete: (id: string) => void;
  onShare: () => void;
}

interface LinkPreview {
  url: string;
  title: string;
  description?: string;
  image?: string;
  type: "youtube" | "twitter" | "generic" | "image";
  domain: string;
}

const typeIcons: Record<string, React.ComponentType<any>> = {
  tweet: MessageCircle,
  video: Video,
  document: FileText,
  link: Link2,
  image: Image,
  "project ideas": FileText,
  article: FileText,
  note: FileText,
};

export const ContentCard: React.FC<ContentCardProps> = ({
  content,
  onDelete,
  onShare,
}) => {
  const Icon = typeIcons[content.type.toLowerCase()] || FileText;
  const [linkPreview, setLinkPreview] = useState<LinkPreview | null>(null);
  const [imageError, setImageError] = useState(false);

  // Generate link preview data
  const generateLinkPreview = (url: string): LinkPreview => {
    const domain = new URL(url).hostname;

    // YouTube URL patterns (improved regex)
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);

    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      return {
        url,
        title: "YouTube Video",
        description: "Click to watch on YouTube",
        // Use high quality thumbnail, fallback to maxresdefault
        image: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        type: "youtube",
        domain: "YouTube",
      };
    }

    // Twitter/X URL patterns
    const twitterRegex = /(?:twitter\.com|x\.com)\/(\w+)\/status\/(\d+)/;
    const twitterMatch = url.match(twitterRegex);
    if (twitterMatch) {
      const [, username] = twitterMatch;
      return {
        url,
        title: `Post by @${username}`,
        description: "View on X (Twitter)",
        type: "twitter",
        domain: "X (Twitter)",
      };
    }

    // Image URL patterns
    const imageRegex = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;
    if (imageRegex.test(url)) {
      return {
        url,
        title: "Image",
        description: "Click to view full size",
        image: url,
        type: "image",
        domain,
      };
    }

    // Generic URL
    return {
      url,
      title: domain.replace("www.", ""),
      description: "Visit website",
      type: "generic",
      domain: domain.replace("www.", ""),
    };
  };

  useEffect(() => {
    if (content.link) {
      try {
        const preview = generateLinkPreview(content.link);
        setLinkPreview(preview);
        setImageError(false);
      } catch (error) {
        console.error("Error generating link preview:", error);
        setLinkPreview(null);
      }
    } else {
      setLinkPreview(null);
    }
  }, [content.link]);

  const handleLinkClick = () => {
    if (linkPreview) {
      window.open(linkPreview.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleImageError = () => {
    setImageError(true);
    // For YouTube videos, try fallback thumbnail
    if (linkPreview?.type === "youtube") {
      const videoId = linkPreview.url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      )?.[1];
      if (videoId && linkPreview.image?.includes("hqdefault")) {
        setLinkPreview((prev) =>
          prev
            ? {
                ...prev,
                image: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
              }
            : null
        );
        setImageError(false);
      }
    }
  };

  const renderLinkPreview = () => {
    if (!linkPreview) return null;

    return (
      <div
        className="border rounded-lg overflow-hidden cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
        onClick={handleLinkClick}
      >
        {/* Image/Thumbnail Section */}
        {linkPreview.image && !imageError && (
          <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
            <img
              src={linkPreview.image}
              alt={linkPreview.title}
              className="w-full h-full object-cover"
              onError={handleImageError}
              loading="lazy"
            />

            {/* YouTube Play Button Overlay */}
            {linkPreview.type === "youtube" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all">
                <div className="bg-red-600 rounded-full p-3 shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="h-8 w-8 text-white fill-current ml-1" />
                </div>
              </div>
            )}

            {/* Twitter Icon Overlay */}
            {linkPreview.type === "twitter" && (
              <div className="absolute top-3 right-3 bg-black bg-opacity-60 rounded-full p-2">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {linkPreview.title}
              </h4>

              {linkPreview.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {linkPreview.description}
                </p>
              )}

              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  {linkPreview.domain}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Click to open
                </span>
              </div>
            </div>

            <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors flex-shrink-0" />
          </div>
        </div>
      </div>
    );
  };

  const renderBody = () => {
    if (typeof content.body === "string") {
      return (
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
          {content.body}
        </p>
      );
    } else if (Array.isArray(content.body)) {
      return (
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
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

      <CardContent className="space-y-4">
        {/* Content Body */}
        {renderBody()}

        {/* Link Preview */}
        {renderLinkPreview()}
      </CardContent>

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
