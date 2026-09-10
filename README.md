# StreamList

StreamList is a React-based web application created for EZTechMovie.

Users enter the name of a movie or program they want to watch, and every entry is
displayed on the page as a managed list. The current version uses React Router to
provide navigation between four pages:

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
- JavaScript
- CSS
- Google Fonts (Material Symbols, Poppins)
- react-icons
- Visual Studio Code

## Getting Started

```bash
npm install
npm start
```

The app runs at http://localhost:3000 and redirects to `/streamlist`.

## Project Structure

```
src/
  App.js                  routing shell + persistent navigation
  App.css                 application styles
  components/
    Navigation.js         React Router NavLink nav bar
  pages/
    StreamList.js         list state, add/edit/delete/complete
    Movies.js             placeholder
    Cart.js               placeholder
    About.js              placeholder
```

## Future Development

The Movies and Cart pages will be developed further in Week 4. The About page
will be expanded in Week 5.

## Course

INT 499 Technology Capstone
