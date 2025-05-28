import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { CommentItem } from "./CommentItem";
import { useAuthStore } from "@/stores/auth.store";
import { useCommentsStore } from "@/stores/comments.store";
import type { CreateCommentRequest } from "@/types";
import { MessageCircle, Send } from "lucide-react";

interface CommentSectionProps {
  postId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [newComment, setNewComment] = useState("");
  const { isAuthenticated, user } = useAuthStore();

  // Zustand selectors for stable references
  const comments = useCommentsStore((s) => s.comments);
  const isLoading = useCommentsStore((s) => s.isLoading);
  const error = useCommentsStore((s) => s.error);
  const fetchCommentsByPost = useCommentsStore((s) => s.fetchCommentsByPost);
  const createComment = useCommentsStore((s) => s.createComment);
  const replyToComment = useCommentsStore((s) => s.replyToComment);
  const deleteComment = useCommentsStore((s) => s.deleteComment);
  const clearComments = useCommentsStore((s) => s.clearComments);

  // Fetch comments when postId changes
  useEffect(() => {
    if (postId) {
      fetchCommentsByPost(postId, 1);
    }
    return () => {
      clearComments();
    };
  }, [postId, fetchCommentsByPost, clearComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    try {
      const commentData: CreateCommentRequest = {
        content: newComment.trim(),
        postId,
      };
      await createComment(commentData);
      setNewComment("");
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    if (!isAuthenticated) return;
    try {
      await replyToComment({
        content,
        postId,
        parentId,
      });
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleDelete = async (commentId: string, parentId?: string) => {
    try {
      await deleteComment(commentId);
      // If you want to handle replies in a nested way, you may need to adjust your store logic
    } catch (error) {
      // Error is handled in the store
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="space-y-4">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                required
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading || !newComment.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4 mr-1" />
                  {isLoading ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="mb-6 p-4 bg-muted rounded-lg text-center">
            <p className="text-muted-foreground">
              Please log in to leave a comment.
            </p>
          </div>
        )}

        {/* Comments List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReply}
                onDelete={handleDelete}
                currentUserId={user?.id}
                isAdmin={user?.role === "ADMIN"}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
