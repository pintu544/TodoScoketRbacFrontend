import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider } from "../../contexts/AuthContext";
import NotificationCenter from "../Notifications/NotificationCenter";

describe("NotificationCenter Component", () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  it("renders notification center and displays notifications", async () => {
    const mockNotifications = [
      {
        _id: "1",
        message: "Test notification 1",
        read: false,
        timestamp: new Date().toISOString(),
      },
      {
        _id: "2",
        message: "Test notification 2",
        read: true,
        timestamp: new Date().toISOString(),
      },
    ];

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockNotifications),
      })
    );

    render(
      <AuthProvider>
        <NotificationCenter />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Test notification 1")).toBeInTheDocument();
      expect(screen.getByText("Test notification 2")).toBeInTheDocument();
    });

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("marks notification as read", async () => {
    const mockNotifications = [
      {
        _id: "1",
        message: "Test notification",
        read: false,
        timestamp: new Date().toISOString(),
      },
    ];

    fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockNotifications),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      );

    render(
      <AuthProvider>
        <NotificationCenter />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      fireEvent.click(screen.getByText("Test notification"));
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch.mock.calls[1][0]).toContain("/notifications/1/read");
    });
  });
});
