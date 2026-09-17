import { TIERS } from "../data/seed";

export function tierRank(tier) {
  return tier ? TIERS[tier].rank : 0;
}

// Can `viewerId` see a post authored by `authorId` with the given audience settings?
export function canView({ viewerId, authorId, audience, customAudienceIds }, connections) {
  if (viewerId === authorId) return true;

  if (audience === "custom") {
    return customAudienceIds.includes(viewerId);
  }

  const edge = findAcceptedConnection(authorId, viewerId, connections);
  if (!edge) return false;

  return tierRank(edge.tier) >= tierRank(audience);
}

export function findAcceptedConnection(userA, userB, connections) {
  return connections.find(
    (c) =>
      c.status === "accepted" &&
      ((c.fromId === userA && c.toId === userB) || (c.fromId === userB && c.toId === userA))
  );
}

export function findConnectionBetween(userA, userB, connections) {
  return connections.find(
    (c) =>
      (c.fromId === userA && c.toId === userB) || (c.fromId === userB && c.toId === userA)
  );
}

export function relationshipStatus(viewerId, otherId, connections) {
  if (viewerId === otherId) return "self";
  const edge = findConnectionBetween(viewerId, otherId, connections);
  if (!edge) return "none";
  if (edge.status === "declined") return "none";
  if (edge.status === "accepted") return "connected";
  // pending
  return edge.fromId === viewerId ? "pending_sent" : "pending_received";
}
