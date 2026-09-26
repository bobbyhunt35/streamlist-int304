import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreditCard from "./CreditCard";

beforeEach(() => localStorage.clear());

test("formats a sixteen-digit number and persists a demo card", () => {
  render(<MemoryRouter><CreditCard /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText("Name on card"), { target: { value: "Alex Morgan" } });
  fireEvent.change(screen.getByLabelText("Card number"), { target: { value: "1234567890123456" } });
  fireEvent.change(screen.getByLabelText("Expiration date"), { target: { value: "12/99" } });
  expect(screen.getByLabelText("Card number")).toHaveValue("1234 5678 9012 3456");
  fireEvent.click(screen.getByRole("button", { name: /save card/i }));
  expect(screen.getByRole("status")).toHaveTextContent("Card saved");
  expect(JSON.parse(localStorage.getItem("streamlist.creditCards.demo"))[0].number).toBe("1234 5678 9012 3456");
  expect(screen.getByText(/•••• 3456/)).toBeInTheDocument();
});
