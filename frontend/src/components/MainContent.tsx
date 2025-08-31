// Path: frontend/src/components/MainContent.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NoteCard } from "./NoteCard";
import { useContentStore } from "@/store/content";
import { Plus, Share } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

export function MainContent() {
  const { content, fetchContent, addContent } = useContentStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState("Document"); // Default type
  const [tags, setTags] = useState("");

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    toast.promise(addContent({ title, body, type, tags: tagsArray }), {
      loading: "Adding content...",
      success: () => {
        // Reset form and close dialog
        setTitle("");
        setBody("");
        setType("Document");
        setTags("");
        setIsDialogOpen(false);
        return "Content added successfully!";
      },
      error: "Failed to add content.",
    });
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">All Notes</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Share size={16} className="mr-2" />
            Share Brain
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} className="mr-2" />
                Add Content
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Content</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="body">Body</Label>
                  <Textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    For project ideas, separate each point with a new line.
                  </p>
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Input
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="e.g., Tweet, Project Ideas, Document"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., productivity, learning"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Content
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map((note) => (
          <NoteCard key={note._id} note={note} />
        ))}
      </div>
    </main>
  );
}
