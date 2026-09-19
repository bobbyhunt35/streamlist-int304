// Storage helpers for FR-12 (share a StreamList) and FR-13 (comment on or
// react to a shared StreamList).
//
// There is no backend yet, so shared lists live in localStorage and a share
// link only opens in the browser that created it. The functions below are the
// only place that touches storage, so a real API can replace them later
// without changing the components.

export const PLAN_KEY = "streamlist.plan";
export const SHARES_KEY = "streamlist.shares";
export const ACTIVE_SHARE_KEY = "streamlist.activeShareId";
export const VIEWER_KEY = "streamlist.viewerId";

export const PLANS = ["Basic", "Gold", "Premium", "Family", "Social"];
export const SHARING_PLANS = ["Premium", "Family", "Social"];

export const REACTIONS = [
  { key: "like", icon: "thumb_up", label: "Like" },
  { key: "love", icon: "favorite", label: "Love" },
  { key: "popcorn", icon: "theaters", label: "Great pick" },
];

export const MAX_COMMENT_LENGTH = 500;
export const MAX_NAME_LENGTH = 30;

function read(key, fallback) {
  try {
    const saved = window.localStorage.getItem(key);
    return saved === null ? fallback : JSON.parse(saved);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function makeId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// ---------- Plan ----------

export function loadPlan() {
  const plan = read(PLAN_KEY, "Basic");
  return PLANS.includes(plan) ? plan : "Basic";
}

export function savePlan(plan) {
  if (PLANS.includes(plan)) write(PLAN_KEY, plan);
}

export function canShare(plan) {
  return SHARING_PLANS.includes(plan);
}

// ---------- Viewer ----------

// Anonymous per-browser id so a viewer can toggle their own reaction.
export function getViewerId() {
  let id = read(VIEWER_KEY, null);
  if (!id) {
    id = makeId();
    write(VIEWER_KEY, id);
  }
  return id;
}

// ---------- Shares ----------

function loadShares() {
  const shares = read(SHARES_KEY, {});
  return shares && typeof shares === "object" && !Array.isArray(shares)
    ? shares
    : {};
}

function saveShares(shares) {
  return write(SHARES_KEY, shares);
}

// Only the fields a viewer needs are copied, so nothing else in the list
// object ever leaks into a shared copy.
function snapshotItems(items) {
  return items.map((item) => ({
    id: item.id,
    text: String(item.text),
    completed: Boolean(item.completed),
  }));
}

export function getActiveShareId() {
  const id = read(ACTIVE_SHARE_KEY, null);
  return id && loadShares()[id] ? id : null;
}

export function getShare(shareId) {
  return loadShares()[shareId] || null;
}

export function createShare(items) {
  const shares = loadShares();
  const id = makeId();
  shares[id] = {
    id,
    title: "My StreamList",
    items: snapshotItems(items),
    comments: [],
    reactions: {},
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  if (!saveShares(shares)) return null;
  write(ACTIVE_SHARE_KEY, id);
  return shares[id];
}

export function updateShareItems(shareId, items) {
  const shares = loadShares();
  if (!shares[shareId]) return null;
  shares[shareId] = {
    ...shares[shareId],
    items: snapshotItems(items),
    updatedAt: Date.now(),
  };
  saveShares(shares);
  return shares[shareId];
}

export function stopSharing(shareId) {
  const shares = loadShares();
  delete shares[shareId];
  saveShares(shares);
  write(ACTIVE_SHARE_KEY, null);
}

export function buildShareLink(shareId) {
  return `${window.location.origin}/shared/${shareId}`;
}

// ---------- Comments (FR-13) ----------

export function addComment(shareId, author, text) {
  const cleanText = String(text || "").trim().slice(0, MAX_COMMENT_LENGTH);
  if (!cleanText) return null;

  const shares = loadShares();
  const share = shares[shareId];
  if (!share) return null;

  const comment = {
    id: makeId(),
    author: String(author || "").trim().slice(0, MAX_NAME_LENGTH) || "Guest",
    text: cleanText,
    createdAt: Date.now(),
  };

  shares[shareId] = { ...share, comments: [...share.comments, comment] };
  saveShares(shares);
  return shares[shareId];
}

// ---------- Reactions (FR-13) ----------

// Toggles the current viewer's reaction and returns the updated share.
export function toggleReaction(shareId, reactionKey, viewerId) {
  if (!REACTIONS.some((reaction) => reaction.key === reactionKey)) return null;

  const shares = loadShares();
  const share = shares[shareId];
  if (!share) return null;

  const current = share.reactions[reactionKey] || [];
  const next = current.includes(viewerId)
    ? current.filter((id) => id !== viewerId)
    : [...current, viewerId];

  shares[shareId] = {
    ...share,
    reactions: { ...share.reactions, [reactionKey]: next },
  };
  saveShares(shares);
  return shares[shareId];
}
