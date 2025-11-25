import QuotePage from "./QuotePage";
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
  { src: pic1, alt: "Gourmet coffee service setup" },
  { src: pic2, alt: "Variety of snacks and treats" },
  { src: pic3, alt: "Modern water filtration system" },
  { src: pic4, alt: "Clean, well-stocked pantry area" },
  { src: pic5, alt: "Espresso machine in an office breakroom" },
  { src: pic6, alt: "Fresh fruit and healthy options" },
  { src: pic7, alt: "Beverage station with cold drinks" },
  { src: pic8, alt: "Vending machine with high-end snacks" },
  { src: pic9, alt: "Team members enjoying coffee break" },
];

// ... imports remain the same ...

const HomePage = ({ onLogin }) => {
  return (
    <div id="top" className="home-page bg-light min-vh-100 d-flex flex-column">
      <header className="text-center py-5 bg-white shadow-sm">
        {/* ... Header content remains the same ... */}
      </header>
      {/* Main Content Section */}
      <div id="about" className="container-fluid flex-grow-1 my-5 px-3 px-sm-5">
        <div className="row g-4 justify-content-center">
          {/* This is the column that centers and restricts the width */}
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

            {/* 🔥 MOVE THE CAROUSEL SECTION START 🔥 */}
            <section id="services" className="mb-5">
              <h2 className="mb-4 text-primary text-center">
                A Look Inside Our Premium Services
              </h2>

              <div
                id="breakroomCarousel"
                className="carousel slide shadow-lg rounded-3 overflow-hidden"
                data-bs-ride="carousel"
              >
                {/* Carousel Indicators (Dots at the bottom) */}
                <div className="carousel-indicators">
                  {/* ... Indicators remain the same ... */}
                </div>

                {/* Carousel Inner (The Slides) */}
                <div className="carousel-inner">
                  {/* ... Slides remain the same ... */}
                </div>

                {/* Carousel Controls (Previous/Next Arrows) */}
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#breakroomCarousel"
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
                  data-bs-target="#breakroomCarousel"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </section>
            {/* 🔥 MOVE THE CAROUSEL SECTION END 🔥 */}

            {/* Quote Request Section */}
            <section className="mb-5">
              <div id="quote" className="card shadow-sm p-4 border-0">
                <QuotePage />
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="contact-section">
              {/* ... Contact content remains the same ... */}
            </section>
          </div>{" "}
          {/* End col-lg-10 */}
        </div>{" "}
        {/* End row */}
      </div>{" "}
      {/* End container */}
      {/* Footer */}
      <footer className="text-center py-4 bg-white border-top">
        {/* ... Footer content remains the same ... */}
      </footer>
    </div>
  );
};

export default HomePage;
