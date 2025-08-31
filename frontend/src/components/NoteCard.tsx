// Path: frontend/src/components/NoteCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Share2, FileText, Lightbulb, Twitter } from "lucide-react";
import { useContentStore } from "@/store/content";
import type { Content } from "@/store/content";
import { toast } from "sonner";

interface NoteCardProps {
  note: Content;
}

const typeIcons: { [key: string]: React.ReactNode } = {
  "Project Ideas": <Lightbulb className="w-5 h-5" />,
  Tweet: <Twitter className="w-5 h-5" />,
  Document: <FileText className="w-5 h-5" />,
};

export function NoteCard({ note }: NoteCardProps) {
  const deleteContent = useContentStore((state) => state.deleteContent);

  const handleDelete = () => {
    toast.promise(deleteContent(note._id), {
      loading: "Deleting note...",
      success: "Note deleted!",
      error: "Failed to delete note.",
    });
  };

  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-GB");

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          {typeIcons[note.type] || <FileText className="w-5 h-5" />}
          {note.title}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <button className="text-gray-400 hover:text-gray-600">
            <Share2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {Array.isArray(note.body) ? (
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            {note.body.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">{note.body}</p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-gray-400">Added on {formattedDate}</p>
        </div>
      </CardContent>
    </Card>
  );
}
