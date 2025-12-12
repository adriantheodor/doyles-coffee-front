import { useEffect, useState } from "react";
import { API_BASE } from "../utils/api";

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);

  const fetchMyInvoices = async () => {
    const res = await fetch(`${API_BASE}api/invoices/my`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const data = await res.json();
    if (Array.isArray(data)) setInvoices(data);
  };

  const downloadPDF = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${API_BASE}api/invoices/${id}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("Failed to download invoice PDF");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${id}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF Download Error:", err);
      alert("Error downloading PDF.");
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
              <button onClick={() => downloadPDF(invoice._id)}>
                Download PDF
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InvoicesPage;