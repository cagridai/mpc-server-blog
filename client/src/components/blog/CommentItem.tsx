import React, { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import type { Comment } from "@/types";
import { formatDistance } from "date-fns";
import { Reply, Trash2, User } from "lucide-react";

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string, parentId?: string) => Promise<void>;
  currentUserId?: string;
  isAdmin?: boolean;
  level?: number;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onDelete,
  currentUserId,
  isAdmin,
  level = 0,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canDelete = currentUserId === comment.author.id || isAdmin;
  const maxLevel = 3; // Limit nesting depth

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      await onReply(comment.id, replyContent.trim());
      setReplyContent("");
      setIsReplying(false);
    } catch (error) {
      console.error("Failed to reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await onDelete(comment.id);
    }
  };

  return (
    <div className={`${level > 0 ? "ml-8 border-l-2 border-muted pl-4" : ""}`}>
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          {comment.author.avatar ? (
            <img
              src={comment.author.avatar}
              alt={comment.author.name || comment.author.username}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-sm font-medium">
              {comment.author.name || comment.author.username}
            </h4>
            <span className="text-xs text-muted-foreground">
              {formatDistance(new Date(comment.createdAt), new Date(), {
                addSuffix: true,
              })}
            </span>
          </div>

          <div className="text-sm mb-2 whitespace-pre-wrap">
            {comment.content}
          </div>

          <div className="flex items-center space-x-2">
            {level < maxLevel && currentUserId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(!isReplying)}
                className="text-xs"
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}

            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-xs text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            )}
          </div>

          {/* Reply Form */}
          {isReplying && (
            <form onSubmit={handleReply} className="mt-3">
              <div className="space-y-2">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={2}
                  required
                />
                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting || !replyContent.trim()}
                  >
                    {isSubmitting ? "Posting..." : "Post Reply"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsReplying(false);
                      setReplyContent("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onDelete={(replyId) => onDelete(replyId, comment.id)}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
