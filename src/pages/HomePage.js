import QuotePage from "./QuotePage";
import "./HomePage.css"; // optional: we’ll add a little CSS below
import pic1 from "../assets/pic1.jpeg";
import pic2 from "../assets/pic2.jpeg";
import pic3 from "../assets/pic3.jpeg";
import pic4 from "../assets/pic4.jpeg";
import pic5 from "../assets/pic5.jpeg";
import pic6 from "../assets/pic6.jpeg";
import pic7 from "../assets/pic7.jpeg";
import pic8 from "../assets/pic8.jpeg";
import pic9 from "../assets/pic9.jpeg";

const HomePage = ({ onLogin }) => {
  return (
    <div id="top" className="home-page bg-light min-vh-100 d-flex flex-column">
      {/* Header Section */}
      <header className="text-center py-5 bg-white shadow-sm">
        <h1 className="fw-bold">Doyle's Coffee & Break Room Services</h1>
        <p className="text-muted fs-5">
          Premium coffee and break room solutions for your workplace.
        </p>
      </header>

      {/* Carousel Section */}
      <div className="container my-4">
        <div
          id="doylesCarousel"
          className="carousel slide shadow-sm"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner rounded-4 overflow-hidden">
            <div className="carousel-item active">
              <img src={pic1} className="d-block w-100" alt="Coffee service" />
            </div>
            <div className="carousel-item">
              <img src={pic2} className="d-block w-100" alt="Snack room" />
            </div>
            <div className="carousel-item">
              <img src={pic3} className="d-block w-100" alt="Vending machine" />
            </div>
            <div className="carousel-item">
              <img src={pic4} className="d-block w-100" alt="Breakroom setup" />
            </div>
            <div className="carousel-item">
              <img src={pic5} className="d-block w-100" alt="Breakroom setup" />
            </div>
            <div className="carousel-item">
              <img src={pic6} className="d-block w-100" alt="Breakroom setup" />
            </div>
            <div className="carousel-item">
              <img src={pic7} className="d-block w-100" alt="Breakroom setup" />
            </div>
            <div className="carousel-item">
              <img src={pic8} className="d-block w-100" alt="Breakroom setup" />
            </div>
            <div className="carousel-item">
              <img src={pic9} className="d-block w-100" alt="Breakroom setup" />
            </div>
          </div>

          {/* Carousel Controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#doylesCarousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#doylesCarousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      {/* Main Content Section */}
      <div id="about" className="container flex-grow-1 my-5">
        <div className="row g-4">
          {/* Left Column: About + Quote Request */}
          <div className="col-lg-8">
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
            <section>
              <div id="quote" className="card shadow-sm p-4 border-0">
                <QuotePage />
              </div>
            </section>
          </div>
        </div>
      </div>

      <section id="contact" className="contact-section">
        <div className="contact-content">
          <h2>Contact Us</h2>
          <p className="contact-subtext">
            Ready to upgrade your break room? Reach out to us today.
          </p>

          <div className="contact-grid">
            {/* Address Block */}
            <div className="contact-card">
              <div className="icon-box">
                {/* Location Pin SVG */}
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
                {/* Phone SVG */}
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
                {/* Mail SVG */}
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
                doylesbreakroomservices
                <br />
                @gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 bg-white border-top">
        <small className="text-muted">
          © {new Date().getFullYear()} Doyle’s Coffee & Break Room Services. All
          rights reserved.
        </small>
      </footer>
    </div>
  );
};

export default HomePage;
