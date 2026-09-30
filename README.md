# StreamList

StreamList is a React-based web application created for EZTechMovie.

Users can manage a personal watch queue and search for current movie information
retrieved from The Movie Database (TMDB). React Router provides navigation between
four pages:

- StreamList
- Movies
- Cart
- About

## Current Functionality

- **Add** — the submit form validates against empty input, adds the entry to React
  state, and clears the input field immediately.
- **Display** — every entry is rendered as a list item directly from a `useState`
  array, so the page updates without a reload.
- **Complete** — toggles a `completed` flag in state; completed items are styled
  differently and counted in the summary bar.
- **Edit** — puts a single item into an editable state (`editingId` / `editText`)
  with Save and Cancel controls. Enter saves, Escape cancels.
- **Delete** — removes the item from the state array.
- **Clear watched** — bulk-removes every completed item.
- **Persistence** — the queue is saved to `localStorage`, so it survives a refresh.
- **TMDB movie search** — searches the TMDB API and displays posters, titles,
  release dates, ratings, and summaries on the separate Movies route.
- **Persistent searches** — the latest search and its results are saved to
  `localStorage` and restored after a page refresh.
- **Share a StreamList** — subscribers on the Premium, Family, or Social plan can
  create a share link from the StreamList page, update the shared copy, or stop
  sharing. Only titles and watched status are copied.
- **Comments and reactions** — anyone who opens a shared list can like it, love
  it, or mark it a great pick, and can post comments (500 characters, optional
  name). Comments render as plain text.
- **Google sign-in** — every page requires signing in with Google (OAuth 2.0 /
  OpenID Connect through Google Identity Services). Anyone who is not signed in
  is redirected to `/login`; after a successful sign-in they return to the page
  they asked for. The nav bar shows the signed-in user and a Sign out button.
- **Credit card checkout** — a Checkout button under the cart total opens a card
  form that formats numbers as `1234 5678 9012 3456` and saves demo cards to
  `localStorage`.
- **Installable PWA** — a web app manifest and service worker make StreamList
  installable on the desktop and keep the app shell available offline.
- **Navigation** — a persistent nav bar built with React Router `NavLink`, which
  highlights the page the user is currently on.

## Icon and Font Library

Icons and typography are installed from [Google Fonts](https://fonts.google.com/):

- **Material Symbols Rounded** — interface icons (add, edit, delete, check, and
  the navigation icons), loaded via `<link>` in `public/index.html` and rendered
  as `<span className="material-symbols-rounded">icon_name</span>`.
- **Poppins** — the application typeface.

`react-icons` is also installed and supplies the film brand mark used in the
navigation bar and the StreamList page heading.

## Technologies Used

- React
- React Router
- TMDB API
- JavaScript
- CSS
- Google Fonts (Material Symbols, Poppins)
- react-icons
- Visual Studio Code

## Getting Started

1. Install the project dependencies with `npm install`.
2. Create a free TMDB account and obtain an API key.
3. Copy `.env.example` to `.env.local`.
4. Replace `your_tmdb_api_key_here` with the TMDB API key.
5. Add a Google OAuth client ID as `REACT_APP_GOOGLE_CLIENT_ID` (see
   "Google OAuth setup" below).
6. Start the application with `npm start`.

Restart the development server after creating or changing `.env.local`. The
`.env.local` file is ignored by Git and must not be committed.

The app runs at http://localhost:3000 and redirects to `/login` until you sign in.

## Google OAuth setup

1. In [Google Cloud Console](https://console.cloud.google.com/), create or pick a
   project, then open **Google Auth Platform** (APIs & Services > OAuth consent
   screen) and configure the app as **External**.
2. Under **Audience > Test users**, add the Google account of everyone who will
   sign in. While the app is in *Testing*, other accounts see "Access blocked".
3. Under **Clients** (APIs & Services > Credentials), create an **OAuth client ID**
   of type **Web application**. Add these **Authorized JavaScript origins**:
   `http://localhost:3000` (dev server) and the origin you serve the production
   build from, such as `http://localhost:5000`. Origins must match exactly,
   including the port.
4. Copy the client ID into `.env.local` as `REACT_APP_GOOGLE_CLIENT_ID` and
   restart `npm start`.

How it works: `src/pages/Login.js` loads Google Identity Services and renders the
"Sign in with Google" button. Google returns a signed ID token (JWT);
`src/utils/auth.js` checks its issuer, audience (our client ID) and expiry and
keeps only the name, email, picture and expiry in `localStorage`
(`streamlist.auth.user`). `src/components/RequireAuth.js` wraps every route
except `/login`. StreamList never sees or stores a password.

Production note: the browser check is not a substitute for verifying the ID
token's signature. Before launch, a backend should verify each token with
Google (for example with `google-auth-library`) and issue its own session.

## Project Structure

```
src/
  App.js                  routing shell + persistent navigation
  App.css                 application styles
  components/
    Navigation.js         React Router NavLink nav bar
    SharePanel.js         plan check and share link controls
    RequireAuth.js        redirects signed-out users to /login (FR-2)
  context/
    AuthContext.js        signed-in user, signIn, signOut
    CartContext.js        cart state
  pages/
    StreamList.js         list state, add/edit/delete/complete
    Movies.js             TMDB search and saved search results
    SharedList.js         shared list view with comments and reactions
    Login.js              Google sign-in screen (FR-1)
    Cart.js               cart items, quantities, totals, Checkout
    CreditCard.js         card form saved to localStorage
    Subscriptions.js      subscription plans
    About.js              about page
  utils/
    sharing.js            share, comment, and reaction storage helpers
    auth.js               Google ID token decoding and session storage
```

## Local Storage Keys

- `streamlist.items` stores the user's watch queue and watched status.
- `streamlist.movieSearch` stores the latest TMDB search and its results.
- `streamlist.plan` stores the plan chosen in the share panel (temporary until
  subscriptions are built).
- `streamlist.shares` stores shared lists with their comments and reactions.
- `streamlist.activeShareId` stores the share link currently active.
- `streamlist.viewerId` is an anonymous id so a viewer can toggle their own
  reaction.
- `streamlist.auth.user` stores the signed-in Google profile (name, email,
  picture) and when the session expires. No tokens or passwords are kept.
- `streamlist.creditCards.demo` stores demo credit cards (classroom only).

Shared lists are stored in the browser for now, so a share link opens only on the
device that created it. A backend is needed to share across devices.

## Course

INT 499 Technology Capstone

## Credit card checkout addition

Add a subscription or accessory to the cart, open Cart, and select **Checkout** beneath the total. The new `/credit-card` page formats sixteen digits as `1234 5678 9012 3456`, validates the name and future expiration date, and saves demo cards in browser localStorage. Cards persist on refresh and can be deleted.

Use invented numbers only. This assignment demo stores full numbers in localStorage and does not process payments. Never enter a real payment card. A production app should use a payment processor and store only a token and limited card metadata.
