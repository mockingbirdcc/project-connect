import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useApp, useCurrentUser } from "../store/AppContext";
import { canView, relationshipStatus, findConnectionBetween } from "../lib/consent";
import Avatar from "../components/Avatar";
import TierBadge from "../components/TierBadge";
import PostCard from "../components/PostCard";
import ConnectModal from "../components/ConnectModal";

export default function Profile() {
  const { userId } = useParams();
  const { users, posts, connections } = useApp();
  const currentUser = useCurrentUser();
  const [connectOpen, setConnectOpen] = useState(false);

  const profileUser = users.find((u) => u.id === userId);

  const status = currentUser ? relationshipStatus(currentUser.id, userId, connections) : "none";
  const edge = currentUser ? findConnectionBetween(currentUser.id, userId, connections) : null;

  const postHistory = useMemo(() => {
    if (!profileUser || !currentUser) return [];
    return posts
      .filter((p) => p.authorId === profileUser.id)
      .filter((p) =>
        canView(
          { viewerId: currentUser.id, authorId: p.authorId, audience: p.audience, customAudienceIds: p.customAudienceIds },
          connections
        )
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [posts, connections, profileUser, currentUser]);

  if (!profileUser) {
    return <div className="page"><p>No such profile.</p></div>;
  }

  const isSelf = profileUser.id === currentUser?.id;

  return (
    <div className="page profile-page">
      <div className="profile-header">
        <Avatar user={profileUser} size={88} />
        <div className="profile-header-info">
          <h1>{profileUser.name}</h1>
          <p className="profile-bio">{profileUser.bio}</p>
          {status === "connected" && edge && (
            <div className="connection-status connected">
              <TierBadge tier={edge.tier} /> connection
            </div>
          )}
        </div>

        {!isSelf && (
          <div className="profile-action">
            {status === "none" && (
              <button className="btn-primary" onClick={() => setConnectOpen(true)}>
                Connect
              </button>
            )}
            {status === "pending_sent" && (
              <span className="pill pending">Invitation sent — waiting on {profileUser.name.split(" ")[0]}</span>
            )}
            {status === "pending_received" && edge && (
              <div className="inline-respond">
                <span className="pill pending">{profileUser.name.split(" ")[0]} wants to connect</span>
                <Link className="btn-primary small" to="/invitations">
                  Review invitation
                </Link>
              </div>
            )}
            {status === "connected" && (
              <span className="pill connected-pill">Connected</span>
            )}
          </div>
        )}
      </div>

      <h2 className="section-title">Post History</h2>
      {postHistory.length === 0 ? (
        <div className="empty-state">
          <p>
            {isSelf
              ? "You haven't shared anything yet."
              : status === "connected"
              ? "Nothing shared at a level you can see yet."
              : "Connect to see what they've shared with people like you."}
          </p>
        </div>
      ) : (
        <div className="post-list">
          {postHistory.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {connectOpen && <ConnectModal targetUser={profileUser} onClose={() => setConnectOpen(false)} />}
    </div>
  );
}
