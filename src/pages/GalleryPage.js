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
import pic10 from "../assets/pic10.jpeg";
import pic11 from "../assets/pic11.jpeg";
import pic12 from "../assets/pic12.jpeg";
import pic13 from "../assets/pic13.jpeg";
import pic14 from "../assets/pic14.jpeg";
import pic15 from "../assets/pic15.jpeg";
import pic16 from "../assets/pic16.jpeg";
import pic17 from "../assets/pic17.jpeg";
import pic18 from "../assets/pic18.jpeg";
import pic19 from "../assets/pic19.jpeg";
import pic20 from "../assets/pic20.jpeg";
import pic21 from "../assets/pic21.jpeg";
import pic22 from "../assets/pic22.jpeg";
import pic23 from "../assets/pic23.jpeg";
import pic24 from "../assets/pic24.jpeg";
import pic25 from "../assets/pic25.jpeg";
import pic26 from "../assets/pic26.jpeg";
import pic27 from "../assets/pic27.jpeg";
import pic28 from "../assets/pic28.jpeg";
import pic29 from "../assets/pic29.jpeg";
import pic30 from "../assets/pic30.jpeg";     
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
  { src: pic10, alt: "Gourmet coffee service setup" },
  { src: pic11, alt: "Variety of snacks and treats" },
  { src: pic12, alt: "Modern water filtration system" },
  { src: pic13, alt: "Clean, well-stocked pantry area" },
  { src: pic14, alt: "Espresso machine in an office breakroom" },
  { src: pic15, alt: "Beverage station with cold drinks" },
  { src: pic16, alt: "Vending machine with high-end snacks" },
  { src: pic17, alt: "Team members enjoying coffee break" },
  { src: pic18, alt: "Gourmet coffee service setup" },
  { src: pic19, alt: "Variety of snacks and treats" },
  { src: pic20, alt: "Modern water filtration system" },
  { src: pic21, alt: "Clean, well-stocked pantry area" },
  { src: pic22, alt: "Espresso machine in an office breakroom" },
  { src: pic23, alt: "Beverage station with cold drinks" },
  { src: pic24, alt: "Vending machine with high-end snacks" },
  { src: pic25, alt: "Team members enjoying coffee break" },
  { src: pic26, alt: "Gourmet coffee service setup" },
  { src: pic27, alt: "Variety of snacks and treats" },
  { src: pic28, alt: "Modern water filtration system" },
  { src: pic29, alt: "Clean, well-stocked pantry area" },
  { src: pic30, alt: "Espresso machine in an office breakroom" }
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
