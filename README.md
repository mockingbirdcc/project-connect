# Connect

A clickable, interactive prototype for a consent-forward social app. Unlike
typical social platforms, Connect treats every relationship and every share
as something that requires context and intention, not just a follow and a
feed.

## The core ideas

- **Connections are graded, and the receiver decides the grade.** When you
  send an Invitation to Connect, you answer a couple of questions about why
  you're reaching out and what level of closeness you're hoping for
  (General / Trusted / Inner Circle). The person you're inviting sees your
  answers and note, then chooses the *actual* level to grant — which can be
  lower than what you asked for. Nothing is symmetric or automatic.
- **Conversations carry intent, an explicit audience, and explicit reply
  permissions.** Before starting one, you're asked what it's for
  (celebrating, venting, asking for support, asking for advice, etc.), who
  it's for (Inner Circle only / Trusted connections / everyone you're
  connected with / hand-picked people), and — opt-in, nothing is on by
  default — what people are allowed to do in response: React, Comment, or
  send a private Message. The feed only ever shows a conversation to
  viewers who hold the relationship tier its audience requires.
- **Dismissing a conversation is revocable and personal.** Every
  conversation in your feed can be dismissed, like archiving an email —
  it disappears from your inbox but the underlying conversation isn't
  touched, and you can always undo it. Once everything is dismissed or
  read, the feed affirmatively tells you that you're caught up instead of
  quietly staying empty — being "done" is an active state, not an absence.
- **Profiles are the front door to Connections.** A profile shows a
  person's name, photo, and bio, their visible conversation history
  (filtered by the same consent rules as the feed), and — if you don't
  already have a connection — the option to start one.

## Running it

```bash
npm install
npm run dev
```

This is a self-contained front-end prototype: all data (users,
connections, conversations) is seeded on first load and persisted to
`localStorage` so your changes stick around between visits. Use the
"View as ..." switcher in the nav bar to jump between seeded users and see
both sides of the consent flows (sending vs. receiving an invitation,
starting a conversation vs. viewing one). "Reset" restores the seed data.

## Structure

- `src/data/seed.js` — seed users/connections/conversations and the shared
  vocabulary (tiers, invitation intentions, conversation intents, audience
  options, reply options)
- `src/lib/consent.js` — the visibility/consent rules (who can see what)
- `src/store/AppContext.jsx` — app state + localStorage persistence
- `src/pages/` — Feed, Profile, People (discover), Connections, Invitations
- `src/components/` — `ConnectModal` (the invitation flow) and
  `PostComposer` (the intent/audience/reply-options flow) are the
  consent-forward centerpieces; `PostCard` renders a conversation with its
  reply bar and dismiss control; `MessageModal` handles a private reply

Internally, the code still calls a conversation a "post" (component and
variable names, `createPost`, etc.) — only the user-facing language was
renamed to "Conversation."
