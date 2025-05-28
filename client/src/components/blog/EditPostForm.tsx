import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { usePostsStore } from "@/stores/posts.store.ts";
import { useAuthStore } from "@/stores/auth.store.ts";
import { categoriesService } from "@/services/categories.service.ts";
import { tagsService } from "@/services/tags.service.ts";
import { postsService } from "@/services/posts.service.ts";
import type { UpdatePostRequest, Category, Tag, Post } from "@/types";
import { X, Plus, ArrowLeft } from "lucide-react";

interface EditPostFormProps {
  post?: Post;
}

export const EditPostForm: React.FC<EditPostFormProps> = ({
  post: initialPost,
}) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { updatePost, isLoading } = usePostsStore();
  const { user } = useAuthStore();

  const [post, setPost] = useState<Post | null>(initialPost || null);
  const [form, setForm] = useState<UpdatePostRequest>({
    title: "",
    content: "",
    excerpt: "",
    published: false,
    featured: false,
    categoryId: "",
    tagIds: [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(!initialPost);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPost) {
      initializeForm(initialPost);
    } else if (slug) {
      loadPost();
    }
    loadData();
  }, [slug, initialPost]);

  const initializeForm = (postData: Post) => {
    // Check if user can edit this post
    if (user?.id !== postData.authorId && user?.role !== "ADMIN") {
      navigate("/");
      return;
    }

    setPost(postData);
    setForm({
      title: postData.title,
      content: postData.content,
      excerpt: postData.excerpt || "",
      published: postData.published,
      featured: postData.featured,
      categoryId: postData.categoryId || "",
      tagIds: postData.tags.map((tag) => tag.id),
    });
    setSelectedTags(postData.tags);
  };

  const loadPost = async () => {
    if (!slug) return;

    setIsLoadingPost(true);
    setError(null);
    try {
      const postData = await postsService.getPostBySlug(slug);
      initializeForm(postData);
    } catch (error) {
      console.error("Failed to load post:", error);
      setError(error instanceof Error ? error.message : "Failed to load post");
    } finally {
      setIsLoadingPost(false);
    }
  };

  const loadData = async () => {
    try {
      const [categoriesData, tagsData] = await Promise.all([
        categoriesService.getCategories(),
        tagsService.getTags(),
      ]);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    try {
      await updatePost(post.id, {
        ...form,
        tagIds: selectedTags.map((tag) => tag.id),
      });
      navigate(`/post/${post.slug}`);
    } catch (error) {
      console.error("Failed to update post:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update post",
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange =
    (name: keyof UpdatePostRequest) => (checked: boolean) => {
      setForm((prev) => ({ ...prev, [name]: checked }));
    };

  const addTag = (tag: Tag) => {
    if (!selectedTags.find((t) => t.id === tag.id)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const removeTag = (tagId: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  const createNewTag = async () => {
    if (!newTag.trim()) return;

    setIsCreatingTag(true);
    try {
      const tag = await tagsService.createTag({ name: newTag.trim() });
      setTags((prev) => [...prev, tag]);
      addTag(tag);
      setNewTag("");
    } catch (error) {
      console.error("Failed to create tag:", error);
      setError(error instanceof Error ? error.message : "Failed to create tag");
    } finally {
      setIsCreatingTag(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      createNewTag();
    }
  };

  if (isLoadingPost) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-destructive mb-4">Post not found</p>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title *
              </label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter post title"
                required
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <label htmlFor="excerpt" className="text-sm font-medium">
                Excerpt
              </label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="Brief description of the post"
                rows={2}
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content *
              </label>
              <Textarea
                id="content"
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Write your post content here..."
                rows={15}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={form.categoryId}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, categoryId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>

              {/* Selected Tags */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag.name}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeTag(tag.id)}
                      />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add Tags */}
              <div className="space-y-2">
                <Select
                  onValueChange={(value) => {
                    const tag = tags.find((t) => t.id === value);
                    if (tag) addTag(tag);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add existing tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags
                      .filter(
                        (tag) => !selectedTags.find((t) => t.id === tag.id),
                      )
                      .map((tag) => (
                        <SelectItem key={tag.id} value={tag.id}>
                          {tag.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {/* Create New Tag */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Create new tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={createNewTag}
                    disabled={!newTag.trim() || isCreatingTag}
                  >
                    {isCreatingTag ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Settings</h3>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Published</label>
                  <p className="text-xs text-muted-foreground">
                    Make this post visible to everyone
                  </p>
                </div>
                <Switch
                  checked={form.published}
                  onCheckedChange={handleSwitchChange("published")}
                />
              </div>

              {user?.role === "ADMIN" && (
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Featured</label>
                    <p className="text-xs text-muted-foreground">
                      Highlight this post on the homepage
                    </p>
                  </div>
                  <Switch
                    checked={form.featured}
                    onCheckedChange={handleSwitchChange("featured")}
                  />
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/post/${post.slug}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
