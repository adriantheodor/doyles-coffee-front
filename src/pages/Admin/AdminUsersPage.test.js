import React from "react";
import { render, screen } from "@testing-library/react";
import AdminUsersPage from "./AdminUsersPage";
import authService from "../../services/authService";

jest.mock("../../services/authService", () => ({
  __esModule: true,
  default: {
    getAllUsers: jest.fn(),
  },
}));

describe("AdminUsersPage", () => {
  it("renders users and excludes password values", async () => {
    authService.getAllUsers.mockResolvedValue([
      {
        id: 1,
        name: "Alice Example",
        email: "alice@example.com",
        role: "admin",
        password: "super-secret",
      },
    ]);

    render(<AdminUsersPage />);

    expect(await screen.findByText("Admin Users")).toBeInTheDocument();
    expect(await screen.findByText("Alice Example")).toBeInTheDocument();
    expect(screen.queryByText("super-secret")).not.toBeInTheDocument();
  });
});
