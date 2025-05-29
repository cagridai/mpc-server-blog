import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAuthStore } from "../stores/auth.store";
import { useUserStore } from "../stores/users.store";
import { postsService } from "../services/posts.service";
import type { Post } from "@/types";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { PostCard } from "../components/blog/PostCard";
import { User as UserIcon, Edit, Mail, Calendar } from "lucide-react";

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const {
    user,
    getUserByUsername,
    updateUser,
    loading: userLoading,
    error: userError,
  } = useUserStore();

  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
    avatar: "",
  });

  const isOwnProfile = isAuthenticated && currentUser?.username === username;

  useEffect(() => {
    if (!username) return;
    setPosts([]);
    setPostsLoading(true);
    setIsEditing(false);
    getUserByUsername(username);
  }, [username, getUserByUsername]);
  
  useEffect(() => {
    if (!user) {
      setPostsLoading(false);
      return;
    }
  
    if (isOwnProfile) {
      setEditForm({
        name: user.name || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
      });
    }
  
    postsService
      .getPosts({
        published: true,
        authorId: user.id,
        limit: 20,
      })
      .then((response) => {
        setPosts(response.posts);
      })
      .catch(() => {
        setPosts([]);
      })
      .finally(() => setPostsLoading(false));
  }, [user, isOwnProfile]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwnProfile || !user) return;
    try {
      await updateUser(user.id, {
        name: editForm.name,
        bio: editForm.bio,
        avatar: editForm.avatar,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (userLoading || postsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">
              {userError || "User not found."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || user.username}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <UserIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1">
              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <Input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Full name"
                  />
                  <Textarea
                    value={editForm.bio}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    placeholder="Bio"
                    rows={3}
                  />
                  <Input
                    value={editForm.avatar}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        avatar: e.target.value,
                      }))
                    }
                    placeholder="Avatar URL"
                  />
                  <div className="flex space-x-2">
                    <Button type="submit" size="sm">
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold">
                      {user.name || user.username}
                    </h1>
                    {isOwnProfile && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Profile
                      </Button>
                    )}
                  </div>

                  <p className="text-muted-foreground mb-4">@{user.username}</p>

                  {user.bio && (
                    <p className="text-foreground mb-4">{user.bio}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {user.email}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                    <Badge
                      variant={user.role === "ADMIN" ? "default" : "secondary"}
                    >
                      {user.role}
                    </Badge>
                  </div>

                  {user._count && (
                    <div className="flex space-x-6 mt-4">
                      <div>
                        <span className="font-bold">{user._count.posts}</span>
                        <span className="text-muted-foreground ml-1">
                          Posts
                        </span>
                      </div>
                      <div>
                        <span className="font-bold">
                          {user._count.comments}
                        </span>
                        <span className="text-muted-foreground ml-1">
                          Comments
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User's Posts */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          {isOwnProfile
            ? "Your Posts"
            : `Posts by ${user.name || user.username}`}
        </h2>

        {posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                {isOwnProfile
                  ? "You haven't written any posts yet."
                  : "This user hasn't written any posts yet."}
              </p>
              {isOwnProfile && (
                <Button asChild className="mt-4">
                  <a href="/write">Write Your First Post</a>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
