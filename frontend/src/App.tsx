import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// FIX: Added TooltipContent to the import
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "sonner";

import {
  Twitter,
  Video,
  FileText,
  Link2,
  Tag,
  Share2,
  Plus,
  Trash2,
  Menu,
  Pin,
  MessageSquareQuote,
  FileIcon,
} from "lucide-react";

// --- API Configuration ---
const API_URL = "http://localhost:3000/api/v1";
const JWT_TOKEN = "YOUR_JWT_TOKEN_HERE"; // <--- PASTE YOUR TOKEN HERE

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${JWT_TOKEN}`,
  },
});

// --- Type Definition ---
interface Note {
  _id: string;
  title: string;
  body: string | string[];
  type: string;
  tags: string[];
  createdAt: string;
}

// --- Reusable Components ---
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
    {children}
  </span>
);

// FIX: Changed onDelete prop type from 'void' to 'Promise<void>'
const NoteCard = ({
  note,
  onDelete,
}: {
  note: Note;
  onDelete: (id: string) => Promise<void>;
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "Project Ideas":
        return <FileText className="w-4 h-4 text-muted-foreground" />;
      case "Tweet":
        return <MessageSquareQuote className="w-4 h-4 text-muted-foreground" />;
      case "Article":
        return <FileIcon className="w-4 h-4 text-muted-foreground" />;
      default:
        return <FileIcon className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const handleDelete = () => {
    // This toast.promise should now work correctly with the fixed prop type
    toast.promise(onDelete(note._id), {
      loading: "Deleting note...",
      success: "Note deleted!",
      error: "Failed to delete note.",
    });
  };

  return (
    <Card className="bg-card border-border flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getIcon(note.type)}
            <span className="text-sm font-medium text-muted-foreground">
              {note.type}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-7 h-7">
                    <Pin className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Pin Note</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 text-destructive/80 hover:text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <CardTitle className="text-lg font-semibold pt-2">
          {note.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow text-sm">
        {Array.isArray(note.body) ? (
          <ul className="list-disc list-inside space-y-2">
            {note.body.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-foreground/90">{note.body}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center gap-2 flex-wrap">
          {note.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <span>{new Date(note.createdAt).toLocaleDateString()}</span>
      </CardFooter>
    </Card>
  );
};

const SidebarNav = () => (
  <nav className="flex flex-col gap-2 p-4">
    <h1 className="text-2xl font-bold tracking-tight mb-4 px-2">
      Second Brain
    </h1>
    <Button variant="ghost" className="justify-start gap-2">
      <Twitter className="w-4 h-4" /> Tweets
    </Button>
    <Button variant="ghost" className="justify-start gap-2">
      <Video className="w-4 h-4" /> Videos
    </Button>
    <Button variant="ghost" className="justify-start gap-2">
      <FileText className="w-4 h-4" /> Documents
    </Button>
    <Button variant="ghost" className="justify-start gap-2">
      <Link2 className="w-4 h-4" /> Links
    </Button>
    <Separator className="my-2" />
    <Button variant="ghost" className="justify-start gap-2">
      <Tag className="w-4 h-4" /> Tags
    </Button>
  </nav>
);

const AddContentDialog = ({
  onNoteAdded,
}: {
  onNoteAdded: (newNote: Note) => void;
}) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState("Article");
  const [tags, setTags] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // FIX: Added 'React.FormEvent' type to the event parameter 'e'
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const noteData = {
      title,
      body,
      type,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      const response = await apiClient.post("/content", noteData);
      toast.success("Note added successfully!");
      onNoteAdded(response.data.content);
      setIsOpen(false);
      setTitle("");
      setBody("");
      setTags("");
    } catch (error) {
      toast.error("Failed to add note. Check console for details.");
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add Content
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Content or list items (one per line)"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
          <Input
            placeholder="Type (e.g., Article, Tweet)"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
          <Input
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <Button type="submit">Save Content</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// --- Main App Component ---
function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      if (JWT_TOKEN === "YOUR_JWT_TOKEN_HERE") {
        toast.error("Please add your JWT token in App.tsx");
        setIsLoading(false);
        return;
      }
      try {
        const response = await apiClient.get("/content");
        setNotes(response.data.content);
      } catch (error) {
        toast.error("Failed to fetch notes. Are you logged in?");
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleNoteAdded = (newNote: Note) => {
    setNotes((prevNotes) => [newNote, ...prevNotes]);
  };

  const deleteNote = async (id: string) => {
    await apiClient.delete(`/content/${id}`);
    setNotes(notes.filter((note) => note._id !== id));
  };

  const handleShareBrain = async () => {
    const promise = async () => {
      const response = await apiClient.post("/content/share", { share: true });
      const shareLink = `${window.location.origin}/brain/${response.data.hash}`;
      navigator.clipboard.writeText(shareLink);
      return `Share link copied to clipboard!`;
    };
    toast.promise(promise(), {
      loading: "Generating share link...",
      success: (message) => message,
      error: "Failed to create share link.",
    });
  };

  return (
    <div className="dark min-h-screen w-full bg-background text-foreground font-sans">
      <Toaster richColors position="top-right" />
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
        <aside className="hidden md:block border-r border-border h-screen sticky top-0">
          <SidebarNav />
        </aside>
        <main className="p-4 sm:p-6 lg:p-8">
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[280px] p-0 pt-6 bg-card border-border"
                  >
                    <SidebarNav />
                  </SheetContent>
                </Sheet>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">All Notes</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleShareBrain}>
                <Share2 className="w-4 h-4 mr-2" /> Share Brain
              </Button>
              <AddContentDialog onNoteAdded={handleNoteAdded} />
            </div>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))
              : notes.map((note) => (
                  <NoteCard key={note._id} note={note} onDelete={deleteNote} />
                ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
