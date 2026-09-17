import { useState } from "react";
import { INTENTIONS, TIERS } from "../data/seed";
import { useApp, useCurrentUser } from "../store/AppContext";

export default function ConnectModal({ targetUser, onClose }) {
  const { sendConnectionInvite } = useApp();
  const currentUser = useCurrentUser();
  const [step, setStep] = useState(1);
  const [intention, setIntention] = useState(INTENTIONS[0]);
  const [requestedTier, setRequestedTier] = useState("trusted");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  const totalSteps = 3;

  function handleSend() {
    sendConnectionInvite({
      fromId: currentUser.id,
      toId: targetUser.id,
      intention,
      requestedTier,
      note: note.trim(),
    });
    setSent(true);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {sent ? (
          <div className="modal-success">
            <div className="success-icon">✓</div>
            <h2>Invitation sent</h2>
            <p>
              {targetUser.name} will see your intention and your note before deciding
              anything — nothing is connected until they say so.
            </p>
            <button className="btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h2>Connect with {targetUser.name}</h2>
              <div className="step-dots">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <span key={i} className={`step-dot ${i + 1 <= step ? "active" : ""}`} />
                ))}
              </div>
            </div>

            {step === 1 && (
              <div className="modal-body">
                <p className="modal-prompt">Why do you want to connect with {targetUser.name}?</p>
                <div className="choice-list">
                  {INTENTIONS.map((option) => (
                    <label key={option} className={`choice-item ${intention === option ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="intention"
                        value={option}
                        checked={intention === option}
                        onChange={() => setIntention(option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="modal-body">
                <p className="modal-prompt">What are you hoping for?</p>
                <p className="modal-subtext">
                  This is just your starting ask — {targetUser.name} decides the actual level when they respond.
                </p>
                <div className="choice-list">
                  {Object.entries(TIERS).map(([key, tier]) => (
                    <label key={key} className={`choice-item tier-choice ${requestedTier === key ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="tier"
                        value={key}
                        checked={requestedTier === key}
                        onChange={() => setRequestedTier(key)}
                      />
                      <span>
                        <strong>{tier.label}</strong>
                        <small>{tier.description}</small>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="modal-body">
                <p className="modal-prompt">Add a personal note (optional)</p>
                <p className="modal-subtext">
                  Tell {targetUser.name} why, specifically — context makes it easier to say yes.
                </p>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={`Hi ${targetUser.name.split(" ")[0]}, ...`}
                  rows={4}
                />
                <div className="review-summary">
                  <div><span>Intention</span>{intention}</div>
                  <div><span>Requested level</span>{TIERS[requestedTier].label}</div>
                </div>
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
                <button className="btn-primary" onClick={() => setStep(step + 1)}>
                  Next
                </button>
              ) : (
                <button className="btn-primary" onClick={handleSend}>
                  Send Invitation to Connect
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
