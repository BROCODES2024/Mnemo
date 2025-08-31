// Path: frontend/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AuthPage } from "./pages/AuthPage";
import { useAuthStore } from "./store/auth";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={!isAuthenticated ? <AuthPage /> : <Navigate to="/" />}
          />
        </Routes>
      </BrowserRouter>
      <Toaster richColors />
    </>
  );
}

export default App;
