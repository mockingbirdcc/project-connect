import { useState } from "react";
import { POST_INTENTS, AUDIENCE_OPTIONS, REPLY_OPTIONS } from "../data/seed";
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
  const [replyOptions, setReplyOptions] = useState({ allowReact: false, allowComment: false, allowMessage: false });

  const totalSteps = 4;
  const connectedUsers = users.filter((u) => u.id !== currentUser.id);

  function toggleCustom(id) {
    setCustomIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleReplyOption(id) {
    setReplyOptions((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const allReplyOptionsOn = REPLY_OPTIONS.every((option) => replyOptions[option.id]);

  function toggleAllReplyOptions() {
    const next = !allReplyOptionsOn;
    setReplyOptions({ allowReact: next, allowComment: next, allowMessage: next });
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
      allowReact: replyOptions.allowReact,
      allowComment: replyOptions.allowComment,
      allowMessage: replyOptions.allowMessage,
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
          <h2>New Conversation</h2>
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
            <p className="modal-prompt">What's the intent behind this conversation?</p>
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

        {step === 4 && (
          <div className="modal-body">
            <p className="modal-prompt">What can people do in response?</p>
            <p className="modal-subtext">
              Nothing is available unless you allow it — pick what fits this conversation.
            </p>
            <div className="choice-list">
              <label className={`choice-item tier-choice ${allReplyOptionsOn ? "selected" : ""}`}>
                <input type="checkbox" checked={allReplyOptionsOn} onChange={toggleAllReplyOptions} />
                <span>
                  <strong>🔓 All responses</strong>
                  <small>Turn on React, Comment, and Message together</small>
                </span>
              </label>
              {REPLY_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className={`choice-item tier-choice ${replyOptions[option.id] ? "selected" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={replyOptions[option.id]}
                    onChange={() => toggleReplyOption(option.id)}
                  />
                  <span>
                    <strong>{option.emoji} {option.label}</strong>
                    <small>{option.hint}</small>
                  </span>
                </label>
              ))}
            </div>
            {!replyOptions.allowReact && !replyOptions.allowComment && !replyOptions.allowMessage && (
              <p className="modal-subtext" style={{ marginTop: 10 }}>
                That's OK too — this can be a one-way share, nothing more.
              </p>
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
              Start Conversation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
