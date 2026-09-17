import { TIERS } from "../data/seed";

export function tierRank(tier) {
  return tier ? TIERS[tier].rank : 0;
}

// Can `viewerId` see a post authored by `authorId` with the given audience settings?
export function canView({ viewerId, authorId, audience, customAudienceIds, hiddenFromIds }, connections) {
  if (viewerId === authorId) return true;

  if (hiddenFromIds && hiddenFromIds.includes(viewerId)) return false;

  if (audience === "custom") {
    return (customAudienceIds || []).includes(viewerId);
  }

  const edge = findAcceptedConnection(authorId, viewerId, connections);
  if (!edge) return false;

  return tierRank(edge.tier) >= tierRank(audience);
}

// Ids of userId's accepted connections at or above the given tier.
export function connectedUserIdsAtTier(userId, connections, tier) {
  const minRank = tierRank(tier);
  return connections
    .filter((c) => c.status === "accepted" && (c.fromId === userId || c.toId === userId) && tierRank(c.tier) >= minRank)
    .map((c) => (c.fromId === userId ? c.toId : c.fromId));
}

// Ids of everyone who actually ends up able to see a post with this audience/hidden config.
export function audienceUserIds({ authorId, audience, customAudienceIds, hiddenFromIds }, connections) {
  const base = audience === "custom" ? customAudienceIds || [] : connectedUserIdsAtTier(authorId, connections, audience);
  const hidden = new Set(hiddenFromIds || []);
  return base.filter((id) => !hidden.has(id));
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
