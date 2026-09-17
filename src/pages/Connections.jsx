import { Link } from "react-router-dom";
import { useApp, useCurrentUser } from "../store/AppContext";
import Avatar from "../components/Avatar";
import TierBadge from "../components/TierBadge";

export default function Connections() {
  const { users, connections } = useApp();
  const currentUser = useCurrentUser();

  const myConnections = connections
    .filter((c) => c.status === "accepted" && (c.fromId === currentUser.id || c.toId === currentUser.id))
    .map((c) => {
      const otherId = c.fromId === currentUser.id ? c.toId : c.fromId;
      return { edge: c, other: users.find((u) => u.id === otherId) };
    })
    .sort((a, b) => (b.edge.tier === "inner" ? 1 : 0) - (a.edge.tier === "inner" ? 1 : 0));

  const byTier = {
    inner: myConnections.filter((c) => c.edge.tier === "inner"),
    trusted: myConnections.filter((c) => c.edge.tier === "trusted"),
    connected: myConnections.filter((c) => c.edge.tier === "connected"),
  };

  return (
    <div className="page">
      <h1 className="page-title">Your Connections</h1>
      <p className="page-subtitle">
        Levels aren't just labels — they decide what shows up in each other's feeds.
      </p>

      {myConnections.length === 0 && (
        <div className="empty-state">
          <p>No connections yet. Head to People to find someone.</p>
        </div>
      )}

      {["inner", "trusted", "connected"].map((tier) =>
        byTier[tier].length > 0 ? (
          <div key={tier} className="tier-section">
            <h2 className="section-title">
              <TierBadge tier={tier} />
            </h2>
            <div className="connection-list">
              {byTier[tier].map(({ other }) => (
                <Link to={`/profile/${other.id}`} key={other.id} className="connection-row">
                  <Avatar user={other} size={44} />
                  <div>
                    <div className="connection-row-name">{other.name}</div>
                    <div className="connection-row-bio">{other.bio}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
