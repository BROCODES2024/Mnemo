import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { X, Link2 } from "lucide-react";
import { useContentStore } from "../store/content";
import { toast } from "sonner";

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const contentTypes = [
  "Tweet",
  "Video",
  "Document",
  "Link",
  "Project Ideas",
  "Article",
  "Note",
];

export const AddContentDialog: React.FC<AddContentDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { addContent } = useContentStore();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    type: "",
    tags: [] as string[],
    link: "", // Added link field
    isListFormat: false,
  });

  const [tagInput, setTagInput] = useState("");

  // Auto-detect content type based on link
  const handleLinkChange = (linkValue: string) => {
    setFormData({ ...formData, link: linkValue });

    // Auto-suggest content type based on URL
    if (linkValue && !formData.type) {
      if (linkValue.includes("youtube.com") || linkValue.includes("youtu.be")) {
        setFormData((prev) => ({ ...prev, type: "Video", link: linkValue }));
      } else if (linkValue.includes("x.com")) {
        setFormData((prev) => ({ ...prev, type: "Tweet", link: linkValue }));
      } else {
        setFormData((prev) => ({ ...prev, type: "Link", link: linkValue }));
      }
    }
  };

  // Validate URL format
  const isValidUrl = (string: string) => {
    if (!string) return true; // Empty is valid (optional field)
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.body || !formData.type) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate URL if provided
    if (formData.link && !isValidUrl(formData.link)) {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsLoading(true);
    try {
      const bodyContent = formData.isListFormat
        ? formData.body.split("\n").filter((line) => line.trim())
        : formData.body;

      await addContent({
        title: formData.title,
        body: bodyContent,
        type: formData.type,
        tags: formData.tags,
        link: formData.link || undefined, // Only send if not empty
      });

      toast.success("Content added successfully!");
      onOpenChange(false);

      // Reset form
      setFormData({
        title: "",
        body: "",
        type: "",
        tags: [],
        link: "",
        isListFormat: false,
      });
    } catch (error) {
      toast.error("Failed to add content");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Content</DialogTitle>
            <DialogDescription>
              Save ideas, links, notes, and more to your second brain.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter a title for your content"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* NEW LINK FIELD */}
            <div className="grid gap-2">
              <Label htmlFor="link" className="flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                Link (Optional)
              </Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => handleLinkChange(e.target.value)}
                placeholder="https://example.com"
                className={!isValidUrl(formData.link) ? "border-red-500" : ""}
              />
              {formData.link && !isValidUrl(formData.link) && (
                <p className="text-sm text-red-500">Please enter a valid URL</p>
              )}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="body">Content *</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="listFormat"
                    checked={formData.isListFormat}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isListFormat: e.target.checked,
                      })
                    }
                    className="h-4 w-4"
                  />
                  <Label
                    htmlFor="listFormat"
                    className="text-sm font-normal cursor-pointer"
                  >
                    List format (one item per line)
                  </Label>
                </div>
              </div>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) =>
                  setFormData({ ...formData, body: e.target.value })
                }
                placeholder={
                  formData.isListFormat
                    ? "Enter items, one per line:\n• First item\n• Second item\n• Third item"
                    : "Enter your content here..."
                }
                className="min-h-[120px]"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type a tag and press Enter"
              />
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Content"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
