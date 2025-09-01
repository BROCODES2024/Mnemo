// src/pages/HomePage.tsx
import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { ContentCard } from "../components/ContentCard";
import { AddContentDialog } from "../components/AddContentDialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Share2,
  Plus,
  Search,
  LogOut,
  Copy,
  Loader2,
  Brain,
} from "lucide-react";
import { useContentStore } from "../store/content";
import { useAuthStore } from "../store/auth";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { ThemeToggle } from "../components/ui/ThemeToggle";

export const HomePage: React.FC = () => {
  const {
    filteredContents,
    isLoading,
    fetchContents,
    deleteContent,
    searchContents,
    manageShareLink,
    shareLink,
    selectedType,
  } = useContentStore();

  const { logout, user } = useAuthStore();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchContents().catch((error) => {
      toast.error("Failed to load contents. Please refresh the page.");
    });
  }, [fetchContents]);

  const handleDeleteClick = (id: string) => {
    setContentToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!contentToDelete) return;

    setIsDeleting(true);
    try {
      await deleteContent(contentToDelete);
      toast.success("Content deleted successfully");
      setShowDeleteDialog(false);
      setContentToDelete(null);
    } catch (error) {
      toast.error("Failed to delete content. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    setIsGeneratingLink(true);
    try {
      await manageShareLink(true);
      setShowShareDialog(true);
    } catch (error) {
      toast.error("Failed to generate share link. Please try again.");
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyShareLink = () => {
    if (!shareLink) return;

    const fullLink = `${window.location.origin}/brain/${shareLink}`;
    navigator.clipboard
      .writeText(fullLink)
      .then(() => {
        toast.success("Share link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link. Please try again.");
      });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchContents(query);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/auth";
  };

  // Get display title based on selected type
  const getPageTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }

    switch (selectedType) {
      case "tweet":
        return "Tweets";
      case "video":
        return "Videos";
      case "document":
        return "Documents";
      case "link":
        return "Links";
      case "tag":
        return "Tags";
      default:
        return "All Notes";
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-foreground">
                {getPageTitle()}
              </h1>
              {filteredContents.length > 0 && (
                <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {filteredContents.length}{" "}
                  {filteredContents.length === 1 ? "item" : "items"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 w-64"
                />
              </div>

              <Button
                variant="outline"
                onClick={handleShare}
                className="gap-2"
                disabled={isGeneratingLink}
              >
                {isGeneratingLink ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                Share Brain
              </Button>

              <Button
                onClick={() => setShowAddDialog(true)}
                className="gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <Plus className="h-4 w-4" />
                Add Content
              </Button>

              <ThemeToggle />

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Logout"
                className="hover:bg-muted"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {user && (
            <p className="text-sm text-muted-foreground mt-2">
              Welcome back, <span className="font-medium">{user.username}</span>
            </p>
          )}
        </header>

        {/* Content Grid */}
        <main className="flex-1 overflow-auto p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400 mb-4" />
              <div className="text-muted-foreground">
                Loading your content...
              </div>
            </div>
          ) : filteredContents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Brain className="h-16 w-16 text-muted mb-4" />
              <div className="text-muted-foreground text-center">
                <p className="text-xl mb-2">
                  {searchQuery ? "No matching content found" : "No content yet"}
                </p>
                <p className="text-sm">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "Start adding content to your second brain!"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => setShowAddDialog(true)}
                    className="mt-4 gap-2"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                    Add Your First Content
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredContents.map((content) => (
                <ContentCard
                  key={content._id}
                  content={content}
                  onDelete={handleDeleteClick}
                  onShare={handleShare}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add Content Dialog */}
      <AddContentDialog open={showAddDialog} onOpenChange={setShowAddDialog} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              content from your second brain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Second Brain</DialogTitle>
            <DialogDescription>
              Share your content collection with others using this link. Anyone
              with this link can view your public content.
            </DialogDescription>
          </DialogHeader>

          {shareLink ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  value={`${window.location.origin}/brain/${shareLink}`}
                  readOnly
                  className="flex-1 font-mono text-sm"
                />
                <Button
                  onClick={handleCopyShareLink}
                  size="icon"
                  variant="outline"
                  title="Copy link"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> This link provides read-only access to
                  your content. Viewers cannot edit or delete your notes.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowShareDialog(false)}
              className="w-full sm:w-auto"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
