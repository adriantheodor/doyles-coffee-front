import { useEffect, useState } from "react";
import { API_BASE } from "../../../utils/api";

const InvoiceManager = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const downloadPDF = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Authentication token not found. Please log in again.");
        return;
      }

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
    }
  };

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Authentication token not found. Please log in again.");
        setInvoices([]);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}api/invoices`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        alert(`Failed to load invoices: ${res.status}`);
        setInvoices([]);
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setInvoices(data);
      } else {
        alert("Invalid data format received from server.");
        setInvoices([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error loading invoices:", err);
      alert("Error connecting to server.");
      setInvoices([]);
      setLoading(false);
    }
  };

  const deleteInvoice = async (id) => {
    if (!window.confirm("Delete this invoice?")) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}api/invoices/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchInvoices();
      } else {
        alert("Failed to delete invoice.");
      }
    } catch (err) {
      console.error("Delete invoice error:", err);
      alert("Error deleting invoice.");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  if (loading) return <p>Loading invoices...</p>;

  return (
    <div className="page-container">
      <div className="page-card">
      <h2 className="page-title">Invoices</h2>

      <table
        border="1"
        cellPadding="8"
        className="styled-table"
      >
        <thead>
          <tr>
            <th>Customer</th>
            <th>Email</th>
            <th>Order #</th>
            <th>Total Price</th>
            <th>Date</th>
            <th>Invoice PDF</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((inv) => (
            <tr key={inv._id}>
              <td>{inv.customer?.name}</td>
              <td>{inv.customer?.email}</td>
              <td>{inv.order?._id}</td>
              <td>${inv.order?.totalPrice.toFixed(2)}</td>
              <td>{new Date(inv.createdAt).toLocaleDateString()}</td>

              <td>
                <button onClick={() => downloadPDF(inv._id)}>
                  Download PDF
                </button>
              </td>

              <td>
                <button onClick={() => deleteInvoice(inv._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default InvoiceManager;
