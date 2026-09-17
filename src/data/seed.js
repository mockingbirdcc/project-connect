// Seed data for the Connect prototype.
// Tiers, in ascending closeness: "connected" < "trusted" < "inner"
export const TIERS = {
  connected: { label: "General", short: "Connected", rank: 1, description: "A broad, casual link. Good for staying loosely in touch." },
  trusted: { label: "Trusted", short: "Trusted", rank: 2, description: "People you trust with more than the surface-level stuff." },
  inner: { label: "Inner Circle", short: "Inner circle", rank: 3, description: "Your closest people. Full context, full trust." },
};

export const INTENTIONS = [
  "Rekindle a friendship",
  "Get to know you better",
  "Stay in touch",
  "Professional connection",
  "Other",
];

export const POST_INTENTS = [
  { id: "support", label: "Asking for support", emoji: "🫂", hint: "Could use some care right now" },
  { id: "advice", label: "Asking for advice", emoji: "🤔", hint: "Genuinely want input" },
  { id: "just_because", label: "Just because", emoji: "✨", hint: "No particular reason" },
];

export const REPLY_OPTIONS = [
  { id: "allowReact", label: "React", emoji: "👍", hint: "A quiet acknowledgment — no words needed" },
  { id: "allowComment", label: "Comment", emoji: "💬", hint: "Visible to anyone who can see this conversation" },
  { id: "allowMessage", label: "Message", emoji: "📤", hint: "A private reply, just to you" },
];

export const AUDIENCE_OPTIONS = [
  { id: "inner", label: "Inner circle only", description: "Only the people you trust most" },
  { id: "trusted", label: "Trusted connections", description: "Inner circle + trusted connections" },
  { id: "connected", label: "Everyone I'm connected with", description: "All of your connections" },
  { id: "custom", label: "Choose specific people", description: "Hand-pick who sees this one" },
];

export const seedUsers = [
  {
    id: "u1",
    name: "Rania Haddad",
    initials: "RH",
    color: "#c9704f",
    bio: "Building things that respect people's time and attention. Tea over coffee.",
  },
  {
    id: "u2",
    name: "Jordan Ashe",
    initials: "JA",
    color: "#4f7fc9",
    bio: "Ceramicist by weekend, product designer by weekday. Always covered in clay dust.",
  },
  {
    id: "u3",
    name: "Priya Nair",
    initials: "PN",
    color: "#7fb069",
    bio: "Trail runner, night owl, professional overthinker. Ask me about my dog.",
  },
  {
    id: "u4",
    name: "Sam Okafor",
    initials: "SO",
    color: "#c9a04f",
    bio: "Writing a novel very slowly. Here for the people, not the feed.",
  },
  {
    id: "u5",
    name: "Mika Lindqvist",
    initials: "ML",
    color: "#9d6fc9",
    bio: "Freelance photographer. If the light is good I'm probably outside.",
  },
  {
    id: "u6",
    name: "Theo Marsh",
    initials: "TM",
    color: "#4fb0c9",
    bio: "New in town, looking to actually meet people instead of just scrolling past them.",
  },
];

