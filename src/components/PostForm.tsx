import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema, type CreatePostFormData } from "../lib/validation";
import { useAuth } from "../hooks/useAuth";
import { usePosts } from "../hooks/usePosts";
import { Input, Button } from "./ui";

interface PostFormProps {
  onCancel?: () => void;
}

export const PostForm = ({ onCancel }: PostFormProps) => {
  const { username } = useAuth();
  const { createPost, isCreating } = usePosts();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      username: username || "",
    },
  });

  const titleValue = useWatch({ control, name: "title" }) ?? "";
  const contentValue = useWatch({ control, name: "content" }) ?? "";
  const isDisabled = !titleValue?.trim() || !contentValue?.trim();

  const onSubmit = (data: CreatePostFormData) => {
    createPost({ ...data, username: username! });
    reset();
  };

  return (
    <div className="bg-white rounded-2xl border border-[#999999] p-4 m-5 shadow-sm max-h-188">
      <h2 className="text-[22px] font-bold mb-4">What&apos;s on your mind?</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          {...register("title")}
          label="Title"
          type="text"
          placeholder="Hello world"
          error={errors.title?.message}
        />

        <Input
          {...register("content")}
          label="Content"
          textarea
          placeholder="Content here"
          className="max-h-18.5"
          rows={4}
          error={errors.content?.message}
        />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isDisabled || isCreating}>
            {isCreating ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
};
