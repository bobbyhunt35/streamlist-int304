import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  getGoogleClientId,
  isSessionValid,
  loadStoredUser,
  storeUser,
  userFromCredential,
} from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);

  // Called with the ID token Google returns after a successful sign-in.
  const signIn = useCallback((credential) => {
    const nextUser = userFromCredential(credential, getGoogleClientId());
    storeUser(nextUser);
    setUser(nextUser);
    return nextUser;
  }, []);

  const signOut = useCallback(() => {
    storeUser(null);
    setUser(null);
    // Stop Google from silently signing the same account back in.
    window.google?.accounts?.id?.disableAutoSelect?.();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: isSessionValid(user),
      signIn,
      signOut,
    }),
    [user, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
}
