import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "../lib/mockApi";
import type {
  CreatePostPayload,
  Post,
  SortOrder,
  UpdatePostPayload,
} from "../types";

interface ToggleLikePayload {
  postId: number;
  username: string;
}

const ALL_ORDERS: SortOrder[] = ["newer", "older"];

const sortPosts = (posts: Post[], order: SortOrder): Post[] => {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.created_datetime).getTime();
    const dateB = new Date(b.created_datetime).getTime();
    return order === "newer" ? dateB - dateA : dateA - dateB;
  });
};

const getCachedOrders = (
  queryClient: ReturnType<typeof useQueryClient>,
): SortOrder[] => {
  return ALL_ORDERS.filter(
    (order) => queryClient.getQueryData<Post[]>(["posts", order]) !== undefined,
  );
};

export const usePosts = (sortOrder?: SortOrder) => {
  const queryClient = useQueryClient();

  const postsQuery = useQuery({
    queryKey: ["posts", sortOrder],
    queryFn: () => mockApi.getPosts(sortOrder),
  });

  const createPostMutation = useMutation({
    mutationFn: (payload: CreatePostPayload) => mockApi.createPost(payload),
    onMutate: async (newPost) => {
      const optimisticPost: Post = {
        id: Date.now(),
        username: newPost.username,
        created_datetime: new Date().toISOString(),
        title: newPost.title,
        content: newPost.content,
        likes: 0,
        likedBy: [],
      };

      const previousCaches: Record<string, Post[]> = {};
      const cachedOrders = getCachedOrders(queryClient);

      for (const order of cachedOrders) {
        await queryClient.cancelQueries({ queryKey: ["posts", order] });

        const previousPosts = queryClient.getQueryData<Post[]>([
          "posts",
          order,
        ]);
        previousCaches[order] = previousPosts ?? [];

        queryClient.setQueryData(
          ["posts", order],
          sortPosts([optimisticPost, ...(previousPosts ?? [])], order),
        );
      }

      for (const order of ALL_ORDERS) {
        if (!cachedOrders.includes(order)) {
          queryClient.invalidateQueries({ queryKey: ["posts", order] });
        }
      }

      return { previousCaches, optimisticId: optimisticPost.id };
    },
    onSuccess: (data, _variables, context) => {
      const cachedOrders = getCachedOrders(queryClient);

      for (const order of cachedOrders) {
        queryClient.setQueryData(
          ["posts", order],
          (previous: Post[] | undefined) =>
            sortPosts(
              previous?.map((post) =>
                post.id === context?.optimisticId ? data : post,
              ) ?? [data],
              order,
            ),
        );
      }

      for (const order of ALL_ORDERS) {
        if (!cachedOrders.includes(order)) {
          queryClient.invalidateQueries({ queryKey: ["posts", order] });
        }
      }
    },
    onError: (_, __, context) => {
      if (context?.previousCaches) {
        Object.entries(context.previousCaches).forEach(([order, posts]) => {
          queryClient.setQueryData(["posts", order], posts);
        });
      }
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdatePostPayload }) =>
      mockApi.updatePost(id, payload),
    onMutate: async ({ id, payload }) => {
      const previousCaches: Record<string, Post[]> = {};
      const cachedOrders = getCachedOrders(queryClient);

      for (const order of cachedOrders) {
        await queryClient.cancelQueries({ queryKey: ["posts", order] });

        const previousPosts = queryClient.getQueryData<Post[]>([
          "posts",
          order,
        ]);
        previousCaches[order] = previousPosts ?? [];

        queryClient.setQueryData(
          ["posts", order],
          previousPosts?.map((post) =>
            post.id === id ? { ...post, ...payload } : post,
          ) ?? [],
        );
      }

      for (const order of ALL_ORDERS) {
        if (!cachedOrders.includes(order)) {
          queryClient.invalidateQueries({ queryKey: ["posts", order] });
        }
      }

      return { previousCaches };
    },
    onError: (_, __, context) => {
      if (context?.previousCaches) {
        Object.entries(context.previousCaches).forEach(([order, posts]) => {
          queryClient.setQueryData(["posts", order], posts);
        });
      }
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (id: number) => mockApi.deletePost(id),
    onMutate: async (id) => {
      const previousCaches: Record<string, Post[]> = {};
      const cachedOrders = getCachedOrders(queryClient);

      for (const order of cachedOrders) {
        await queryClient.cancelQueries({ queryKey: ["posts", order] });

        const previousPosts = queryClient.getQueryData<Post[]>([
          "posts",
          order,
        ]);
        previousCaches[order] = previousPosts ?? [];

        queryClient.setQueryData(
          ["posts", order],
          previousPosts?.filter((post) => post.id !== id) ?? [],
        );
      }

      for (const order of ALL_ORDERS) {
        if (!cachedOrders.includes(order)) {
          queryClient.invalidateQueries({ queryKey: ["posts", order] });
        }
      }

      return { previousCaches };
    },
    onError: (_, __, context) => {
      if (context?.previousCaches) {
        Object.entries(context.previousCaches).forEach(([order, posts]) => {
          queryClient.setQueryData(["posts", order], posts);
        });
      }
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: ({ postId, username }: ToggleLikePayload) =>
      mockApi.toggleLike(postId, username),
    onMutate: async ({ postId, username }) => {
      const previousCaches: Record<string, Post[]> = {};
      const cachedOrders = getCachedOrders(queryClient);

      for (const order of cachedOrders) {
        await queryClient.cancelQueries({ queryKey: ["posts", order] });

        const previousPosts = queryClient.getQueryData<Post[]>([
          "posts",
          order,
        ]);
        previousCaches[order] = previousPosts ?? [];

        queryClient.setQueryData(
          ["posts", order],
          previousPosts?.map((post) => {
            if (post.id === postId) {
              const hasLiked = post.likedBy.includes(username);

              return {
                ...post,
                likes: hasLiked ? post.likes - 1 : post.likes + 1,
                likedBy: hasLiked
                  ? post.likedBy.filter((u) => u !== username)
                  : [...post.likedBy, username],
              };
            }

            return post;
          }) ?? [],
        );
      }

      for (const order of ALL_ORDERS) {
        if (!cachedOrders.includes(order)) {
          queryClient.invalidateQueries({ queryKey: ["posts", order] });
        }
      }

      return { previousCaches };
    },
    onError: (_, __, context) => {
      if (context?.previousCaches) {
        Object.entries(context.previousCaches).forEach(([order, posts]) => {
          queryClient.setQueryData(["posts", order], posts);
        });
      }
    },
  });

  return {
    posts: postsQuery.data ?? [],
    isLoading: postsQuery.isLoading,
    createPost: createPostMutation.mutate,
    isCreating: createPostMutation.isPending,
    updatePost: updatePostMutation.mutate,
    isUpdating: updatePostMutation.isPending,
    deletePost: (id: number, options?: { onSuccess?: () => void }) =>
      deletePostMutation.mutate(id, options),
    isDeleting: deletePostMutation.isPending,
    toggleLike: toggleLikeMutation.mutate,
    isTogglingLike: toggleLikeMutation.isPending,
  };
};
