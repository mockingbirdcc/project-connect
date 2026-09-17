import { useMemo, useState } from "react";
import { useApp, useCurrentUser } from "../store/AppContext";
import { canView } from "../lib/consent";
import PostCard from "../components/PostCard";
import PostComposer from "../components/PostComposer";
import Avatar from "../components/Avatar";

export default function Feed() {
  const { posts, connections } = useApp();
  const currentUser = useCurrentUser();
  const [composerOpen, setComposerOpen] = useState(false);

  const visiblePosts = useMemo(() => {
    if (!currentUser) return [];
    return posts
      .filter((post) =>
        canView(
          { viewerId: currentUser.id, authorId: post.authorId, audience: post.audience, customAudienceIds: post.customAudienceIds },
          connections
        )
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [posts, connections, currentUser]);

  return (
    <div className="page feed-page">
      <div className="composer-trigger">
        <Avatar user={currentUser} size={40} />
        <button className="composer-fake-input" onClick={() => setComposerOpen(true)}>
          Share something with the people who should see it...
        </button>
      </div>

      {visiblePosts.length === 0 && (
        <div className="empty-state">
          <p>Nothing here yet. Posts only show up for people they were meant for.</p>
        </div>
      )}

      <div className="post-list">
        {visiblePosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {composerOpen && <PostComposer onClose={() => setComposerOpen(false)} />}
    </div>
  );
}
