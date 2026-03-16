import { useState } from "react";
import pic1 from "../assets/pic1.jpeg";
import pic2 from "../assets/pic2.jpeg";
import pic3 from "../assets/pic3.jpeg";
import pic4 from "../assets/pic4.jpeg";
import pic5 from "../assets/pic5.jpeg";
import pic6 from "../assets/pic6.jpeg";
import pic7 from "../assets/pic7.jpeg";
import pic8 from "../assets/pic8.jpeg";
import pic9 from "../assets/pic9.jpeg";
import "./GalleryPage.css";

const galleryImages = [
  { src: pic6, alt: "Fresh fruit and healthy options" },
  { src: pic1, alt: "Gourmet coffee service setup" },
  { src: pic2, alt: "Variety of snacks and treats" },
  { src: pic3, alt: "Modern water filtration system" },
  { src: pic4, alt: "Clean, well-stocked pantry area" },
  { src: pic5, alt: "Espresso machine in an office breakroom" },
  { src: pic7, alt: "Beverage station with cold drinks" },
  { src: pic8, alt: "Vending machine with high-end snacks" },
  { src: pic9, alt: "Team members enjoying coffee break" },
];

const GalleryPage = () => {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const goPrev = (e) => {
    e.stopPropagation();
    setLightboxIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  const handleKeyDown = (e) => {
    if (lightboxIndex === null) return;
    if (e.key === "ArrowRight") goNext(e);
    if (e.key === "ArrowLeft") goPrev(e);
    if (e.key === "Escape") closeLightbox();
  };

  return (
    <div className="gallery-page" onKeyDown={handleKeyDown} tabIndex={-1}>
      <header className="gallery-header">
        <div className="container text-center py-5">
          <h1 className="fw-bold">Our Gallery</h1>
          <p className="text-muted fs-5">
            Take a look at our coffee and break room setups — click any photo to
            enlarge it.
          </p>
        </div>
      </header>

      <div className="container py-5">
        <div className="gallery-grid">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="gallery-item"
              onClick={() => openLightbox(index)}
              role="button"
              tabIndex={0}
              aria-label={`View full size: ${image.alt}`}
              onKeyDown={(e) => e.key === "Enter" && openLightbox(index)}
            >
              <img src={image.src} alt={image.alt} />
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
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
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
            <img
              src={galleryImages[lightboxIndex].src}
              alt={galleryImages[lightboxIndex].alt}
            />
            <p className="lightbox-caption">
              {galleryImages[lightboxIndex].alt}
            </p>
            <p className="lightbox-counter">
              {lightboxIndex + 1} / {galleryImages.length}
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
