// client/src/pages/LandingPage.jsx
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <main style={{minHeight:'100vh', display:'flex', flexDirection:'column'}}>
      <section style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem', padding:'6rem 2rem', alignItems:'center'}}>
        {/* New Customers */}
        <div style={{padding:'2rem', border:'1px solid #eee', borderRadius:12}}>
          <h1 style={{marginTop:0}}>Doyle’s Coffee & Break Room Services</h1>
          <p>Full-service office coffee & break room solutions: equipment, supplies, maintenance, invoicing, and on-site support.</p>
          <ul>
            <li>Custom pricing & service schedules</li>
            <li>Machines, pantry items, paper goods</li>
            <li>Fast maintenance & issue reporting</li>
          </ul>
          <div style={{display:'flex', gap:'1rem', marginTop:'1rem'}}>
            <Link to="/quote"><button>Schedule a Quote</button></Link>
            <Link to="/register"><button>Create Account</button></Link>
          </div>
        </div>

        {/* Returning Customers */}
        <div style={{padding:'2rem', border:'1px solid #eee', borderRadius:12}}>
          <h2 style={{marginTop:0}}>Returning Customers</h2>
          <p>Log in to place orders, report issues, view invoices, and track inventory.</p>
          <Link to="/login"><button>Log In</button></Link>
        </div>
      </section>

      <section style={{padding:'2rem', borderTop:'1px solid #eee'}}>
        <h3>Why Doyle’s?</h3>
        <p>Local support, fast service, and flexible programs tailored to your team’s size and tastes.</p>
      </section>
    </main>
  );
}
