import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { usePostsStore } from "../stores/posts.store";
import { useCategoriesStore } from "../stores/categories.store";
import { PostsList } from "../components/blog/PostsList";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const { posts, isLoading } = usePostsStore();
  const { categories, fetchCategories, fetchCategoriesById } =
    useCategoriesStore();
  const [currentCategory, setCurrentCategory] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchCategoriesById(id);
    }
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [id, fetchCategoriesById, fetchCategories, categories.length]);

  useEffect(() => {
    if (id && categories.length > 0) {
      const category = categories.find((cat) => cat.id === id);
      setCurrentCategory(category);
    }
  }, [id, categories]);

  if (!id) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {currentCategory ? currentCategory.name : "Category"}
        </h1>
        {currentCategory?.description && (
          <p className="text-gray-600">{currentCategory.description}</p>
        )}
      </div>

      <PostsList posts={posts} isLoading={isLoading} />
    </div>
  );
}
