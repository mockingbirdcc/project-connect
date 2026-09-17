import { useState } from "react";
import { POST_INTENTS, AUDIENCE_OPTIONS } from "../data/seed";
import { useApp, useCurrentUser } from "../store/AppContext";
import Avatar from "./Avatar";

export default function PostComposer({ onClose, onPosted }) {
  const { users, createPost } = useApp();
  const currentUser = useCurrentUser();
  const [step, setStep] = useState(1);
  const [content, setContent] = useState("");
  const [intent, setIntent] = useState(null);
  const [audience, setAudience] = useState(null);
  const [customIds, setCustomIds] = useState([]);

  const totalSteps = 3;
  const connectedUsers = users.filter((u) => u.id !== currentUser.id);

  function toggleCustom(id) {
    setCustomIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function canAdvance() {
    if (step === 1) return content.trim().length > 0;
    if (step === 2) return !!intent;
    if (step === 3) return !!audience && (audience !== "custom" || customIds.length > 0);
    return true;
  }

  function handlePublish() {
    createPost({
      authorId: currentUser.id,
      content: content.trim(),
      intent,
      audience,
      customAudienceIds: audience === "custom" ? customIds : [],
    });
    onPosted?.();
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="modal-header">
          <h2>New Post</h2>
          <div className="step-dots">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span key={i} className={`step-dot ${i + 1 <= step ? "active" : ""}`} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="modal-body">
            <div className="composer-identity">
              <Avatar user={currentUser} size={36} />
              <strong>{currentUser.name}</strong>
            </div>
            <textarea
              autoFocus
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's going on?"
            />
          </div>
        )}

        {step === 2 && (
          <div className="modal-body">
            <p className="modal-prompt">What's the intent behind this post?</p>
            <p className="modal-subtext">This helps people know how to hold it before they respond.</p>
            <div className="intent-grid">
              {POST_INTENTS.map((option) => (
                <label
                  key={option.id}
                  className={`intent-tile ${intent === option.id ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="post-intent"
                    value={option.id}
                    checked={intent === option.id}
                    onChange={() => setIntent(option.id)}
                  />
                  <span className="intent-emoji">{option.emoji}</span>
                  <span className="intent-label">{option.label}</span>
                  <span className="intent-hint">{option.hint}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="modal-body">
            <p className="modal-prompt">Who is this for?</p>
            <div className="choice-list">
              {AUDIENCE_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className={`choice-item tier-choice ${audience === option.id ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="audience"
                    value={option.id}
                    checked={audience === option.id}
                    onChange={() => setAudience(option.id)}
                  />
                  <span>
                    <strong>{option.label}</strong>
                    <small>{option.description}</small>
                  </span>
                </label>
              ))}
            </div>

            {audience === "custom" && (
              <div className="custom-audience-list">
                {connectedUsers.map((u) => (
                  <label key={u.id} className={`choice-item person-item ${customIds.includes(u.id) ? "selected" : ""}`}>
                    <input
                      type="checkbox"
                      checked={customIds.includes(u.id)}
                      onChange={() => toggleCustom(u.id)}
                    />
                    <Avatar user={u} size={28} />
                    {u.name}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="modal-actions">
          {step > 1 && (
            <button className="btn-ghost" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}
          <div className="spacer" />
          {step < totalSteps ? (
            <button className="btn-primary" disabled={!canAdvance()} onClick={() => setStep(step + 1)}>
              Next
            </button>
          ) : (
            <button className="btn-primary" disabled={!canAdvance()} onClick={handlePublish}>
              Publish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
