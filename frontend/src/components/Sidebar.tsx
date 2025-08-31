// Path: frontend/src/components/Sidebar.tsx
import { Twitter, Video, FileText, Link, Tag } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r p-6">
      <h1 className="text-2xl font-bold mb-8">Second Brain</h1>
      <nav className="space-y-4">
        <a
          href="#"
          className="flex items-center space-x-3 text-gray-700 hover:font-semibold"
        >
          <Twitter size={20} />
          <span>Tweets</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 text-gray-700 hover:font-semibold"
        >
          <Video size={20} />
          <span>Videos</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 text-gray-700 hover:font-semibold"
        >
          <FileText size={20} />
          <span>Documents</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 text-gray-700 hover:font-semibold"
        >
          <Link size={20} />
          <span>Links</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 text-gray-700 hover:font-semibold"
        >
          <Tag size={20} />
          <span>Tags</span>
        </a>
      </nav>
    </aside>
  );
}
