import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { makeGoogleCredential, signInTestUser } from "./utils/testAuth";

const CLIENT_ID = "test-client-id.apps.googleusercontent.com";

function renderApp(path = "/streamlist") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

beforeEach(() => {
  window.localStorage.clear();
  delete window.google;
  delete process.env.REACT_APP_GOOGLE_CLIENT_ID;
});

describe("signed in", () => {
  beforeEach(() => signInTestUser());

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

  test("shows the signed-in user and signs out to the login screen", () => {
    renderApp();

    expect(screen.getByText("Test Viewer")).toBeInTheDocument();
    userEvent.click(screen.getByRole("button", { name: /sign out/i }));

    expect(screen.getByRole("heading", { name: /sign in to streamlist/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /movies/i })).not.toBeInTheDocument();
    expect(window.localStorage.getItem("streamlist.auth.user")).toBeNull();
  });
});

describe("Google OAuth login (FR-1, FR-2)", () => {
  test.each(["/streamlist", "/movies", "/cart", "/credit-card", "/about"])(
    "redirects %s to the login screen when signed out",
    (path) => {
      renderApp(path);

      expect(screen.getByRole("heading", { name: /sign in to streamlist/i })).toBeInTheDocument();
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    }
  );

  test("an expired session is sent back to the login screen", () => {
    signInTestUser({ expiresAt: Date.now() - 1000 });
    renderApp("/cart");

    expect(screen.getByRole("heading", { name: /sign in to streamlist/i })).toBeInTheDocument();
  });

  test("explains how to configure Google sign-in when the client ID is missing", () => {
    renderApp("/login");

    expect(screen.getByRole("alert")).toHaveTextContent("REACT_APP_GOOGLE_CLIENT_ID");
  });

  test("a successful Google sign-in opens the page the user asked for", async () => {
    process.env.REACT_APP_GOOGLE_CLIENT_ID = CLIENT_ID;
    let googleCallback;
    window.google = {
      accounts: {
        id: {
          initialize: jest.fn((config) => {
            googleCallback = config.callback;
          }),
          renderButton: jest.fn(),
          disableAutoSelect: jest.fn(),
        },
      },
    };

    renderApp("/cart");
    await screen.findByTestId("google-signin-button");
    await act(async () => {});

    expect(window.google.accounts.id.initialize).toHaveBeenCalledWith(
      expect.objectContaining({ client_id: CLIENT_ID })
    );
    expect(window.google.accounts.id.renderButton).toHaveBeenCalled();

    act(() => googleCallback({ credential: makeGoogleCredential({ aud: CLIENT_ID }) }));

    expect(await screen.findByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText("Test Viewer")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cart/i })).toHaveClass("active");
  });

  test("rejects a token issued for a different app", async () => {
    process.env.REACT_APP_GOOGLE_CLIENT_ID = CLIENT_ID;
    let googleCallback;
    window.google = {
      accounts: {
        id: {
          initialize: jest.fn((config) => {
            googleCallback = config.callback;
          }),
          renderButton: jest.fn(),
        },
      },
    };

    renderApp("/streamlist");
    await screen.findByTestId("google-signin-button");
    await act(async () => {});

    act(() => googleCallback({ credential: makeGoogleCredential({ aud: "someone-else" }) }));

    expect(screen.getByRole("alert")).toHaveTextContent(/different app/i);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
