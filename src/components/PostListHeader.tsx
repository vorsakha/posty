import type { SortOrder } from "../types";

interface PostListHeaderProps {
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

export const PostListHeader = ({
  sortOrder,
  onSortChange,
}: PostListHeaderProps) => {
  return (
    <div className="px-5 mb-4 flex items-center gap-2">
      <span className="text-[#777777]">Sort:</span>

      <select
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value as SortOrder)}
        className="px-2.5 py-1 border border-[#777777] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7695EC] cursor-pointer"
        aria-label="Sort posts by date"
      >
        <option value="newer">Newest first</option>
        <option value="older">Oldest first</option>
      </select>
    </div>
  );
};
