import { useState } from "react";
import { useApp, useCurrentUser } from "../store/AppContext";
import Avatar from "./Avatar";

export default function MessageModal({ recipient, post, onClose }) {
  const { sendMessage } = useApp();
  const currentUser = useCurrentUser();
  const [content, setContent] = useState("");
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!content.trim()) return;
    sendMessage({ fromId: currentUser.id, toId: recipient.id, content: content.trim(), postId: post.id });
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
            <h2>Sent privately</h2>
            <p>Only {recipient.name} can see this — it won't appear anywhere public.</p>
            <button className="btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h2>Message {recipient.name}</h2>
            </div>
            <div className="modal-body">
              <div className="composer-identity">
                <Avatar user={recipient} size={36} />
                <span>Replying privately about their conversation</span>
              </div>
              <textarea
                autoFocus
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Write something just for ${recipient.name.split(" ")[0]}...`}
              />
            </div>
            <div className="modal-actions">
              <div className="spacer" />
              <button className="btn-primary" disabled={!content.trim()} onClick={handleSend}>
                Send privately
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
