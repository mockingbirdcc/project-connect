import { useMemo, useState } from "react";
import { useApp, useCurrentUser } from "../store/AppContext";
import { canView } from "../lib/consent";
import PostCard from "../components/PostCard";
import PostComposer from "../components/PostComposer";

export default function Feed() {
  const { posts, connections, dismissPosts, undismissPost } = useApp();
  const currentUser = useCurrentUser();
  const [composerOpen, setComposerOpen] = useState(false);
  const [showDismissed, setShowDismissed] = useState(false);

  const consentedPosts = useMemo(() => {
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

  const visiblePosts = consentedPosts.filter((p) => !p.dismissedBy.includes(currentUser.id));
  const dismissedPosts = consentedPosts.filter((p) => p.dismissedBy.includes(currentUser.id));

  const isCaughtUp = consentedPosts.length > 0 && visiblePosts.length === 0;

  return (
    <div className="page feed-page">
      {visiblePosts.length > 0 && (
        <div className="feed-toolbar">
          <button
            className="btn-ghost small"
            onClick={() => dismissPosts({ postIds: visiblePosts.map((p) => p.id), userId: currentUser.id })}
          >
            I'm caught up — dismiss all
          </button>
        </div>
      )}

      {consentedPosts.length === 0 && (
        <div className="empty-state">
          <p>Nothing here yet. Conversations only show up for people they were meant for.</p>
        </div>
      )}

      {isCaughtUp && (
        <div className="caught-up-state">
          <div className="caught-up-icon">✓</div>
          <h2>You're all caught up</h2>
          <p>Nothing waiting on you right now. Come back whenever.</p>
        </div>
      )}

      <div className="post-list">
        {visiblePosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {dismissedPosts.length > 0 && (
        <div className="dismissed-section">
          <button className="dismissed-toggle" onClick={() => setShowDismissed((v) => !v)}>
            {showDismissed ? "Hide" : "Show"} {dismissedPosts.length} dismissed
          </button>
          {showDismissed && (
            <div className="dismissed-list">
              {dismissedPosts.map((post) => (
                <div className="dismissed-row" key={post.id}>
                  <span className="dismissed-content">{post.content}</span>
                  <button
                    className="btn-ghost small"
                    onClick={() => undismissPost({ postId: post.id, userId: currentUser.id })}
                  >
                    Undo
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="composer-trigger">
        <button className="composer-fake-input" onClick={() => setComposerOpen(true)}>
          Start New Conversation
        </button>
      </div>

      {composerOpen && <PostComposer onClose={() => setComposerOpen(false)} />}
    </div>
  );
}
