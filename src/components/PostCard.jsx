import { Link } from "react-router-dom";
import { POST_INTENTS, AUDIENCE_OPTIONS } from "../data/seed";
import { useApp } from "../store/AppContext";
import Avatar from "./Avatar";

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function PostCard({ post }) {
  const { users } = useApp();
  const author = users.find((u) => u.id === post.authorId);
  const intent = POST_INTENTS.find((i) => i.id === post.intent);
  const audience = AUDIENCE_OPTIONS.find((a) => a.id === post.audience);

  if (!author) return null;

  return (
    <article className="post-card">
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
            {intent.emoji} {intent.label}
          </span>
        )}
      </div>

      <p className="post-content">{post.content}</p>

      <div className="post-footer">
        <span className="audience-note">
          👁 Visible to: {audience ? audience.label : "Specific people"}
        </span>
      </div>
    </article>
  );
}
