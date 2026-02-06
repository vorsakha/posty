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
      <span className="text-gray-700 text-sm">Sort:</span>

      <select
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value as SortOrder)}
        className="border border-gray-300 rounded px-2 py-1 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Sort posts by date"
      >
        <option value="newer">Newest first</option>
        <option value="older">Oldest first</option>
      </select>
    </div>
  );
};
