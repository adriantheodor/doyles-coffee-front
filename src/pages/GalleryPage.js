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
import pic31 from "../assets/pic31.jpeg";
import pic32 from "../assets/pic32.jpeg";
import pic33 from "../assets/pic33.jpeg";
import pic34 from "../assets/pic34.jpeg";
import pic35 from "../assets/pic35.jpeg"; 
import pic36 from "../assets/pic36.jpeg";
import pic37 from "../assets/pic37.jpeg";
import pic38 from "../assets/pic38.jpeg";
import pic39 from "../assets/pic39.jpeg";   
import pic40 from "../assets/pic40.jpeg";
import pic41 from "../assets/pic41.jpeg";
import pic42 from "../assets/pic42.jpeg";
import pic43 from "../assets/pic43.jpeg"; 
import pic44 from "../assets/pic44.jpeg";
import pic45 from "../assets/pic45.jpeg";
import pic46 from "../assets/pic46.jpeg";
import pic47 from "../assets/pic47.jpeg";
import pic48 from "../assets/pic48.jpeg";
import pic49 from "../assets/pic49.jpeg";
import pic50 from "../assets/pic50.jpeg";
import pic51 from "../assets/pic51.jpeg";
import pic52 from "../assets/pic52.jpeg";
import pic53 from "../assets/pic53.jpeg";
import "./GalleryPage.css";

const galleryImages = [
  
  { src: pic1},
  { src: pic2, },
  { src: pic3},
  { src: pic4},
  { src: pic5 },
  { src: pic6 },
  { src: pic7 },
  { src: pic8 },
  { src: pic9},
  { src: pic10},
  { src: pic11 },
  { src: pic12},
  { src: pic13},
  { src: pic14 },
  { src: pic15 },
  { src: pic16},
  { src: pic17},
  { src: pic18 },
  { src: pic19 },
  { src: pic20},
  { src: pic21},
  { src: pic22 },
  { src: pic23 },
  { src: pic24 },
  { src: pic25},
  { src: pic26 },
  { src: pic27},
  { src: pic28 },
  { src: pic29},
  { src: pic30 },
  { src: pic31 },
  { src: pic32 },
  { src: pic33 },
  { src: pic34 },
  { src: pic35},
  { src: pic36 },
  { src: pic37},
  { src: pic38 },
  { src: pic39},
  { src: pic40 },
  { src: pic41 },
  { src: pic42 },
  { src: pic43 },
  { src: pic44 },
  { src: pic45},
  { src: pic46 },
  { src: pic47 },
  { src: pic48 },
  { src: pic49 },
  { src: pic50 },
  { src: pic51 },
  { src: pic52 },
  { src: pic53 }

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
