import { AUTH_STORAGE_KEY } from "./auth";

const toBase64Url = (value) =>
  btoa(unescape(encodeURIComponent(JSON.stringify(value))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

// Build a Google-shaped ID token for tests. The signature is fake; the app
// only decodes the payload in the browser.
export function makeGoogleCredential(claims = {}) {
  const payload = {
    iss: "https://accounts.google.com",
    aud: "test-client-id.apps.googleusercontent.com",
    sub: "1234567890",
    name: "Test Viewer",
    email: "viewer@example.com",
    picture: "",
    exp: Math.floor(Date.now() / 1000) + 3600,
    ...claims,
  };
  return `${toBase64Url({ alg: "RS256", typ: "JWT" })}.${toBase64Url(payload)}.signature`;
}

// Store a signed-in user so tests can render protected pages directly.
export function signInTestUser(overrides = {}) {
  const user = {
    id: "1234567890",
    name: "Test Viewer",
    email: "viewer@example.com",
    picture: "",
    expiresAt: Date.now() + 60 * 60 * 1000,
    ...overrides,
  };
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  return user;
}
