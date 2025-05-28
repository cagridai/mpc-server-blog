import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthStore } from "./stores/auth.store";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { PostPage } from "./pages/PostPage";
import { CreatePostPage } from "./pages/CreatePostPage";
import { EditPostPage } from "./pages/EditPostPage";
import { AuthPage } from "./pages/AuthPage";
import { ProfilePage } from "./pages/ProfilePage";
import { CategoryPage } from "./pages/CategoryPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoadingSpinner } from "./components/common/LoadingSpinner";
import { PostsPage } from "@/pages/PostsPage.tsx";

function App() {
  const { initializeAuth, isLoading } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:slug" element={<PostPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditPostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:username"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
