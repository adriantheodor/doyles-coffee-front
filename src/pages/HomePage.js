import React, { useState, useEffect } from 'react';
import logo from "../assets/logo.jpg";
import pic1 from "../assets/pic1.jpeg";
import pic2 from "../assets/pic2.jpeg";
import pic3 from "../assets/pic3.jpeg";
import pic4 from "../assets/pic4.jpeg";
import pic5 from "../assets/pic5.jpeg";
import pic6 from "../assets/pic6.jpeg";
import pic7 from "../assets/pic7.jpeg";
import pic8 from "../assets/pic8.jpeg";
import pic9 from "../assets/pic9.jpeg";



// --- Placeholder Assets and Styles (Replacing missing imports) ---

// Placeholder URLs for images (cannot rely on local imports like ../assets/...)
const ASSETS = {
  logo: logo,
  pic1: pic1,
  pic2: pic2,
  pic3: pic3,
  pic4: pic4,
  pic5: pic5,
  pic6: pic6,
  pic7: pic7,
  pic8: pic8,
  pic9: pic9,
};

// --- Component 1: PhotoCarousel (Integrated for single-file compilation) ---

const PhotoCarousel = ({ images }) => {
  // HOOKS MUST BE CALLED AT THE TOP LEVEL (before any conditional returns)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide functionality (MUST be before conditional return)
  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    // Only set up the interval if there are images
    if (!images || images.length === 0) return; 

    const timer = setInterval(() => {
      goToNext();
    }, 5000); 

    return () => clearInterval(timer); 
  }, [currentIndex, images.length]); // Dependencies include states/props used

  // --- Start of conditional logic (after all hooks are called) ---
  if (!images || images.length === 0) {
    return (
      <div className="p-4 text-center bg-red-100 border border-red-400 text-red-700 rounded-lg">
        No images available for the carousel.
      </div>
    );
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="relative w-full rounded-xl shadow-2xl overflow-hidden group">
      {/* Main Image Container */}
      <div className="relative h-64 sm:h-96 md:h-[500px] w-full transition-all duration-700 ease-in-out">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/1200x500/667EEA/fff?text=Image+Load+Error";
              }}
            />
            {/* Caption Overlay */}
            {image.caption && (
              <div className="absolute bottom-0 w-full bg-black bg-opacity-50 p-4 text-white text-center">
                <p className="text-lg font-semibold">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Buttons (Desktop/Tablet) */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 p-3 bg-white/20 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/50 focus:outline-none focus:ring-4 focus:ring-white/50 z-10 hidden sm:block"
        aria-label="Previous image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 p-3 bg-white/20 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/50 focus:outline-none focus:ring-4 focus:ring-white/50 z-10 hidden sm:block"
        aria-label="Next image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
      </button>
      
      {/* Mobile Navigation (Always visible buttons below the image) */}
      <div className="flex justify-between p-4 sm:hidden bg-white/90">
        <button
            onClick={goToPrevious}
            className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Previous image (mobile)"
        >
            Prev
        </button>
        <button
            onClick={goToNext}
            className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Next image (mobile)"
        >
            Next
        </button>
      </div>

      {/* Indicators (Dots) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 w-3 rounded-full transition-all duration-300 focus:outline-none ${
              index === currentIndex
                ? 'bg-white ring-2 ring-indigo-500'
                : 'bg-gray-400 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

// --- Component 2: QuotePage Placeholder (Replacing missing import) ---

const QuotePage = () => {
  return (
    <div className="text-center p-6 bg-gray-100 rounded-xl border border-dashed border-gray-400">
      <h3 className="text-2xl font-extrabold text-blue-800 mb-3">
        Ready for a Free Quote?
      </h3>
      <p className="text-gray-600 mb-4">
        (Placeholder for the Quote Request Form component, which was named QuotePage.)
      </p>
      <button className="px-8 py-3 bg-green-500 text-white font-semibold rounded-full shadow-lg hover:bg-green-600 transition-all transform hover:scale-105">
        Click Here to Start Your Quote
      </button>
    </div>
  );
};


// --- Component 3: HomePage (Main App) ---

const HomePage = ({ onLogin }) => {
  
  // Custom styles defined inline to replace HomePage.css (using <style> tag)
  const customStyles = `
    .main-header-logo {
      width: 150px;
      height: 50px;
      object-fit: contain;
      border-radius: 8px;
    }
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    .contact-card {
      background-color: #f8f9fa; /* light */
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: transform 0.2s;
    }
    .contact-card:hover {
        transform: translateY(-5px);
    }
    .contact-card h3 {
        font-size: 1.25rem;
        font-weight: 700;
        margin-top: 0.75rem;
        margin-bottom: 0.5rem;
        color: #343a40; /* dark */
    }
    .contact-card a {
        color: #007bff; /* primary */
        text-decoration: none;
    }
    .contact-card a:hover {
        text-decoration: underline;
    }
    .icon-box {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 48px;
        height: 48px;
        background-color: #007bff; /* primary */
        color: white;
        border-radius: 50%;
    }
  `;


  // 1. Create the image array structure required by PhotoCarousel.jsx, using placeholder URLs
  const carouselImages = [
    { src: ASSETS.pic1, alt: "Professional coffee service setup", caption: "Premium Coffee Service" },
    { src: ASSETS.pic2, alt: "Variety of snacks and beverages in a breakroom", caption: "Fully Stocked Breakrooms" },
    { src: ASSETS.pic3, alt: "Modern vending machine", caption: "24/7 Vending Solutions" },
    { src: ASSETS.pic4, alt: "Clean and well-organized breakroom area", caption: "Custom Breakroom Design" },
    { src: ASSETS.pic5, alt: "Coffee machine detail shot", caption: "High-Quality Equipment" },
    { src: ASSETS.pic6, alt: "Office employees enjoying a break", caption: "Boost Employee Morale" },
    { src: ASSETS.pic7, alt: "Fresh fruit selection in a micro-market", caption: "Healthy Snack Options" },
    { src: ASSETS.pic8, alt: "Detailed shot of coffee beans and cups", caption: "Locally Sourced Beans" },
    { src: ASSETS.pic9, alt: "A fully stocked refrigerator with drinks", caption: "Reliable Inventory Management" },
  ];

  return (
    <>
      <style>{customStyles}</style>
      <div id="top" className="home-page bg-light min-vh-100 d-flex flex-column">
        <header className="text-center py-5 bg-white shadow-sm">
          <div className="container">
            <img
              src={ASSETS.logo}
              alt="Doyle's Services Logo"
              className="main-header-logo"
            />

            <h1 className="fw-bold mt-3">Doyle's Coffee & Breakroom Services</h1>
            <p className="text-muted fs-5">
              Premium coffee and break room solutions for your workplace.
            </p>
          </div>
        </header>
        
        {/* New Carousel Section */}
        <div className="container my-4">
          <PhotoCarousel images={carouselImages} />
        </div>
        
        {/* Main Content Section */}
        <div id="about" className="container-fluid flex-grow-1 my-5 px-3 px-sm-5">
          <div className="row g-4 justify-content-center">
            <div className="col-lg-10">
              {/* About Section */}
              <section className="mb-5">
                <h2 className="mb-3 text-primary">About Us</h2>
                <p className="text-secondary">
                  At Doyle’s Coffee & Break Room Services, we provide everything
                  your team needs to stay energized — from coffee and snacks to
                  equipment and maintenance. Reliable service, quality products,
                  and friendly support are what set us apart.
                </p>
              </section>

              {/* Quote Request Section */}
              <section className="mb-5">
                <div id="quote" className="card shadow-sm p-4 border-0 rounded-xl">
                  {/* Using the inline defined QuotePage component */}
                  <QuotePage /> 
                </div>
              </section>

              {/* Contact Section */}
              <section id="contact" className="contact-section">
                <div className="contact-content">
                  <h2 className="mb-3 text-primary">Contact Us</h2>
                  <p className="contact-subtext text-secondary mb-5">
                    Ready to upgrade your break room? Reach out to us today.
                  </p>

                  <div className="contact-grid">
                    {/* Address Block */}
                    <div className="contact-card">
                      <div className="icon-box">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </div>
                      <h3>Location</h3>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=150+Holly+Ave+Penndel+PA+19047"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        150 Holly Ave
                        <br />
                        Penndel, PA 19047
                      </a>
                    </div>

                    {/* Phone Block */}
                    <div className="contact-card">
                      <div className="icon-box">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </div>
                      <h3>Phone</h3>
                      <a href="tel:6109525733">(610) 952-5733</a>
                    </div>

                    {/* Email Block */}
                    <div className="contact-card">
                      <div className="icon-box">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </div>
                      <h3>Email</h3>
                      <a href="mailto:doylesbreakroomservices@gmail.com">
                        doylesbreakroomservices@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            </div> 
          </div> 
        </div> 
        {/* Footer */}
        <footer className="text-center py-4 bg-white border-top">
          <small className="text-muted">
            © {new Date().getFullYear()} Doyle’s Coffee & Break Room Services. All
            rights reserved.
          </small>
        </footer>
      </div>
    </>
  );
};

export default HomePage;