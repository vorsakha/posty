import { usePosts } from "../hooks/usePosts";
import { Button, Modal } from "./ui";

interface DeleteModalProps {
  postId: number;
  onClose: () => void;
}

export const DeleteModal = ({ postId, onClose }: DeleteModalProps) => {
  const { deletePost, isDeleting } = usePosts();

  const handleDelete = () => {
    deletePost(postId, { onSuccess: onClose });
  };

  return (
    <Modal>
      <div className="bg-white rounded-lg p-6 w-full max-w-165 min-h-36.5 shadow-lg">
        <h2 className="text-[22px] font-bold mb-8">
          Are you sure you want to delete this item?
        </h2>

        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
