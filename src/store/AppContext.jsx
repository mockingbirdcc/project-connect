import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { buildInitialState } from "../data/seed";

const STORAGE_KEY = "connect-prototype-state-v1";
const AppContext = createContext(null);

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn("Failed to load saved prototype state, reseeding.", err);
  }
  return buildInitialState();
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn("Failed to persist prototype state.", err);
    }
  }, [state]);

  const switchUser = useCallback((userId) => {
    setState((s) => ({ ...s, currentUserId: userId }));
  }, []);

  const resetData = useCallback(() => {
    const fresh = buildInitialState();
    setState(fresh);
  }, []);

  const sendConnectionInvite = useCallback(({ fromId, toId, intention, requestedTier, note }) => {
    setState((s) => ({
      ...s,
      connections: [
        ...s.connections,
        {
          id: `c${Date.now()}`,
          fromId,
          toId,
          status: "pending",
          tier: null,
          requestedTier,
          intention,
          note,
          createdAt: new Date().toISOString(),
          respondedAt: null,
        },
      ],
    }));
  }, []);

  const respondToInvite = useCallback(({ connectionId, decision, grantedTier }) => {
    setState((s) => ({
      ...s,
      connections: s.connections.map((c) =>
        c.id === connectionId
          ? {
              ...c,
              status: decision === "accept" ? "accepted" : "declined",
              tier: decision === "accept" ? grantedTier : null,
              respondedAt: new Date().toISOString(),
            }
          : c
      ),
    }));
  }, []);

  const createPost = useCallback(({ authorId, content, intent, audience, customAudienceIds, allowReact, allowComment, allowMessage }) => {
    setState((s) => ({
      ...s,
      posts: [
        {
          id: `p${Date.now()}`,
          authorId,
          content,
          intent,
          audience,
          customAudienceIds: customAudienceIds || [],
          createdAt: new Date().toISOString(),
          allowReact,
          allowComment,
          allowMessage,
          reactions: [],
          comments: [],
          dismissedBy: [],
        },
        ...s.posts,
      ],
    }));
  }, []);

  const toggleReaction = useCallback(({ postId, userId, emoji }) => {
    setState((s) => ({
      ...s,
      posts: s.posts.map((p) => {
        if (p.id !== postId) return p;
        const already = p.reactions.some((r) => r.userId === userId);
        return {
          ...p,
          reactions: already
            ? p.reactions.filter((r) => r.userId !== userId)
            : [...p.reactions, { userId, emoji }],
        };
      }),
    }));
  }, []);

  const addComment = useCallback(({ postId, authorId, content }) => {
    setState((s) => ({
      ...s,
      posts: s.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                { id: `cm${Date.now()}`, authorId, content, createdAt: new Date().toISOString() },
              ],
            }
          : p
      ),
    }));
  }, []);

  const sendMessage = useCallback(({ fromId, toId, content, postId }) => {
    setState((s) => ({
      ...s,
      messages: [
        ...s.messages,
        { id: `m${Date.now()}`, fromId, toId, content, postId, createdAt: new Date().toISOString() },
      ],
    }));
  }, []);

  const dismissPost = useCallback(({ postId, userId }) => {
    setState((s) => ({
      ...s,
      posts: s.posts.map((p) =>
        p.id === postId && !p.dismissedBy.includes(userId)
          ? { ...p, dismissedBy: [...p.dismissedBy, userId] }
          : p
      ),
    }));
  }, []);

  const dismissPosts = useCallback(({ postIds, userId }) => {
    setState((s) => ({
      ...s,
      posts: s.posts.map((p) =>
        postIds.includes(p.id) && !p.dismissedBy.includes(userId)
          ? { ...p, dismissedBy: [...p.dismissedBy, userId] }
          : p
      ),
    }));
  }, []);

  const undismissPost = useCallback(({ postId, userId }) => {
    setState((s) => ({
      ...s,
      posts: s.posts.map((p) =>
        p.id === postId ? { ...p, dismissedBy: p.dismissedBy.filter((id) => id !== userId) } : p
      ),
    }));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      switchUser,
      resetData,
      sendConnectionInvite,
      respondToInvite,
      createPost,
      toggleReaction,
      addComment,
      sendMessage,
      dismissPost,
      dismissPosts,
      undismissPost,
    }),
    [
      state,
      switchUser,
      resetData,
      sendConnectionInvite,
      respondToInvite,
      createPost,
      toggleReaction,
      addComment,
      sendMessage,
      dismissPost,
      dismissPosts,
      undismissPost,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function useCurrentUser() {
  const { users, currentUserId } = useApp();
  return users.find((u) => u.id === currentUserId);
}
