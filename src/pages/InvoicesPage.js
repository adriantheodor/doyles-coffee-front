import { useEffect, useState } from "react";
import { API_BASE } from "../utils/api";

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);

  const fetchMyInvoices = async () => {
    const res = await fetch(`${API_BASE}api/invoices/my`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (Array.isArray(data)) {
      setInvoices(data);
    }
  };

  useEffect(() => {
    fetchMyInvoices();
  }, []);

  return (
    <div className="page-container">
      <div className="page-card">
        <h1 className="page-title">Your Invoices</h1>

        {invoices.length === 0 && <p>No invoices yet.</p>}

        <ul>
          {invoices.map((invoice) => (
            <li key={invoice._id} style={{ marginBottom: "15px" }}>
              <strong>Order:</strong> {invoice.order?._id} <br />
              <strong>Total:</strong> ${invoice.order?.totalPrice.toFixed(2)}{" "}
              <br />
              <strong>Date:</strong>{" "}
              {new Date(invoice.createdAt).toLocaleDateString()} <br />
              <a
                href={`${API_BASE}api/invoices/${invoice._id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download PDF
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InvoicesPage;
