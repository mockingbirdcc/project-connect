import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp, useCurrentUser } from "../store/AppContext";
import { TIERS } from "../data/seed";
import Avatar from "../components/Avatar";
import TierBadge from "../components/TierBadge";

function InvitationCard({ invite, sender }) {
  const { respondToInvite } = useApp();
  const [grantedTier, setGrantedTier] = useState(invite.requestedTier);
  const [responded, setResponded] = useState(false);

  if (responded) return null;

  return (
    <div className="invitation-card">
      <div className="invitation-header">
        <Link to={`/profile/${sender.id}`}>
          <Avatar user={sender} size={48} />
        </Link>
        <div>
          <Link to={`/profile/${sender.id}`} className="invitation-name">{sender.name}</Link>
          <div className="post-meta">wants to connect</div>
        </div>
      </div>

      <div className="invitation-detail">
        <div className="invitation-row">
          <span>Their reason</span>
          <strong>{invite.intention}</strong>
        </div>
        <div className="invitation-row">
          <span>Requested level</span>
          <TierBadge tier={invite.requestedTier} />
        </div>
        {invite.note && (
          <div className="invitation-note">"{invite.note}"</div>
        )}
      </div>

      <div className="invitation-grant">
        <p className="modal-subtext">You decide the actual level — accept as asked, or set it lower.</p>
        <div className="tier-picker">
          {Object.entries(TIERS).map(([key, tier]) => (
            <button
              key={key}
              type="button"
              className={`tier-pick-btn ${grantedTier === key ? "selected" : ""}`}
              onClick={() => setGrantedTier(key)}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      <div className="invitation-actions">
        <button
          className="btn-ghost"
          onClick={() => {
            respondToInvite({ connectionId: invite.id, decision: "decline" });
            setResponded(true);
          }}
        >
          Decline
        </button>
        <button
          className="btn-primary"
          onClick={() => {
            respondToInvite({ connectionId: invite.id, decision: "accept", grantedTier });
            setResponded(true);
          }}
        >
          Accept as {TIERS[grantedTier].label}
        </button>
      </div>
    </div>
  );
}

export default function Invitations() {
  const { connections, users } = useApp();
  const currentUser = useCurrentUser();

  const received = connections.filter((c) => c.status === "pending" && c.toId === currentUser.id);
  const sent = connections.filter((c) => c.status === "pending" && c.fromId === currentUser.id);

  return (
    <div className="page">
      <h1 className="page-title">Invitations</h1>

      <h2 className="section-title">Waiting on you</h2>
      {received.length === 0 ? (
        <div className="empty-state"><p>No pending invitations.</p></div>
      ) : (
        <div className="invitation-list">
          {received.map((invite) => (
            <InvitationCard key={invite.id} invite={invite} sender={users.find((u) => u.id === invite.fromId)} />
          ))}
        </div>
      )}

      <h2 className="section-title">Sent by you</h2>
      {sent.length === 0 ? (
        <div className="empty-state"><p>You haven't sent any invitations.</p></div>
      ) : (
        <div className="sent-list">
          {sent.map((invite) => {
            const target = users.find((u) => u.id === invite.toId);
            return (
              <Link to={`/profile/${target.id}`} key={invite.id} className="connection-row">
                <Avatar user={target} size={44} />
                <div>
                  <div className="connection-row-name">{target.name}</div>
                  <div className="connection-row-bio">Requested {TIERS[invite.requestedTier].label} · waiting for a response</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
