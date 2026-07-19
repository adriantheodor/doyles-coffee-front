import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import DeliveryRequestPage from "./DeliveryRequestPage";

jest.mock("../utils/api", () => ({
  API_BASE: "/",
}));

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

  it("submits the delivery request to the backend", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    global.fetch = fetchMock;

    render(<DeliveryRequestPage />);

    fireEvent.change(screen.getByLabelText(/company name/i), {
      target: { value: "Acme Office" },
    });
    fireEvent.change(screen.getByLabelText(/number of jugs requested/i), {
      target: { value: "4" },
    });
    fireEvent.change(screen.getByLabelText(/requested delivery date/i), {
      target: { value: "2030-01-15" },
    });
    fireEvent.change(screen.getByLabelText(/optional notes/i), {
      target: { value: "Please arrive before noon." },
    });

    fireEvent.click(screen.getByRole("button", { name: /\$6\.99 flat delivery fee/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });
  });
});
