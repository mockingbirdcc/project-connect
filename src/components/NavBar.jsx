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
      <div className="navbar-top">
        <div className="navbar-top-inner">
          <NavLink to="/" className="brand">
            <span className="brand-mark">◐</span> Connect
          </NavLink>
          <nav className="nav-icons">
            <NavLink to="/connections" className={({ isActive }) => `nav-icon-link ${isActive ? "active" : ""}`} title="Connections">
              👥
            </NavLink>
            <NavLink to="/" end className={({ isActive }) => `nav-icon-link ${isActive ? "active" : ""}`} title="Home">
              🏠
            </NavLink>
            <NavLink to="/invitations" className={({ isActive }) => `nav-icon-link ${isActive ? "active" : ""}`} title="Invitations">
              ✉️
              {pendingReceivedCount > 0 && <span className="badge-dot">{pendingReceivedCount}</span>}
            </NavLink>
            <NavLink to="/people" className={({ isActive }) => `nav-icon-link ${isActive ? "active" : ""}`} title="Find people">
              🔎
            </NavLink>
          </nav>
        </div>
      </div>

      <div className="navbar-utility">
        <div className="navbar-utility-inner">
          <NavLink to={`/profile/${currentUser?.id}`} className="nav-profile-link">
            <Avatar user={currentUser} size={28} />
            <span className="nav-username">{currentUser?.name}</span>
          </NavLink>

          <div className="nav-right">
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
      </div>
    </header>
  );
}
