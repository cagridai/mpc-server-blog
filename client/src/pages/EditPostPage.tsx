import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import { usePostsStore } from "../stores/posts.store";
import { EditPostForm } from "../components/blog/EditPostForm";

export function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuthStore();
  const { currentPost, isLoading, fetchPostBySlug, clearCurrentPost } =
    usePostsStore();

  useEffect(() => {
    if (id) {
      fetchPostBySlug(id);
    }
    return () => clearCurrentPost();
  }, [id, fetchPostBySlug, clearCurrentPost]);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!currentPost) {
    return <Navigate to="/" replace />;
  }

  if (currentPost.authorId !== user?.id && user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
        <EditPostForm post={currentPost} />
      </div>
    </div>
  );
}
