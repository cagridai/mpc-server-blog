import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Badge } from "../ui/badge";
import type { Post } from "@/types";
import { formatDistance } from "date-fns";
import { User, Calendar, MessageCircle, Eye } from "lucide-react";

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          {post.featured && <Badge variant="secondary">Featured</Badge>}
          <Badge variant={post.published ? "default" : "outline"}>
            {post.published ? "Published" : "Draft"}
          </Badge>
        </div>

        <CardTitle className="line-clamp-2">
          <Link
            to={`/posts/${post.slug}`}
            className="hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </CardTitle>

        {post.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-1 mb-3">
          {post.category && (
            <Badge variant="outline">{post.category.name}</Badge>
          )}
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="w-full space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="h-4 w-4 mr-1" />
            <span>{post.author.name || post.author.username}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {formatDistance(new Date(post.createdAt), new Date(), {
                  addSuffix: true,
                })}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                <span>{post.views}</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span>{post._count?.comments || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
