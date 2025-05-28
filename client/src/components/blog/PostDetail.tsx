import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { usePostsStore } from "@/stores/posts.store.ts";
import { useAuthStore } from "@/stores/auth.store.ts";
import { formatDistance } from "date-fns";
import { User, Calendar, Eye, Edit, Trash2, Share2 } from "lucide-react";

export const PostDetail: React.FC = () => {
  const navigate = useNavigate();
  const currentPost = usePostsStore((state) => state.currentPost);
  const deletePost = usePostsStore((state) => state.deletePost);

  const { user, isAuthenticated } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !currentPost ||
      !window.confirm("Are you sure you want to delete this post?")
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deletePost(currentPost.id);
      navigate("/posts");
    } catch (error) {
      console.error("Error deleting post:", error);
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    if (!currentPost) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: currentPost.title,
          text: currentPost.excerpt || "",
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Don't render anything if no post - PostPage handles loading states
  if (!currentPost) {
    return null;
  }

  const canEdit =
    isAuthenticated &&
    (user?.id === currentPost.author.id || user?.role === "ADMIN");

  return (
    <div className="max-w-4xl mx-auto">
      {/* Post Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {currentPost.featured && (
              <Badge variant="secondary">Featured</Badge>
            )}
            <Badge variant={currentPost.published ? "default" : "outline"}>
              {currentPost.published ? "Published" : "Draft"}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>

            {canEdit && (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link to={`/edit/${currentPost.id}`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </>
            )}
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4">{currentPost.title}</h1>

        {currentPost.excerpt && (
          <p className="text-xl text-muted-foreground mb-6">
            {currentPost.excerpt}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <Link
              to={`/author/${currentPost.author.username}`}
              className="hover:text-foreground"
            >
              {currentPost.author.name || currentPost.author.username}
            </Link>
          </div>

          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {formatDistance(new Date(currentPost.createdAt), new Date(), {
                addSuffix: true,
              })}
            </span>
          </div>

          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            <span>{currentPost._count?.comments || 0} comments</span>
          </div>
        </div>

        {/* Tags and Category */}
        <div className="flex flex-wrap gap-2 mb-8">
          {currentPost.category && (
            <Badge variant="outline">{currentPost.category.name}</Badge>
          )}
          {currentPost.tags?.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
      </header>

      {/* Post Content */}
      <Card className="mb-8">
        <CardContent className="prose prose-lg max-w-none p-8">
          <div
            dangerouslySetInnerHTML={{ __html: currentPost.content }}
            className="whitespace-pre-wrap"
          />
        </CardContent>
      </Card>
    </div>
  );
};
