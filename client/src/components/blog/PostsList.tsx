import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PostCard } from "./PostCard";
import { usePostsStore } from "@/stores/posts.store.ts";
import { categoriesService } from "@/services/categories.service.ts";
import { tagsService } from "@/services/tags.service.ts";
import type { Category, Tag, PostFilters, Post } from "@/types";
import { Search, Filter } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce.ts";

interface PostsListProps {
  posts?: Post[];
  isLoading?: boolean;
  showFilters?: boolean;
}

export const PostsList: React.FC<PostsListProps> = ({
  posts: externalPosts,
  isLoading: externalLoading,
  showFilters = true,
}) => {
  const {
    posts: storePosts,
    pagination,
    isLoading: storeLoading,
    error,
    fetchPosts,
  } = usePostsStore();

  // Use external posts if provided, otherwise use store posts
  const posts = externalPosts || storePosts;
  const isLoading =
    externalLoading !== undefined ? externalLoading : storeLoading;

  const [categories, setCategories] = useState<Category[]>([]);
  const [_tags, setTags] = useState<Tag[]>([]);
  const [filters, setFilters] = useState<PostFilters>({
    page: 1,
    limit: 12,
    search: "",
    categoryId: "",
    published: true, // Default to published posts only
  });
  const [localSearch, setLocalSearch] = useState("");

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    if (!externalPosts) {
      fetchPosts(filters);
    }
    if (showFilters) {
      loadFiltersData();
    }
  }, []);

  useEffect(() => {
    if (!externalPosts) {
      fetchPosts(filters);
    }
  }, [filters]);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      handleFilterChange({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  const loadFiltersData = async () => {
    try {
      const [categoriesData, tagsData] = await Promise.all([
        categoriesService.getCategories(),
        tagsService.getTags(),
      ]);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error("Failed to load filter data:", error);
    }
  };

  const handleFilterChange = (newFilters: Partial<PostFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (page: number) => {
    handleFilterChange({ page });
  };

  const clearFilters = () => {
    const clearedFilters: PostFilters = {
      page: 1,
      limit: 12,
      search: "",
      categoryId: "",
      published: true,
    };
    setFilters(clearedFilters);
    setLocalSearch("");
  };

  const hasActiveFilters =
    filters.search || filters.categoryId || filters.published !== true;

  if (isLoading && (!posts || posts.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => fetchPosts(filters)} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {showFilters && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">All Posts</h1>

          {/* Filters */}
          <div className="bg-muted/50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <Select
                value={filters.categoryId || ""}
                onValueChange={(value) =>
                  handleFilterChange({
                    categoryId: value || undefined,
                    page: 1,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select
                value={
                  filters.published === undefined
                    ? "all"
                    : filters.published.toString()
                }
                onValueChange={(value) => {
                  let published: boolean | undefined;
                  if (value === "all") published = undefined;
                  else if (value === "true") published = true;
                  else if (value === "false") published = false;
                  handleFilterChange({ published, page: 1 });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Posts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Posts</SelectItem>
                  <SelectItem value="true">Published</SelectItem>
                  <SelectItem value="false">Drafts</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters Button */}
              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
              >
                Clear Filters
              </Button>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex items-center space-x-2 flex-wrap">
                <Filter className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">
                  Active filters:
                </span>
                {filters.search && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    Search: {filters.search}
                  </span>
                )}
                {filters.categoryId && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    Category:{" "}
                    {categories.find((c) => c.id === filters.categoryId)?.name}
                  </span>
                )}
                {filters.published === false && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    Drafts Only
                  </span>
                )}
                {filters.published === undefined && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    All Posts
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {hasActiveFilters
              ? "No posts match your filters."
              : "No posts found."}
          </p>
          {hasActiveFilters && (
            <Button onClick={clearFilters} className="mt-4" variant="outline">
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination - only show if using store posts and not external posts */}
          {!externalPosts && pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>

              {/* Show page numbers with smart truncation */}
              {(() => {
                const { page, totalPages } = pagination;
                const pages = [];

                // Always show first page
                if (totalPages > 0) pages.push(1);

                // Show ellipsis if needed
                if (page > 3) pages.push("...");

                // Show current page and neighbors
                for (
                  let i = Math.max(2, page - 1);
                  i <= Math.min(totalPages - 1, page + 1);
                  i++
                ) {
                  if (!pages.includes(i)) pages.push(i);
                }

                // Show ellipsis if needed
                if (page < totalPages - 2) pages.push("...");

                // Always show last page if more than 1 page
                if (totalPages > 1 && !pages.includes(totalPages))
                  pages.push(totalPages);

                return pages.map((pageNum, index) =>
                  pageNum === "..." ? (
                    <span key={`ellipsis-${index}`} className="px-2">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={pageNum}
                      variant={
                        pagination.page === pageNum ? "default" : "outline"
                      }
                      onClick={() => handlePageChange(pageNum as number)}
                      size="sm"
                    >
                      {pageNum}
                    </Button>
                  ),
                );
              })()}

              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}

          {/* Results info */}
          {!externalPosts && pagination && (
            <div className="text-center mt-4 text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} posts
            </div>
          )}
        </>
      )}
    </div>
  );
};
