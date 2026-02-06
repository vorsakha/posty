import { useState } from "react";
import { Heart } from "lucide-react";
import { formatRelativeTime } from "../utils/time";
import { useAuth } from "../hooks/useAuth";
import { usePosts } from "../hooks/usePosts";
import { EditModal } from "./EditModal";
import { DeleteModal } from "./DeleteModal";
import type { Post } from "../types";
import EditIcon from "../assets/edit.svg?react";
import DeleteIcon from "../assets/delete.svg?react";

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const { username: currentUsername } = useAuth();
  const { toggleLike } = usePosts();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const isOwner = post.username === currentUsername;
  const isLiked = post.likedBy.includes(currentUsername || "");

  const handleToggleLike = () => {
    toggleLike({ postId: post.id, username: currentUsername! });
  };

  return (
    <>
      <article className="bg-white rounded-lg overflow-hidden shadow-sm border border-[#999999]">
        <div className="bg-[#7695EC] px-4 py-3 flex items-center justify-between min-h-17.5">
          <h3 className="text-white font-bold text-[22px] flex-1">
            {post.title}
          </h3>

          {isOwner && (
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => setIsDeleteOpen(true)}
                className="text-white hover:opacity-70 transition-opacity p-1 cursor-pointer"
                aria-label="Delete post"
              >
                <DeleteIcon />
              </button>
              <button
                onClick={() => setIsEditOpen(true)}
                className="text-white hover:opacity-70 transition-opacity p-1 cursor-pointer"
                aria-label="Edit post"
              >
                <EditIcon />
              </button>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-[#777777] text-[18px] font-bold">
              @{post.username}
            </span>
            <span className="text-[#777777] text-[18px]">
              {formatRelativeTime(post.created_datetime)}
            </span>
          </div>

          <p className="text-black text-[18px] leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>

          <button
            onClick={handleToggleLike}
            className="mt-4 flex items-center gap-2 text-[#777777] hover:text-red-500 transition-colors cursor-pointer"
            aria-label={isLiked ? "Unlike post" : "Like post"}
          >
            <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
            <span className="text-[18px]">{post.likes}</span>
          </button>
        </div>
      </article>

      {isEditOpen && (
        <EditModal post={post} onClose={() => setIsEditOpen(false)} />
      )}
      {isDeleteOpen && (
        <DeleteModal postId={post.id} onClose={() => setIsDeleteOpen(false)} />
      )}
    </>
  );
};
