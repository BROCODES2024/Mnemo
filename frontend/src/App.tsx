// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { HomePage } from "./pages/HomePage";
import { AuthPage } from "./pages/AuthPage";
import { SharePage } from "./pages/SharePage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public share route - accessible to everyone */}
          <Route path="/brain/:shareHash" element={<SharePage />} />

          {/* Public routes accessible only when logged out */}
          <Route element={<PublicRoute />}>
            <Route path="/auth" element={<AuthPage />} />
          </Route>

          {/* Protected routes accessible only when logged in */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            {/* You can add more protected routes here */}
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