// currentUserId defaults to u1 (Rania) so the prototype opens on a populated account.
export const seedConnections = [
  {
    id: "c1",
    fromId: "u2",
    toId: "u1",
    status: "accepted",
    tier: "trusted",
    requestedTier: "trusted",
    intention: "Stay in touch",
    note: "Loved reconnecting at the studio open house last month!",
    createdAt: "2026-06-02T10:00:00Z",
    respondedAt: "2026-06-02T18:30:00Z",
  },
  {
    id: "c2",
    fromId: "u1",
    toId: "u3",
    status: "accepted",
    tier: "inner",
    requestedTier: "inner",
    intention: "Rekindle a friendship",
    note: "It's been way too long, Priya. Let's actually keep up this time.",
    createdAt: "2026-04-11T09:15:00Z",
    respondedAt: "2026-04-11T20:02:00Z",
  },
  {
    id: "c3",
    fromId: "u4",
    toId: "u1",
    status: "pending",
    tier: null,
    requestedTier: "trusted",
    intention: "Professional connection",
    note: "We met at the writers' meetup — would love to stay in each other's orbit.",
    createdAt: "2026-09-10T14:22:00Z",
    respondedAt: null,
  },
  {
    id: "c4",
    fromId: "u1",
    toId: "u5",
    status: "pending",
    tier: null,
    requestedTier: "inner",
    intention: "Get to know you better",
    note: "Your photos from the coast trip stopped me in my tracks.",
    createdAt: "2026-09-14T08:05:00Z",
    respondedAt: null,
  },
  {
    id: "c5",
    fromId: "u3",
    toId: "u2",
    status: "accepted",
    tier: "connected",
    requestedTier: "trusted",
    intention: "Stay in touch",
    note: "",
    createdAt: "2026-05-20T11:00:00Z",
    respondedAt: "2026-05-21T09:00:00Z",
  },
];

export const seedPosts = [
  {
    id: "p1",
    authorId: "u1",
    content: "Finally shipped the thing I've been heads-down on for six weeks. Feeling lighter than I have in a while.",
    intent: "just_because",
    audience: "connected",
    customAudienceIds: [],
    createdAt: "2026-09-15T16:00:00Z",
    allowReact: true,
    allowComment: true,
    allowMessage: false,
    reactions: [{ userId: "u2", emoji: "👍" }],
    comments: [
      { id: "cm1", authorId: "u3", content: "SO proud of you for this.", createdAt: "2026-09-15T17:10:00Z" },
    ],
    dismissedBy: [],
    hiddenFromIds: [],
  },
  {
    id: "p2",
    authorId: "u2",
    content: "First glaze test out of the new kiln didn't crack. Small wins, but they count.",
    intent: "just_because",
    audience: "trusted",
    customAudienceIds: [],
    createdAt: "2026-09-14T12:30:00Z",
    allowReact: true,
    allowComment: false,
    allowMessage: false,
    reactions: [],
    comments: [],
    dismissedBy: [],
    hiddenFromIds: [],
  },
  {
    id: "p3",
    authorId: "u3",
    content: "Rough week. Not really looking for advice, just needed somewhere honest to put it.",
    intent: "support",
    audience: "inner",
    customAudienceIds: [],
    createdAt: "2026-09-13T21:10:00Z",
    allowReact: true,
    allowComment: false,
    allowMessage: true,
    reactions: [],
    comments: [],
    dismissedBy: [],
    hiddenFromIds: [],
  },
  {
    id: "p4",
    authorId: "u2",
    content: "Considering switching my whole portfolio site over to something simpler. Anyone done this recently and regretted it?",
    intent: "advice",
    audience: "connected",
    customAudienceIds: [],
    createdAt: "2026-09-12T09:45:00Z",
    allowReact: false,
    allowComment: true,
    allowMessage: true,
    reactions: [],
    comments: [
      { id: "cm2", authorId: "u1", content: "I did it in June, zero regrets — happy to talk through it.", createdAt: "2026-09-12T10:02:00Z" },
    ],
    dismissedBy: [],
    hiddenFromIds: [],
  },
  {
    id: "p5",
    authorId: "u1",
    content: "Quiet Sunday. Made soup. That's the whole update.",
    intent: "just_because",
    audience: "trusted",
    customAudienceIds: [],
    createdAt: "2026-09-11T19:20:00Z",
    allowReact: true,
    allowComment: true,
    allowMessage: false,
    reactions: [{ userId: "u2", emoji: "👍" }, { userId: "u4", emoji: "👍" }],
    comments: [],
    dismissedBy: [],
    hiddenFromIds: [],
  },
];

export function buildInitialState() {
  return {
    currentUserId: "u1",
    users: seedUsers,
    connections: seedConnections,
    posts: seedPosts,
    messages: [],
  };
}
