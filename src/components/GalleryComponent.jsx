import React, { useEffect, useState } from "react";
import { fetchGalleryImages } from "../services/galleryService";
import "./GalleryComponent.css";

const GalleryComponent = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadImages = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await fetchGalleryImages();
        if (!isMounted) return;
        setImages(result);
      } catch (fetchError) {
        if (!isMounted) return;
        setError(fetchError.message || "Unable to load gallery images.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadImages();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="gallery-component">
      <div className="gallery-component-header">
        <h1>Gallery Preview</h1>
        <p>Images loaded from the server via <code>GET /api/images</code>.</p>
      </div>

      {loading && (
        <div className="gallery-message gallery-loading">Loading gallery images…</div>
      )}

      {error && <div className="gallery-message gallery-error">{error}</div>}

      {!loading && !error && images.length === 0 && (
        <div className="gallery-message gallery-empty">No images available yet.</div>
      )}

      {!loading && !error && images.length > 0 && (
        <div className="gallery-grid">
          {images.map((image, index) => {
            const imageUrl = image.url || image.imageUrl || image.path || image.src || "";
            const altText = image.alt || image.caption || `Gallery image ${index + 1}`;
            const captionText = image.caption || image.title || image.description || "";
            return (
              <article key={index} className="gallery-card">
                <div className="gallery-card-image-wrapper">
                  <img src={imageUrl} alt={altText} />
                </div>
                {captionText && <p className="gallery-card-caption">{captionText}</p>}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default GalleryComponent;
