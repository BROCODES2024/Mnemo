import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";

export function HomePage() {
  const { setToken } = useAuthStore();

  const handleLogout = () => {
    localStorage.removeItem("mnemo-token");
    setToken(null);
  };

  return (
    <div className="container mx-auto p-4 w-full max-w-4xl">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">mnemo</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </header>

      <div className="p-8 border-2 border-dashed border-muted-foreground rounded-lg min-h-[60vh]">
        <h2 className="text-xl text-center text-muted-foreground">
          Your content will appear here.
        </h2>
        <p className="text-center text-muted-foreground mt-2">
          Start adding notes, ideas, and more!
        </p>
      </div>
    </div>
  );
}
