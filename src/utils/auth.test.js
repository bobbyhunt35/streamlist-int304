import {
  AUTH_STORAGE_KEY,
  decodeJwtPayload,
  isSessionValid,
  loadStoredUser,
  userFromCredential,
} from "./auth";
import { makeGoogleCredential } from "./testAuth";

const CLIENT_ID = "test-client-id.apps.googleusercontent.com";

beforeEach(() => window.localStorage.clear());

test("decodes a Google ID token payload, including non-ASCII names", () => {
  const token = makeGoogleCredential({ name: "José Núñez" });
  expect(decodeJwtPayload(token)).toMatchObject({ name: "José Núñez", sub: "1234567890" });
});

test("returns null for malformed tokens", () => {
  expect(decodeJwtPayload("not-a-token")).toBeNull();
  expect(decodeJwtPayload("a.%%%.c")).toBeNull();
  expect(decodeJwtPayload(undefined)).toBeNull();
});

test("builds a user from a valid credential", () => {
  const user = userFromCredential(makeGoogleCredential(), CLIENT_ID);
  expect(user).toMatchObject({
    id: "1234567890",
    name: "Test Viewer",
    email: "viewer@example.com",
  });
  expect(isSessionValid(user)).toBe(true);
});

test("rejects tokens from another issuer, another app, or that have expired", () => {
  expect(() => userFromCredential(makeGoogleCredential({ iss: "evil.example" }), CLIENT_ID)).toThrow(
    /not issued by Google/
  );
  expect(() => userFromCredential(makeGoogleCredential({ aud: "other" }), CLIENT_ID)).toThrow(
    /different app/
  );
  expect(() =>
    userFromCredential(makeGoogleCredential({ exp: Math.floor(Date.now() / 1000) - 5 }), CLIENT_ID)
  ).toThrow(/expired/);
});

test("drops an expired stored session", () => {
  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({ id: "1", name: "Old", expiresAt: Date.now() - 1 })
  );
  expect(loadStoredUser()).toBeNull();
  expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
});
