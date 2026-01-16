import "./HomePage.css";
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

const breakroomImages = [
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

const HomePage = ({ onLogin }) => {
  return (
    <div id="top" className="home-page bg-light min-vh-100 d-flex flex-column">
      <header className="text-center py-5 bg-white shadow-sm">
        <div className="container">
          <img
            src={logo}
            alt="Doyle's Services Logo"
            className="main-header-logo"
          />

          <h1 className="fw-bold mt-3">Doyle's Coffee & Breakroom Services</h1>
          <p className="text-muted fs-5">
            Premium coffee and break room solutions for your workplace.
          </p>
        </div>
      </header>
      <div id="about" className="container-fluid flex-grow-1 my-5 px-3 px-sm-5">
        {/* FIX 1: Added 'justify-content-center' to center the column on the screen */}
        <div className="row g-4 justify-content-center">
          {/* FIX 2: Changed 'col-lg-8' to 'col-lg-10' so it's wider but centered */}
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

            {/* 🔥 UPDATED: Professional Carousel/Slideshow Section 🔥 */}
            <section id="services" className="mb-5">
              <div
                id="breakroomCarousel"
                className="carousel slide shadow-lg rounded-3 overflow-hidden"
                data-bs-ride="carousel"
              >
                {/* Carousel Indicators (Dots at the bottom) */}
                <div className="carousel-indicators">
                  {breakroomImages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      data-bs-target="#breakroomCarousel"
                      data-bs-slide-to={index}
                      className={index === 0 ? "active" : ""}
                      aria-current={index === 0 ? "true" : "false"}
                      aria-label={`Slide ${index + 1}`}
                    ></button>
                  ))}
                </div>

                {/* Carousel Inner (The Slides) */}
                <div className="carousel-inner">
                  {breakroomImages.map((image, index) => (
                    <div
                      key={index}
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                      data-bs-interval="5000"
                    >
                      <img
                        src={image.src}
                        className="d-block w-100 carousel-image"
                        alt={image.alt}
                      />
                      <div className="carousel-caption d-none d-md-block bg-dark opacity-75 p-2 rounded">
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="mb-5">
              <h2 className="mb-3 text-primary">Get In Touch</h2>
              <div className="contact-section row g-4">
                {/* Location Block */}
                <div className="contact-card col-md-4">
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
                  Penndel, PA 19047
                </div>

                {/* Phone Block */}
                <div className="contact-card col-md-4">
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
                <div className="contact-card col-md-4">
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
            </section>
          </div>{" "}
          {/* End col-lg-10 */}
        </div>{" "}
        {/* End row */}
      </div>{" "}
      {/* End container */}
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
