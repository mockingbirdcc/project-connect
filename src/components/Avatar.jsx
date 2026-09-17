export default function Avatar({ user, size = 40 }) {
  if (!user) return null;
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        backgroundColor: user.color,
        fontSize: size * 0.38,
      }}
      title={user.name}
    >
      {user.initials}
    </div>
  );
}
