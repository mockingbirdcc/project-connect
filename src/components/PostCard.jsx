import { useState } from "react";
import { Link } from "react-router-dom";
import { POST_INTENTS } from "../data/seed";
import { useApp, useCurrentUser } from "../store/AppContext";
import { audienceUserIds } from "../lib/consent";
import Avatar from "./Avatar";
import MessageModal from "./MessageModal";

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function PostCard({ post, showDismiss = true }) {
  const { users, connections, toggleReaction, addComment, dismissPost } = useApp();
  const currentUser = useCurrentUser();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messageOpen, setMessageOpen] = useState(false);

  const author = users.find((u) => u.id === post.authorId);
  const intent = POST_INTENTS.find((i) => i.id === post.intent);

  if (!author) return null;

  const visibleUsers = audienceUserIds(
    { authorId: post.authorId, audience: post.audience, customAudienceIds: post.customAudienceIds, hiddenFromIds: post.hiddenFromIds },
    connections
  )
    .map((id) => users.find((u) => u.id === id))
    .filter(Boolean);

  const iReacted = post.reactions.some((r) => r.userId === currentUser.id);
  const hasAnyReplyOption = post.allowReact || post.allowComment || post.allowMessage;

  function handleDismiss() {
    dismissPost({ postId: post.id, userId: currentUser.id });
  }

  function handleSubmitComment() {
    if (!draft.trim()) return;
    addComment({ postId: post.id, authorId: currentUser.id, content: draft.trim() });
    setDraft("");
  }

  return (
    <article className="post-card">
      {showDismiss && (
        <button className="dismiss-btn" onClick={handleDismiss} title="Dismiss this conversation" aria-label="Dismiss">
          ×
        </button>
      )}

      <div className="post-card-header">
        <Link to={`/profile/${author.id}`} className="post-author-link">
          <Avatar user={author} size={42} />
          <div>
            <div className="post-author-name">{author.name}</div>
            <div className="post-meta">{timeAgo(post.createdAt)}</div>
          </div>
        </Link>
        {intent && (
          <span className="intent-chip" title={intent.hint}>
            <span className="intent-chip-dot">{intent.emoji}</span> {intent.label}
          </span>
        )}
      </div>

      <p className="post-content">{post.content}</p>

      <div className="post-footer">
        <div className="audience-pictograph">
          <span className="audience-label">Visible to</span>
          <span className="audience-avatars">
            {visibleUsers.length === 0 ? (
              <span className="avatar-empty-note">Just you, for now</span>
            ) : (
              visibleUsers.slice(0, 6).map((u) => <Avatar key={u.id} user={u} size={22} />)
            )}
            {visibleUsers.length > 6 && <span className="avatar-overflow">+{visibleUsers.length - 6}</span>}
          </span>
        </div>
      </div>

      {hasAnyReplyOption ? (
        <div className="reply-bar">
          {post.allowReact && (
            <button
              className={`reply-btn ${iReacted ? "active" : ""}`}
              onClick={() => toggleReaction({ postId: post.id, userId: currentUser.id, emoji: "👍" })}
            >
              👍 React{post.reactions.length > 0 ? ` · ${post.reactions.length}` : ""}
            </button>
          )}
          {post.allowComment && (
            <button className={`reply-btn ${commentsOpen ? "active" : ""}`} onClick={() => setCommentsOpen((v) => !v)}>
              💬 Comment{post.comments.length > 0 ? ` · ${post.comments.length}` : ""}
            </button>
          )}
          {post.allowMessage && (
            <button className="reply-btn" onClick={() => setMessageOpen(true)}>
              📤 Message
            </button>
          )}
        </div>
      ) : (
        <div className="reply-bar reply-bar-closed">This conversation isn't open for replies.</div>
      )}

      {post.allowComment && commentsOpen && (
        <div className="comment-thread">
          {post.comments.map((c) => {
            const commenter = users.find((u) => u.id === c.authorId);
            return (
              <div className="comment-row" key={c.id}>
                <Avatar user={commenter} size={28} />
                <div className="comment-bubble">
                  <span className="comment-author">{commenter?.name}</span>
                  <span>{c.content}</span>
                </div>
              </div>
            );
          })}
          <div className="comment-composer">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a comment..."
              onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
            />
            <button className="btn-primary small" onClick={handleSubmitComment} disabled={!draft.trim()}>
              Reply
            </button>
          </div>
        </div>
      )}

      {messageOpen && <MessageModal recipient={author} post={post} onClose={() => setMessageOpen(false)} />}
    </article>
  );
}
