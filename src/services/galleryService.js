import { API_BASE } from "../utils/api";

const GALLERY_STORAGE_KEY = "adminGalleryImages";

export function getGalleryImages() {
  const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to parse gallery images from localStorage", error);
    return [];
  }
}

export function addGalleryImages(images) {
  const existing = getGalleryImages();
  const allImages = [...existing, ...images];
  localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(allImages));
  return allImages;
}

export async function uploadImage({ file, caption = "", token }) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("caption", caption || "");

  const authToken = token || localStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE}api/images`, {
    method: "POST",
    headers: authToken
      ? {
          Authorization: `Bearer ${authToken}`,
        }
      : {},
    body: formData,
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    throw new Error(errorPayload.message || "Image upload failed");
  }

  return response.json();
}

export async function fetchGalleryImages() {
  const response = await fetch(`${API_BASE}api/images`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    throw new Error(errorPayload.message || "Failed to fetch gallery images.");
  }

  return response.json();
}

export function clearGalleryImages() {
  localStorage.removeItem(GALLERY_STORAGE_KEY);
}
