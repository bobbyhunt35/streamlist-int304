// Helpers for Google OAuth sign-in (Google Identity Services).
//
// Google returns an ID token (a signed JWT) after the user signs in. The
// browser decodes it only to read the profile and check that it was issued
// for this app and has not expired. A production backend must verify the
// token's signature with Google before trusting it (see README).

export const AUTH_STORAGE_KEY = "streamlist.auth.user";

const GOOGLE_ISSUERS = ["accounts.google.com", "https://accounts.google.com"];

export function getGoogleClientId() {
  return (process.env.REACT_APP_GOOGLE_CLIENT_ID || "").trim();
}

// Decode the payload (middle part) of a JWT. Returns null if malformed.
export function decodeJwtPayload(token) {
  if (typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    // atob gives one character per byte; percent-encode the bytes so
    // decodeURIComponent rebuilds UTF-8 (names with accents, etc.).
    const binary = atob(padded);
    const utf8 = Array.from(
      binary,
      (char) => "%" + char.charCodeAt(0).toString(16).padStart(2, "0")
    ).join("");
    return JSON.parse(decodeURIComponent(utf8));
  } catch {
    return null;
  }
}

// Turn a Google ID token into the small user record the app keeps.
// Throws with a readable message if the token is not usable.
export function userFromCredential(credential, clientId, now = Date.now()) {
  const claims = decodeJwtPayload(credential);
  if (!claims) throw new Error("Google returned an unreadable sign-in token.");
  if (!GOOGLE_ISSUERS.includes(claims.iss)) {
    throw new Error("The sign-in token was not issued by Google.");
  }
  if (claims.aud !== clientId) {
    throw new Error("The sign-in token was issued for a different app.");
  }
  if (!claims.exp || claims.exp * 1000 <= now) {
    throw new Error("The sign-in token has expired. Please sign in again.");
  }

  return {
    id: claims.sub,
    name: claims.name || claims.email,
    email: claims.email,
    picture: claims.picture || "",
    expiresAt: claims.exp * 1000,
  };
}

export function isSessionValid(user, now = Date.now()) {
  return Boolean(user && user.id && user.expiresAt > now);
}

export function loadStoredUser(now = Date.now()) {
  try {
    const user = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "null");
    if (isSessionValid(user, now)) return user;
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // Storage unavailable or corrupt: treat as signed out.
  }
  return null;
}

export function storeUser(user) {
  try {
    if (user) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // Session still works in memory for this tab.
  }
}
