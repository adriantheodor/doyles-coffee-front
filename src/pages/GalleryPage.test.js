import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  deleteGalleryImage,
  fetchGalleryImages,
} from "../services/galleryService";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import GalleryPage from "./GalleryPage";

jest.mock("../services/galleryService", () => ({
  deleteGalleryImage: jest.fn(),
  fetchGalleryImages: jest.fn(),
}));

jest.mock("../hooks/useAuth", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../hooks/useToast", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const galleryImages = [
  {
    _id: "photo-1",
    secure_url: "https://res.cloudinary.com/demo/image/upload/gallery-photo.jpg",
    alt: "Cloudinary photo",
  },
  {
    _id: "photo-2",
    secure_url: "https://res.cloudinary.com/demo/image/upload/second-photo.jpg",
    alt: "Second photo",
  },
  {
    url: "https://example.com/site-photo.jpg",
    alt: "Site photo",
  },
];

const toast = {
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
};

beforeEach(() => {
  fetchGalleryImages.mockResolvedValue(galleryImages);
  useAuth.mockReturnValue({ user: { role: "customer" } });
  useToast.mockReturnValue(toast);
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

test("displays only Cloudinary images returned by the gallery API", async () => {
  render(<GalleryPage />);

  expect(await screen.findByAltText("Cloudinary photo")).toHaveAttribute(
    "src",
    "https://res.cloudinary.com/demo/image/upload/gallery-photo.jpg"
  );
  expect(screen.queryByAltText("Site photo")).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
});

test("allows admins to confirm deletion and removes only the deleted photo", async () => {
  useAuth.mockReturnValue({ user: { role: "admin" } });
  deleteGalleryImage.mockResolvedValue({
    message: "Image deleted successfully",
    imageId: "photo-1",
  });
  jest.spyOn(window, "confirm").mockReturnValue(true);

  render(<GalleryPage />);

  fireEvent.click(await screen.findByRole("button", { name: "Delete Cloudinary photo" }));

  expect(window.confirm).toHaveBeenCalledWith(
    'Delete "Cloudinary photo" from the gallery? This action cannot be undone.'
  );
  expect(deleteGalleryImage).toHaveBeenCalledWith("photo-1");
  await waitFor(() => {
    expect(screen.queryByAltText("Cloudinary photo")).not.toBeInTheDocument();
  });
  expect(screen.getByAltText("Second photo")).toBeInTheDocument();
  expect(toast.success).toHaveBeenCalledWith(
    '"Cloudinary photo" was deleted from the gallery.'
  );
});

test("does not delete when the admin cancels confirmation", async () => {
  useAuth.mockReturnValue({ user: { role: "admin" } });
  jest.spyOn(window, "confirm").mockReturnValue(false);

  render(<GalleryPage />);

  fireEvent.click(await screen.findByRole("button", { name: "Delete Cloudinary photo" }));

  expect(deleteGalleryImage).not.toHaveBeenCalled();
  expect(screen.getByAltText("Cloudinary photo")).toBeInTheDocument();
});

test("disables the delete control while the photo is being deleted", async () => {
  useAuth.mockReturnValue({ user: { role: "admin" } });
  let resolveDelete;
  deleteGalleryImage.mockReturnValue(
    new Promise((resolve) => {
      resolveDelete = resolve;
    })
  );
  jest.spyOn(window, "confirm").mockReturnValue(true);

  render(<GalleryPage />);

  fireEvent.click(await screen.findByRole("button", { name: "Delete Cloudinary photo" }));

  const pendingButton = screen.getByRole("button", {
    name: "Delete Cloudinary photo",
  });
  expect(pendingButton).toBeDisabled();
  expect(pendingButton).toHaveTextContent("Deleting...");
  expect(deleteGalleryImage).toHaveBeenCalledTimes(1);

  resolveDelete({ imageId: "photo-1" });
  await waitFor(() => {
    expect(screen.queryByAltText("Cloudinary photo")).not.toBeInTheDocument();
  });
});

test("removes an already-missing photo and notifies the admin", async () => {
  useAuth.mockReturnValue({ user: { role: "admin" } });
  deleteGalleryImage.mockRejectedValue(
    Object.assign(new Error("Image not found"), { status: 404 })
  );
  jest.spyOn(window, "confirm").mockReturnValue(true);

  render(<GalleryPage />);

  fireEvent.click(await screen.findByRole("button", { name: "Delete Cloudinary photo" }));

  await waitFor(() => {
    expect(screen.queryByAltText("Cloudinary photo")).not.toBeInTheDocument();
  });
  expect(toast.info).toHaveBeenCalledWith(
    '"Cloudinary photo" was already missing and has been removed from the gallery.'
  );
});

test("keeps the photo visible and reports other deletion failures", async () => {
  useAuth.mockReturnValue({ user: { role: "admin" } });
  deleteGalleryImage.mockRejectedValue(new Error("Deletion failed"));
  jest.spyOn(window, "confirm").mockReturnValue(true);

  render(<GalleryPage />);

  fireEvent.click(await screen.findByRole("button", { name: "Delete Cloudinary photo" }));

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith("Deletion failed");
  });
  expect(screen.getByAltText("Cloudinary photo")).toBeInTheDocument();
});
