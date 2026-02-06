import { useState } from "react";
import type { SortOrder } from "./types";
import { useAuth } from "./hooks/useAuth";
import { usePosts } from "./hooks/usePosts";
import { SignupModal } from "./components/SignupModal";
import { Header } from "./components/Header";
import { PostForm } from "./components/PostForm";
import { PostListHeader } from "./components/PostListHeader";
import { PostCard } from "./components/PostCard";

function App() {
  const { username } = useAuth();
  const [sortOrder, setSortOrder] = useState<SortOrder>("newer");
  const { posts, isLoading } = usePosts(sortOrder);

  if (!username) {
    return <SignupModal />;
  }

  return (
    <div className="min-h-screen bg-[#DDDDDD]">
      <main className="bg-white container mx-auto max-w-200 min-h-screen pb-5">
        <Header />
        <PostForm />
        <PostListHeader sortOrder={sortOrder} onSortChange={setSortOrder} />

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No posts yet.</div>
        ) : (
          <div className="space-y-4 px-5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
