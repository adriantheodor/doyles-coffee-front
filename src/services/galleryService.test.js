jest.mock("../utils/api", () => ({ API_BASE: "/" }));

import { API_BASE } from "../utils/api";
import { deleteGalleryImage } from "./galleryService";

const originalFetch = global.fetch;

describe("deleteGalleryImage", () => {
  beforeEach(() => {
    localStorage.setItem("accessToken", "admin-jwt");
    global.fetch = jest.fn();
  });

  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
    global.fetch = originalFetch;
  });

  it("sends an authenticated DELETE request and returns its response", async () => {
    const result = {
      message: "Image deleted successfully",
      imageId: "photo-1",
    };
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(result),
    });

    await expect(deleteGalleryImage("photo-1")).resolves.toEqual(result);

    expect(global.fetch).toHaveBeenCalledWith(`${API_BASE}api/images/photo-1`, {
      method: "DELETE",
      headers: { Authorization: "Bearer admin-jwt" },
    });
  });

  it("preserves the HTTP status and API message on failures", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: jest.fn().mockResolvedValue({ message: "Image not found" }),
    });

    await expect(deleteGalleryImage("missing-photo")).rejects.toMatchObject({
      message: "Image not found",
      status: 404,
    });
  });
});
