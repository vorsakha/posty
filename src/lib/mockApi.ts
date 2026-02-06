import type {
  CreatePostPayload,
  Post,
  SortOrder,
  UpdatePostPayload,
} from "../types";

const STORAGE_KEY = "codeleap_posts";
const API_DELAY = 500;

const getStoredPosts = (): Post[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

const setStoredPosts = (posts: Post[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  getPosts: async (sortOrder: SortOrder = "newer"): Promise<Post[]> => {
    await delay(API_DELAY);
    const posts = getStoredPosts();

    return posts.sort((a, b) => {
      const aTime = new Date(a.created_datetime).getTime();
      const bTime = new Date(b.created_datetime).getTime();
      return sortOrder === "newer" ? bTime - aTime : aTime - bTime;
    });
  },

  createPost: async (payload: CreatePostPayload): Promise<Post> => {
    await delay(API_DELAY);

    const newPost: Post = {
      id: Date.now(),
      username: payload.username,
      created_datetime: new Date().toISOString(),
      title: payload.title,
      content: payload.content,
      likes: 0,
      likedBy: [],
    };

    const posts = getStoredPosts();
    posts.push(newPost);
    setStoredPosts(posts);

    return newPost;
  },

  updatePost: async (id: number, payload: UpdatePostPayload): Promise<Post> => {
    await delay(API_DELAY);

    const posts = getStoredPosts();
    const index = posts.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error("Post not found");
    }

    posts[index] = { ...posts[index], ...payload };
    setStoredPosts(posts);

    return posts[index];
  },

  deletePost: async (id: number): Promise<void> => {
    await delay(API_DELAY);

    const posts = getStoredPosts();
    const filtered = posts.filter((p) => p.id !== id);
    setStoredPosts(filtered);
  },

  toggleLike: async (postId: number, username: string): Promise<Post> => {
    await delay(API_DELAY);

    const posts = getStoredPosts();
    const index = posts.findIndex((p) => p.id === postId);

    if (index === -1) {
      throw new Error("Post not found");
    }

    const post = posts[index];
    const hasLiked = post.likedBy.includes(username);

    if (hasLiked) {
      posts[index] = {
        ...post,
        likes: post.likes - 1,
        likedBy: post.likedBy.filter((u) => u !== username),
      };
    } else {
      posts[index] = {
        ...post,
        likes: post.likes + 1,
        likedBy: [...post.likedBy, username],
      };
    }

    setStoredPosts(posts);

    return posts[index];
  },
};
