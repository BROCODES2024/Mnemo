import { useEffect } from "react";
import { HomePage } from "@/pages/HomePage";
import { AuthPage } from "@/pages/AuthPage";
import { useAuthStore } from "@/store/auth";

function App() {
  const { token, setToken } = useAuthStore();

  useEffect(() => {
    // On initial load, check if a token exists in localStorage
    const storedToken = localStorage.getItem("mnemo-token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, [setToken]);

  return (
    <main className="dark bg-background text-foreground min-h-screen flex flex-col items-center justify-center p-4">
      {token ? <HomePage /> : <AuthPage />}
    </main>
  );
}

export default App;
