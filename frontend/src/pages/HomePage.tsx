import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { ContentCard } from "../components/ContentCard";
import { AddContentDialog } from "../components/AddContentDialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Share2, Plus, Search, LogOut, Copy } from "lucide-react";
import { useContentStore } from "../store/content";
import { useAuthStore } from "../store/auth";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

export const HomePage: React.FC = () => {
  const {
    filteredContents,
    isLoading,
    fetchContents,
    deleteContent,
    searchContents,
    manageShareLink,
    shareLink,
  } = useContentStore();

  const { logout, user } = useAuthStore();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchContents();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      await deleteContent(id);
      toast.success("Content deleted successfully");
    }
  };

  const handleShare = async () => {
    await manageShareLink(true);
    setShowShareDialog(true);
  };

  const handleCopyShareLink = () => {
    const fullLink = `${window.location.origin}/brain/${shareLink}`;
    navigator.clipboard.writeText(fullLink);
    toast.success("Share link copied to clipboard!");
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

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">All Notes</h1>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 w-64"
                />
              </div>

              <Button variant="outline" onClick={handleShare} className="gap-2">
                <Share2 className="h-4 w-4" />
                Share Brain
              </Button>

              <Button
                onClick={() => setShowAddDialog(true)}
                className="gap-2 bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Add Content
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {user && (
            <p className="text-sm text-gray-500 mt-2">
              Welcome back, <span className="font-medium">{user.username}</span>
            </p>
          )}
        </header>

        {/* Content Grid */}
        <main className="flex-1 overflow-auto p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : filteredContents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-gray-500 text-center">
                <p className="text-xl mb-2">No content found</p>
                <p className="text-sm">
                  Start adding content to your second brain!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContents.map((content) => (
                <ContentCard
                  key={content._id}
                  content={content}
                  onDelete={handleDelete}
                  onShare={handleShare}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add Content Dialog */}
      <AddContentDialog open={showAddDialog} onOpenChange={setShowAddDialog} />

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Second Brain</DialogTitle>
            <DialogDescription>
              Share your content collection with others using this link
            </DialogDescription>
          </DialogHeader>

          {shareLink && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  value={`${window.location.origin}/brain/${shareLink}`}
                  readOnly
                  className="flex-1"
                />
                <Button
                  onClick={handleCopyShareLink}
                  size="icon"
                  variant="outline"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Anyone with this link can view your public content collection.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
