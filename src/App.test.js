import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

function renderApp() {
  return render(
    <MemoryRouter initialEntries={["/streamlist"]}>
      <App />
    </MemoryRouter>
  );
}

test("renders the StreamList navigation options", () => {
  renderApp();

  expect(screen.getByRole("link", { name: /movies/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /cart/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
});

test("renders the StreamList input form", () => {
  renderApp();

  expect(screen.getByPlaceholderText(/enter a movie or show/i)).toBeInTheDocument();
});
