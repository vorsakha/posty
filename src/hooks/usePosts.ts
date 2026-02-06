import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "../lib/mockApi";
import type { CreatePostPayload, Post, SortOrder, UpdatePostPayload } from "../types";

interface ToggleLikePayload {
  postId: number;
  username: string;
}

export const usePosts = (sortOrder?: SortOrder) => {
  const queryClient = useQueryClient();

  const postsQuery = useQuery({
    queryKey: ["posts", sortOrder],
    queryFn: () => mockApi.getPosts(sortOrder),
  });

  const createPostMutation = useMutation({
    mutationFn: (payload: CreatePostPayload) => mockApi.createPost(payload),
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const optimisticPost: Post = {
        id: Date.now(),
        username: newPost.username,
        created_datetime: new Date().toISOString(),
        title: newPost.title,
        content: newPost.content,
        likes: 0,
        likedBy: [],
      };
      const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);
      queryClient.setQueryData(
        ["posts"],
        [optimisticPost, ...(previousPosts ?? [])],
      );

      return { previousPosts, optimisticId: optimisticPost.id };
    },
    onSuccess: (data, _variables, context) => {
      queryClient.setQueryData(
        ["posts"],
        (previous: Post[] | undefined) =>
          previous?.map((post) =>
            post.id === context?.optimisticId ? data : post,
          ) ?? [data],
      );
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["posts"], context?.previousPosts);
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdatePostPayload }) =>
      mockApi.updatePost(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);
      queryClient.setQueryData(
        ["posts"],
        previousPosts?.map((post) =>
          post.id === id ? { ...post, ...payload } : post,
        ) ?? [],
      );

      return { previousPosts };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["posts"], context?.previousPosts);
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (id: number) => mockApi.deletePost(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);
      queryClient.setQueryData(
        ["posts"],
        previousPosts?.filter((post) => post.id !== id) ?? [],
      );

      return { previousPosts };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["posts"], context?.previousPosts);
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: ({ postId, username }: ToggleLikePayload) =>
      mockApi.toggleLike(postId, username),
    onMutate: async ({ postId, username }) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);
      queryClient.setQueryData(
        ["posts"],
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

      return { previousPosts };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["posts"], context?.previousPosts);
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
