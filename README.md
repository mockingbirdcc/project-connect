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
- **Posts carry intent and an explicit audience.** Before publishing,
  every post asks what it's for (celebrating, venting, asking for support,
  asking for advice, etc.) and who it's for (Inner Circle only / Trusted
  connections / everyone you're connected with / hand-picked people). The
  feed only ever shows you posts whose audience includes the actual
  relationship tier you hold with that person.
- **Profiles are the front door to Connections.** A profile shows a
  person's name, photo, and bio, their visible post history (filtered by
  the same consent rules as the feed), and — if you don't already have a
  connection — the option to start one.

## Running it

```bash
npm install
npm run dev
```

This is a self-contained front-end prototype: all data (users,
connections, posts) is seeded on first load and persisted to
`localStorage` so your changes stick around between visits. Use the
"View as ..." switcher in the nav bar to jump between seeded users and see
both sides of the consent flows (sending vs. receiving an invitation,
posting vs. viewing). "Reset" restores the seed data.

## Structure

- `src/data/seed.js` — seed users/connections/posts and the shared
  vocabulary (tiers, invitation intentions, post intents, audience options)
- `src/lib/consent.js` — the visibility/consent rules (who can see what)
- `src/store/AppContext.jsx` — app state + localStorage persistence
- `src/pages/` — Feed, Profile, People (discover), Connections, Invitations
- `src/components/` — `ConnectModal` (the invitation flow) and
  `PostComposer` (the intent/audience flow) are the two consent-forward
  centerpieces
