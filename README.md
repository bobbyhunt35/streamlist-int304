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
5. Start the application with `npm start`.

Restart the development server after creating or changing `.env.local`. The
`.env.local` file is ignored by Git and must not be committed.

The app runs at http://localhost:3000 and redirects to `/streamlist`.

## Project Structure

```
src/
  App.js                  routing shell + persistent navigation
  App.css                 application styles
  components/
    Navigation.js         React Router NavLink nav bar
    SharePanel.js         plan check and share link controls
  pages/
    StreamList.js         list state, add/edit/delete/complete
    Movies.js             TMDB search and saved search results
    SharedList.js         shared list view with comments and reactions
    Cart.js               placeholder
    About.js              placeholder
  utils/
    sharing.js            share, comment, and reaction storage helpers
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

Shared lists are stored in the browser for now, so a share link opens only on the
device that created it. A backend is needed to share across devices.

## Course

INT 499 Technology Capstone

## Credit card checkout addition

Add a subscription or accessory to the cart, open Cart, and select **Checkout** beneath the total. The new `/credit-card` page formats sixteen digits as `1234 5678 9012 3456`, validates the name and future expiration date, and saves demo cards in browser localStorage. Cards persist on refresh and can be deleted.

Use invented numbers only. This assignment demo stores full numbers in localStorage and does not process payments. Never enter a real payment card. A production app should use a payment processor and store only a token and limited card metadata.
