import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isSessionValid } from "../utils/auth";

// Guards every page of the app (FR-2). Anyone who is not signed in, or whose
// Google session has expired, is sent to the login screen. The page they
// asked for is remembered so login can return them to it.
function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!isSessionValid(user)) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default RequireAuth;
