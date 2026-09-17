import { NavLink } from "react-router-dom";
import { useApp, useCurrentUser } from "../store/AppContext";
import Avatar from "./Avatar";

export default function NavBar() {
  const { users, switchUser, resetData, connections } = useApp();
  const currentUser = useCurrentUser();

  const pendingReceivedCount = connections.filter(
    (c) => c.status === "pending" && c.toId === currentUser?.id
  ).length;

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">
          <span className="brand-mark">◐</span> Connect
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/" end>Feed</NavLink>
          <NavLink to="/people">People</NavLink>
          <NavLink to="/connections">Connections</NavLink>
          <NavLink to="/invitations" className="invites-link">
            Invitations
            {pendingReceivedCount > 0 && <span className="badge-dot">{pendingReceivedCount}</span>}
          </NavLink>
        </nav>

        <div className="nav-right">
          <NavLink to={`/profile/${currentUser?.id}`} className="nav-profile-link">
            <Avatar user={currentUser} size={32} />
            <span className="nav-username">{currentUser?.name}</span>
          </NavLink>

          <select
            className="user-switcher"
            value={currentUser?.id}
            onChange={(e) => switchUser(e.target.value)}
            title="Prototype only: switch who you're viewing Connect as"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                View as {u.name}
              </option>
            ))}
          </select>

          <button className="btn-ghost small" onClick={resetData} title="Reset prototype data">
            Reset
          </button>
        </div>
      </div>
    </header>
  );
}
