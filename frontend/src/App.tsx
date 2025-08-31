import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

// Assuming you have lucide-react installed for icons
// If not, run: npm install lucide-react
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
  FileIcon,
  MessageSquareQuote,
  Pin,
} from "lucide-react";

// --- Mock Data ---
// In a real app, this would come from your backend API
const notes = [
  {
    id: 1,
    type: "Project Ideas",
    icon: <FileText className="w-4 h-4 text-muted-foreground" />,
    title: "Future Projects",
    content: (
      <ul className="list-disc list-inside space-y-2 text-sm text-foreground">
        <li>Build a personal knowledge base</li>
        <li>Create a habit tracker</li>
        <li>Design a minimalist todo app</li>
      </ul>
    ),
    tags: ["#productivity", "#ideas"],
    date: "10/03/2024",
  },
  {
    id: 2,
    type: "Article",
    icon: <FileIcon className="w-4 h-4 text-muted-foreground" />,
    title: "How to Build a Second Brain",
    content: (
      <div className="bg-muted/50 rounded-lg flex items-center justify-center h-24 text-muted-foreground">
        <FileIcon className="w-8 h-8" />
      </div>
    ),
    tags: ["#productivity", "#learning"],
    date: "09/03/2024",
  },
  {
    id: 3,
    type: "Tweet",
    icon: <MessageSquareQuote className="w-4 h-4 text-muted-foreground" />,
    title: "Productivity Tip",
    content: (
      <p className="text-sm text-foreground">
        The best way to learn is to build in public. Share your progress, get
        feedback, and help others along the way.
      </p>
    ),
    tags: ["#productivity", "#learning"],
    date: "08/03/2024",
  },
];

// --- Reusable Components ---

// Simple Badge component to match the style
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
    {children}
  </span>
);

// Note Card Component
const NoteCard = ({ note }: { note: (typeof notes)[0] }) => {
  return (
    <Card className="bg-card border-border flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {note.icon}
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
                  <Button variant="ghost" size="icon" className="w-7 h-7">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 text-destructive/80 hover:text-destructive"
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
      <CardContent className="flex-grow">{note.content}</CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          {note.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <span>Added on {note.date}</span>
      </CardFooter>
    </Card>
  );
};

// Sidebar Navigation Component
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

// Main App Component
function App() {
  return (
    // Add 'dark' class to apply your dark theme variables from index.css
    <div className="dark min-h-screen w-full bg-background text-foreground font-sans">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block border-r border-border h-screen sticky top-0">
          <SidebarNav />
        </aside>

        {/* Main Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Mobile Sidebar Trigger */}
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
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share Brain
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Content
              </Button>
            </div>
          </header>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
