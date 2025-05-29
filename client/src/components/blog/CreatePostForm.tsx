import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { categoriesService } from "@/services/categories.service.ts";
import { tagsService } from "@/services/tags.service.ts";
import type {
  CreatePostRequest as CreatePostFormType,
  Category,
  Tag,
} from "../../types";
import { X, Plus } from "lucide-react";

export const CreatePostForm: React.FC = () => {
  const navigate = useNavigate();
  const { createPost, isLoading } = usePostsStore();

  const [form, setForm] = useState<CreatePostFormType>({
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

  useEffect(() => {
    loadData();
  }, []);

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
    try {
      // Handle empty categoryId properly
      const postData = {
        ...form,
        categoryId: form.categoryId === "none" ? undefined : form.categoryId,
        tagIds: selectedTags.map((tag) => tag.id),
      };

      const post = await createPost(postData);
      if (!post || !post.slug) {
        throw new Error("Post creation failed or missing slug.");
      }
      navigate(`/posts/${post.slug}`);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange =
    (name: keyof CreatePostFormType) => (checked: boolean) => {
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
    } finally {
      setIsCreatingTag(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
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

            {/* Category - FIXED */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={form.categoryId || "none"} // Default to "none" instead of empty string
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    categoryId: value === "none" ? "" : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Category</SelectItem>
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
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag.id)}
                      />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add Tags */}
              <div className="space-y-2">
                <Select
                  value="" // Always empty to show placeholder
                  onValueChange={(value) => {
                    const tag = tags.find((t) => t.id === value);
                    if (tag) addTag(tag);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add existing tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {(tags ?? [])
                      .filter(
                        (tag) => !selectedTags.find((t) => t.id === tag.id)
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
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), createNewTag())
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={createNewTag}
                    disabled={!newTag.trim() || isCreatingTag}
                  >
                    <Plus className="h-4 w-4" />
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
            </div>
          </CardContent>

          <CardFooter className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/posts")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
