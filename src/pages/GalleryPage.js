import React, { useEffect, useState } from "react";
import { fetchGalleryImages } from "../services/galleryService";
import "./GalleryPage.css";

const imageModules = require.context("../assets", false, /\.(png|jpe?g|webp)$/);

const fallbackImages = imageModules.keys().map((key) => ({
  src: imageModules(key),
  alt: key.replace(/^\.\//, "").replace(/\.(png|jpe?g|webp)$/i, ""),
}));

const getImageSource = (image) =>
  image?.url || image?.imageUrl || image?.path || image?.src || "";

const getImageAlt = (image, index) =>
  image?.alt || image?.caption || image?.title || `Gallery image ${index + 1}`;

const GalleryPage = () => {
  const [images, setImages] = useState(fallbackImages);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadImages = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await fetchGalleryImages();
        if (!isMounted) return;

        if (Array.isArray(result) && result.length > 0) {
          setImages(
            result.map((image, index) => ({
              ...image,
              src: getImageSource(image),
              alt: getImageAlt(image, index),
            }))
          );
        } else {
          setImages(fallbackImages);
        }
      } catch (fetchError) {
        if (!isMounted) return;
        setError(fetchError.message || "Unable to load gallery images.");
        setImages(fallbackImages);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, []);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e) => {
    if (lightboxIndex === null) return;
    if (e.key === "ArrowRight") goNext(e);
    if (e.key === "ArrowLeft") goPrev(e);
    if (e.key === "Escape") closeLightbox();
  };

  const visibleImages = images.length > 0 ? images : fallbackImages;
  const activeImage = visibleImages[lightboxIndex] || null;

  return (
    <div className="gallery-page" onKeyDown={handleKeyDown} tabIndex={-1}>
      <header className="gallery-header">
        <div className="gallery-header-inner">
          <h1>Our Gallery</h1>
          <p>
            Browse our coffee spaces and featured setups. Click any image to enlarge it.
          </p>
        </div>
      </header>

      <div className="gallery-content">
        {loading && (
          <div className="gallery-message gallery-loading">Loading gallery images…</div>
        )}

        {error && <div className="gallery-message gallery-error">{error}</div>}

        {!loading && visibleImages.length === 0 && (
          <div className="gallery-message gallery-empty">No images available yet.</div>
        )}

        {!loading && visibleImages.length > 0 && (
          <div className="gallery-grid">
            {visibleImages.map((image, index) => (
              <div
                key={`${image.src || image.url || image.path || index}`}
                className="gallery-item"
                onClick={() => openLightbox(index)}
                role="button"
                tabIndex={0}
                aria-label={`View full size: ${getImageAlt(image, index)}`}
                onKeyDown={(e) => e.key === "Enter" && openLightbox(index)}
              >
                <img src={getImageSource(image)} alt={getImageAlt(image, index)} />
                <div className="gallery-item-overlay">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lightboxIndex !== null && activeImage && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close"
          >
            &times;
          </button>

          <button
            className="lightbox-nav lightbox-prev"
            onClick={goPrev}
            aria-label="Previous image"
          >
            &#8249;
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={getImageSource(activeImage)} alt={getImageAlt(activeImage, lightboxIndex)} />
            <p className="lightbox-caption">{getImageAlt(activeImage, lightboxIndex)}</p>
            <p className="lightbox-counter">
              {lightboxIndex + 1} / {visibleImages.length}
            </p>
          </div>

          <button
            className="lightbox-nav lightbox-next"
            onClick={goNext}
            aria-label="Next image"
          >
            &#8250;
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
