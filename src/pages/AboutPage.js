import "./AboutPage.css";

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

const AboutPage = () => {
  return (
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
    </div>
  );
};

export default AboutPage;
