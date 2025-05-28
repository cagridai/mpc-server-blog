import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { PostCard } from "../components/blog/PostCard";
import { postsService } from "../services/posts.service";
import { categoriesService } from "../services/categories.service";
import { tagsService } from "../services/tags.service";
import type { Post, Category, Tag } from "@/types";
import { Sparkles, TrendingUp, Calendar } from "lucide-react";

export const HomePage: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [
        featuredResponse,
        recentResponse,
        popularTagsData,
        categoriesData,
      ] = await Promise.all([
        postsService.getPosts({ published: true, limit: 3 }),
        postsService.getPosts({ published: true, limit: 6 }),
        tagsService.getPopularTags(),
        categoriesService.getCategories(),
      ]);

      // Filter featured posts
      const featured = featuredResponse.posts.filter((post) => post.featured);
      setFeaturedPosts(featured);
      setRecentPosts(recentResponse.posts);
      setPopularTags(popularTagsData.slice(0, 10));
      setCategories(categoriesData.slice(0, 8));
    } catch (error) {
      console.error("Failed to load homepage data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        {/* Hero Section Skeleton */}
        <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
              <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
            </div>
          </div>
        </section>

        {/* Content Skeleton */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Our Blog
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover amazing stories, insights, and knowledge from our community
            of writers. Join us on this journey of learning and sharing.
          </p>
          <Button asChild size="lg">
            <Link to="/posts">Explore Posts</Link>
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center mb-8">
              <Sparkles className="h-6 w-6 mr-2 text-primary" />
              <h2 className="text-3xl font-bold">Featured Posts</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-primary" />
                <h2 className="text-3xl font-bold">Recent Posts</h2>
              </div>
              <Button asChild variant="outline">
                <Link to="/posts">View All</Link>
              </Button>
            </div>

            {recentPosts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">
                    No posts available yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Popular Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                {popularTags.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No tags available.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="cursor-pointer"
                      >
                        <Link to={`/posts?tagId=${tag.id}`}>
                          {tag.name} ({tag._count?.posts || 0})
                        </Link>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {categories.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No categories available.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/posts?categoryId=${category.id}`}
                        className="block p-2 rounded hover:bg-muted transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{category.name}</span>
                          <Badge variant="outline">
                            {category._count?.posts || 0}
                          </Badge>
                        </div>
                        {category.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {category.description}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card>
              <CardHeader>
                <CardTitle>Stay Updated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the latest posts delivered right to your inbox.
                </p>
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-input rounded-md text-sm"
                  />
                  <Button className="w-full" size="sm">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
