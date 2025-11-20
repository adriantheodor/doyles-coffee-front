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
    <div className="home-page bg-light min-vh-100 d-flex flex-column">
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
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#doylesCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container flex-grow-1 my-5">
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
              <div className="card shadow-sm p-4 border-0">
                <QuotePage />
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 bg-white border-top">
        <small className="text-muted">
          © {new Date().getFullYear()} Doyle’s Coffee & Break Room Services. All rights reserved.
        </small>
      </footer>
    </div>
  );
};

export default HomePage;
