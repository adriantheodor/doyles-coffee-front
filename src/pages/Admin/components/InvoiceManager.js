import { useEffect, useState } from "react";
import { API_BASE } from "../../../utils/api";

const InvoiceManager = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const res = await fetch(`${API_BASE}api/invoices`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setInvoices(data);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error loading invoices:", err);
    }
  };

  const deleteInvoice = async (id) => {
    if (!window.confirm("Delete this invoice?")) return;

    const res = await fetch(`${API_BASE}api/invoices/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (res.ok) {
      fetchInvoices();
    } else {
      alert("Failed to delete invoice.");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  if (loading) return <p>Loading invoices...</p>;

  return (
    <div>
      <h2>Invoices</h2>

      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", marginTop: "15px" }}
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
                <a
                  href={`${API_BASE}api/invoices/${inv._id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download PDF
                </a>
              </td>

              <td>
                <button onClick={() => deleteInvoice(inv._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceManager;
