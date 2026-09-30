import React, { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { FaFilm } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { getGoogleClientId } from "../utils/auth";

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";
let googleScriptPromise = null;

// Load the Google Identity Services library once, on demand.
function loadGoogleIdentity() {
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = GOOGLE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () =>
        window.google?.accounts?.id ? resolve(window.google) : reject(new Error("GIS unavailable"));
      script.onerror = () => {
        googleScriptPromise = null;
        reject(new Error("GIS failed to load"));
      };
      document.head.appendChild(script);
    });
  }
  return googleScriptPromise;
}

function destinationFrom(state) {
  const from = state?.from;
  if (!from?.pathname || from.pathname === "/login") return "/streamlist";
  return `${from.pathname}${from.search || ""}${from.hash || ""}`;
}

function Login() {
  const { isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const buttonRef = useRef(null);
  const [error, setError] = useState("");
  const clientId = getGoogleClientId();
  const destination = destinationFrom(location.state);

  useEffect(() => {
    if (!clientId || isAuthenticated) return undefined;
    let cancelled = false;

    loadGoogleIdentity()
      .then((google) => {
        if (cancelled || !buttonRef.current) return;
        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            try {
              signIn(response.credential);
              navigate(destination, { replace: true });
            } catch (err) {
              setError(err.message);
            }
          },
        });
        google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "filled_blue",
          size: "large",
          text: "signin_with",
          shape: "pill",
          width: 280,
        });
      })
      .catch(() => {
        if (!cancelled) {
          setError("Google Sign-In could not load. Check your connection and try again.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [clientId, isAuthenticated, signIn, navigate, destination]);

  if (isAuthenticated) {
    return <Navigate to={destination} replace />;
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand">
          <FaFilm aria-hidden="true" /> StreamList
        </div>
        <h1 id="login-title">Sign in to StreamList</h1>
        <p className="login-intro">
          Use your Google account to reach your watch queue, subscriptions, and cart.
        </p>

        {clientId ? (
          <div className="login-google" ref={buttonRef} data-testid="google-signin-button" />
        ) : (
          <p className="login-config" role="alert">
            Google sign-in is not configured. Add <code>REACT_APP_GOOGLE_CLIENT_ID</code> to{" "}
            <code>.env.local</code> and restart the development server.
          </p>
        )}

        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        <p className="login-note">
          <span className="material-symbols-rounded" aria-hidden="true">
            lock
          </span>
          StreamList signs you in with Google OAuth 2.0 and OpenID Connect. Your Google password
          is never seen or stored by StreamList.
        </p>
      </section>
    </main>
  );
}

export default Login;
