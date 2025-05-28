import { User, Role } from '@prisma/client';

export type UserWithoutPassword = Omit<User, 'password'>;

export type UserWithCounts = Omit<User, 'password'> & {
  _count: {
    posts: number;
    comments: number;
  };
};

export type UserProfile = {
  id: string;
  email: string;
  username: string;
  name: string | null;
  bio: string | null;
  avatar: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    posts: number;
    comments: number;
  };
};
