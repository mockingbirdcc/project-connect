import { Link } from "react-router-dom";
import { useApp, useCurrentUser } from "../store/AppContext";
import { relationshipStatus } from "../lib/consent";
import Avatar from "../components/Avatar";

const STATUS_LABEL = {
  none: null,
  pending_sent: "Invitation sent",
  pending_received: "Wants to connect",
  connected: "Connected",
};

export default function People() {
  const { users, connections } = useApp();
  const currentUser = useCurrentUser();

  const others = users.filter((u) => u.id !== currentUser?.id);

  return (
    <div className="page">
      <h1 className="page-title">People</h1>
      <p className="page-subtitle">Every connection starts on a profile, on purpose.</p>

      <div className="people-grid">
        {others.map((u) => {
          const status = relationshipStatus(currentUser.id, u.id, connections);
          return (
            <Link to={`/profile/${u.id}`} key={u.id} className="person-card">
              <Avatar user={u} size={56} />
              <div className="person-card-name">{u.name}</div>
              <div className="person-card-bio">{u.bio}</div>
              {STATUS_LABEL[status] && <span className="pill small">{STATUS_LABEL[status]}</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
