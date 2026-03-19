import "./HomePage.css";
import "./AboutPage.css";
import logo from "../assets/logo.jpg";

const valuePoints = [
  {
    icon: "☕",
    title: "A Real Person Every Time",
    description:
      "No automatic responses. You get a live person dedicated to dialing in on your specific needs.",
  },
  {
    icon: "🛠️",
    title: "Zero Hidden Costs",
    description:
      "We provide free installation and maintenance on all our equipment.",
  },
  {
    icon: "🚚",
    title: "No Rental or Delivery Fees",
    description: "We keep it simple - you only pay for what you use.",
  },
  {
    icon: "✅",
    title: "100% Equipment Guarantee",
    description:
      "If something isn't right, we fix it or replace it immediately.",
  },
  {
    icon: "📍",
    title: "Local Reliability",
    description:
      "Based right here in Penndel, we prioritize our neighbors over corporate bottom lines.",
  },
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
      <div className="page-container about-page">
      <div className="page-card about-card">
        <h1 className="page-title">About Us</h1>
        <p className="about-lead">
          I&apos;ve always said that I have the best of both worlds - a wonderful
          family with my two sons and two daughters, and a career I love. In
          2019, I launched Doyle&apos;s Coffee &amp; Breakroom Services to bring a
          more personal, &quot;family-first&quot; philosophy to our community.
        </p>
        <p>
          After 20 years of working for the big corporations, I saw exactly
          where they fall short. They&apos;ve traded real customer service for
          automation and &quot;drop-down&quot; menus. I&apos;m doing things differently. My
          vision is a truly unique experience where you are the only priority -
          not just another account number. No bots, no scripts - just honest
          work from a local guy who cares about your business as much as his
          own.
        </p>
        <section className="about-value-box" aria-labelledby="worry-free-title">
          <div className="about-value-header">
            <span className="about-value-kicker">Why businesses switch</span>
            <h2 id="worry-free-title">The &quot;Worry-Free&quot; Difference</h2>
          </div>
          <p className="about-value-intro">
          We believe in treating you like family, which means we handle the
          heavy lifting so you don&apos;t have to. When you partner with us, you
          get:
          </p>
          <ul className="about-value-list">
            {valuePoints.map(({ icon, title, description }) => (
              <li key={title} className="about-value-item">
                <span className="about-value-icon" aria-hidden="true">
                  {icon}
                </span>
                <div className="about-value-copy">
                  <strong>{title}:</strong>
                  <span>{description}</span>
                </div>
              </li>
            ))}
          </ul>
      </section>
      <p>Ready to experience the personal touch? Give me a call today.</p>
      <p>
        <em>
          &quot;Your business is our priority, and you&apos;re part of the family.&quot;
        </em>
      </p>
    </div>

    {/* Contact Section */}
    <section id="contact" className="mb-5 container mt-5">
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
      </div>
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
