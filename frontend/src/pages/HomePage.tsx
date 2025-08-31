// Path: frontend/src/pages/HomePage.tsx
import { Sidebar } from "@/components/Sidebar";
import { MainContent } from "@/components/MainContent";

export function HomePage() {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar />
      <MainContent />
    </div>
  );
}
