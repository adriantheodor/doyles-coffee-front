import { render, screen } from "@testing-library/react";
import { fetchGalleryImages } from "../services/galleryService";
import GalleryPage from "./GalleryPage";

jest.mock("../services/galleryService", () => ({
  fetchGalleryImages: jest.fn(),
}));

test("displays only Cloudinary images returned by the gallery API", async () => {
  fetchGalleryImages.mockResolvedValue([
    {
      secure_url: "https://res.cloudinary.com/demo/image/upload/gallery-photo.jpg",
      alt: "Cloudinary photo",
    },
    {
      url: "https://example.com/site-photo.jpg",
      alt: "Site photo",
    },
  ]);

  render(<GalleryPage />);

  expect(await screen.findByAltText("Cloudinary photo")).toHaveAttribute(
    "src",
    "https://res.cloudinary.com/demo/image/upload/gallery-photo.jpg"
  );
  expect(screen.queryByAltText("Site photo")).not.toBeInTheDocument();
});
