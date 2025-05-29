export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  role: "USER" | "ADMIN";
  bio?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    comments: any;
    posts: number;
  };
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
  };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
  };
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  published: boolean;
  featured: boolean;
  authorId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  author: User;
  category: Category;
  tags: Tag[];
  comments: Comment[];
  _count?: {
    comments: number;
  };
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  children?: Comment[];
  parent?: Comment;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  name: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  excerpt?: string;
  published: boolean;
  featured: boolean;
  categoryId: string;
  tagIds: string[];
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  published?: boolean;
  featured?: boolean;
  categoryId?: string;
  tagIds?: string[];
}

export interface CreateCommentRequest {
  content: string;
  postId: string;
  parentId?: string;
}

export interface UpdateUserRequest {
  name?: string;
  bio?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PostFilters extends PaginationParams {
  categoryId?: string;
  published?: boolean;
  featured?: boolean;
  authorId?: string;
}

export interface CommentFilters extends PaginationParams {
  postId: string;
  includeReplies?: boolean;
}
