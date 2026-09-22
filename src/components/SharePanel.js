import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  PLANS,
  SHARING_PLANS,
  loadPlan,
  savePlan,
  canShare,
  getActiveShareId,
  createShare,
  updateShareItems,
  stopSharing,
  buildShareLink,
} from "../utils/sharing";

function Icon({ name }) {
  return (
    <span className="material-symbols-rounded" aria-hidden="true">
      {name}
    </span>
  );
}

// FR-12: lets a subscriber on a Premium, Family, or Social plan share their
// StreamList. Until subscriptions exist, the plan is chosen here and saved
// to localStorage so the rule can be tested; the subscription work in Week 5
// should replace this selector with the real plan.
function SharePanel({ items }) {
  const [plan, setPlan] = useState(loadPlan);
  const [shareId, setShareId] = useState(getActiveShareId);
  const [message, setMessage] = useState("");

  const allowed = canShare(plan);
  const link = shareId ? buildShareLink(shareId) : "";

  const handlePlanChange = (event) => {
    const nextPlan = event.target.value;
    setPlan(nextPlan);
    savePlan(nextPlan);
    setMessage("");
  };

  const handleCreate = () => {
    const share = createShare(items);
    if (share) {
      setShareId(share.id);
      setMessage("Your StreamList is now shared.");
    } else {
      setMessage("Sharing could not be saved. Check that browser storage is allowed.");
    }
  };

  const handleUpdate = () => {
    updateShareItems(shareId, items);
    setMessage("The shared copy now matches your current list.");
  };

  const handleStop = () => {
    stopSharing(shareId);
    setShareId(null);
    setMessage("Sharing stopped. The link no longer works.");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setMessage("Link copied.");
    } catch {
      setMessage("Copying is not available here. Select the link and copy it by hand.");
    }
  };

  return (
    <section className="share-panel" aria-labelledby="share-heading">
      <h2 id="share-heading">
        <Icon name="share" /> Share your StreamList
      </h2>

      <div className="share-plan-row">
        <label htmlFor="plan-select">Your plan</label>
        <select id="plan-select" value={plan} onChange={handlePlanChange}>
          {PLANS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {!allowed && (
        <p className="share-note">
          Sharing is available on the {SHARING_PLANS.join(", ")} plans. Upgrade
          your plan to share your list.
        </p>
      )}

      {allowed && !shareId && (
        <button type="button" className="btn-share" onClick={handleCreate}>
          <Icon name="link" /> Create share link
        </button>
      )}

      {allowed && shareId && (
        <div className="share-link-box">
          <input
            type="text"
            readOnly
            value={link}
            aria-label="Share link"
            onFocus={(event) => event.target.select()}
          />
          <div className="button-group">
            <button type="button" className="btn-share" onClick={handleCopy}>
              <Icon name="content_copy" /> Copy link
            </button>
            <button type="button" className="btn-edit" onClick={handleUpdate}>
              <Icon name="sync" /> Update shared copy
            </button>
            <Link className="share-open-link" to={`/shared/${shareId}`}>
              <Icon name="open_in_new" /> Open shared view
            </Link>
            <button type="button" className="btn-delete" onClick={handleStop}>
              <Icon name="link_off" /> Stop sharing
            </button>
          </div>
        </div>
      )}

      {message && (
        <p className="share-message" role="status">
          {message}
        </p>
      )}

      <p className="share-fineprint">
        Shared lists are saved in this browser for now, so the link opens on
        this device only.
      </p>
    </section>
  );
}

export default SharePanel;
