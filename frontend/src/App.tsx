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
          <Route path="/brain/:shareHash" element={<SharePage />} />

          <Route element={<PublicRoute />}>
            <Route path="/auth" element={<AuthPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
