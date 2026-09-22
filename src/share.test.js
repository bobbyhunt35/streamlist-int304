import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import {
  canShare,
  createShare,
  addComment,
  toggleReaction,
  getShare,
  stopSharing,
} from "./utils/sharing";

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("share rules (FR-12)", () => {
  test("only Premium, Family, and Social plans can share", () => {
    expect(canShare("Premium")).toBe(true);
    expect(canShare("Family")).toBe(true);
    expect(canShare("Social")).toBe(true);
    expect(canShare("Basic")).toBe(false);
    expect(canShare("Gold")).toBe(false);
  });

  test("a Basic plan sees an upgrade message and no share button", () => {
    renderAt("/streamlist");

    expect(screen.getByText(/sharing is available on the/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /create share link/i })
    ).not.toBeInTheDocument();
  });

  test("a Premium subscriber can create and stop a share link", async () => {
    renderAt("/streamlist");

    userEvent.selectOptions(screen.getByLabelText(/your plan/i), "Premium");
    userEvent.click(screen.getByRole("button", { name: /create share link/i }));

    const link = screen.getByLabelText(/share link/i);
    expect(link.value).toMatch(/\/shared\/.+/);

    userEvent.click(screen.getByRole("button", { name: /stop sharing/i }));
    expect(screen.getByText(/link no longer works/i)).toBeInTheDocument();
  });

  test("only title, id, and watched state are copied into a share", () => {
    const share = createShare([
      { id: 1, text: "Alien", completed: true, secret: "nope" },
    ]);

    expect(share.items).toEqual([{ id: 1, text: "Alien", completed: true }]);
  });

  test("stopping a share removes it", () => {
    const share = createShare([]);
    stopSharing(share.id);

    expect(getShare(share.id)).toBeNull();
  });
});

describe("comments and reactions (FR-13)", () => {
  test("a viewer can post a comment on a shared list", () => {
    const share = createShare([{ id: 1, text: "Heat", completed: false }]);
    renderAt(`/shared/${share.id}`);

    expect(screen.getByText("Heat")).toBeInTheDocument();
    expect(screen.getByText(/no comments yet/i)).toBeInTheDocument();

    const post = screen.getByRole("button", { name: /post comment/i });
    expect(post).toBeDisabled();

    userEvent.type(screen.getByLabelText(/your name/i), "Sam");
    userEvent.type(screen.getByLabelText(/^comment$/i), "Great picks!");
    userEvent.click(post);

    const list = screen.getByRole("list");
    expect(within(list).getByText("Sam")).toBeInTheDocument();
    expect(within(list).getByText("Great picks!")).toBeInTheDocument();
    expect(getShare(share.id).comments).toHaveLength(1);
  });

  test("a blank name posts as Guest and blank text is rejected", () => {
    const share = createShare([]);

    expect(addComment(share.id, "", "   ")).toBeNull();
    const updated = addComment(share.id, "", "Nice");
    expect(updated.comments[0].author).toBe("Guest");
  });

  test("comments are shown as text, not markup", () => {
    const share = createShare([]);
    addComment(share.id, "Eve", "<b>bold</b>");
    renderAt(`/shared/${share.id}`);

    expect(screen.getByText("<b>bold</b>")).toBeInTheDocument();
  });

  test("a viewer can toggle a reaction on and off", () => {
    const share = createShare([]);
    renderAt(`/shared/${share.id}`);

    const like = screen.getByRole("button", { name: /like/i });
    expect(like).toHaveAttribute("aria-pressed", "false");

    userEvent.click(like);
    expect(like).toHaveAttribute("aria-pressed", "true");
    expect(within(like).getByText("1")).toBeInTheDocument();

    userEvent.click(like);
    expect(like).toHaveAttribute("aria-pressed", "false");
    expect(within(like).getByText("0")).toBeInTheDocument();
  });

  test("unknown reactions are ignored", () => {
    const share = createShare([]);

    expect(toggleReaction(share.id, "boo", "viewer")).toBeNull();
  });

  test("an unknown share link shows a plain message", () => {
    renderAt("/shared/does-not-exist");

    expect(screen.getByText(/could not find this shared list/i)).toBeInTheDocument();
  });
});
