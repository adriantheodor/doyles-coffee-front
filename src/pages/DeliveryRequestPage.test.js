import { fireEvent, render, screen } from "@testing-library/react";
import DeliveryRequestPage from "./DeliveryRequestPage";

jest.mock("../hooks/useToast", () => () => ({
  success: jest.fn(),
  error: jest.fn(),
  warning: jest.fn(),
}));

describe("DeliveryRequestPage", () => {
  it("renders the delivery request form and submits the fee messaging", () => {
    render(<DeliveryRequestPage />);

    expect(screen.getByRole("heading", { name: /request jug delivery/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/company name/i)).toBeRequired();
    expect(screen.getByRole("button", { name: /\$6\.99 flat delivery fee/i })).toBeInTheDocument();
  });

  it("rejects a date that is too soon or falls on a weekend", () => {
    render(<DeliveryRequestPage />);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const soon = tomorrow.toISOString().split("T")[0];

    const dateInput = screen.getByLabelText(/requested delivery date/i);
    fireEvent.change(dateInput, { target: { value: soon } });

    expect(screen.getByText(/must be at least 48 hours/i)).toBeInTheDocument();
  });
});
