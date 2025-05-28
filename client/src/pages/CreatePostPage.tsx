import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import { CreatePostForm } from "../components/blog/CreatePostForm";

export function CreatePostPage() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
        <CreatePostForm />
      </div>
    </div>
  );
}
