import { useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { usePostsStore } from "../stores/posts.store";
import { PostDetail } from "../components/blog/PostDetail";
import { CommentSection } from "../components/blog/CommentSection";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";

export function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const currentPost = usePostsStore((state) => state.currentPost);
  const isLoading = usePostsStore((state) => state.isLoading);
  const error = usePostsStore((state) => state.error);
  const fetchPostBySlug = usePostsStore((state) => state.fetchPostBySlug);
  const clearCurrentPost = usePostsStore((state) => state.clearCurrentPost);

  useEffect(() => {
    if (slug) {
      fetchPostBySlug(slug);
    }
    return () => {
      clearCurrentPost();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-600 mb-4">
          Post not found
        </h1>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Posts
        </Link>
      </Button>

      <div className="max-w-4xl mx-auto">
        <PostDetail />
        <div className="mt-12">
          <CommentSection postId={currentPost.id} />
        </div>
      </div>
    </div>
  );
}
