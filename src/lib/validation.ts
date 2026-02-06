import { z } from 'zod';

export const createPostSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

export const updatePostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

export const usernameSchema = z.object({
  username: z.string().min(1, 'Username is required'),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type UpdatePostFormData = z.infer<typeof updatePostSchema>;
export type UsernameFormData = z.infer<typeof usernameSchema>;
