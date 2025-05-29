import { useEffect } from "react";
import { Link } from "react-router-dom";
import { usePostsStore } from "../stores/posts.store";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";

export function PostsPage() {
  const { posts, isLoading, error, fetchPosts } = usePostsStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
          ))}
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
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-600 mb-4">
          No posts found
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
      <div className="space-y-6">
        {posts.posts.map((post) => (
          <div
            key={post.id}
            className="p-6 border rounded-lg shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 line-clamp-3 mb-4">{post.excerpt}</p>
            <Button asChild>
              <Link to={`/posts/${post.slug}`}>
                Read More <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
