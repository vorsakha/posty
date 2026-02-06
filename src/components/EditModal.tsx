import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePostSchema, type UpdatePostFormData } from "../lib/validation";
import { usePosts } from "../hooks/usePosts";
import type { Post } from "../types";
import { Input, Button, Modal } from "./ui";

interface EditModalProps {
  post: Post;
  onClose: () => void;
}

export const EditModal = ({ post, onClose }: EditModalProps) => {
  const { updatePost, isUpdating } = usePosts();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<UpdatePostFormData>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
    },
  });

  const titleValue = useWatch({ control, name: "title" }) ?? "";
  const contentValue = useWatch({ control, name: "content" }) ?? "";
  const isDisabled = !titleValue?.trim() || !contentValue?.trim();

  const onSubmit = (data: UpdatePostFormData) => {
    updatePost({ id: post.id, payload: data });

    onClose();
  };

  return (
    <Modal>
      <div className="bg-white rounded-lg p-6 w-full max-w-165 max-h-83.5 shadow-lg">
        <h2 className="text-[22px] font-bold mb-4">Edit post</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register("title")}
            label="Title"
            placeholder="Hello world"
            type="text"
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

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              className="border border-black"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="success"
              disabled={isDisabled || isUpdating}
            >
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
