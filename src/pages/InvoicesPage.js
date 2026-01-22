import { useEffect, useState } from "react";
import useToast from "../hooks/useToast";
import EmptyState from "../components/EmptyState";
import { API_BASE } from "../utils/api";

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const toast = useToast();

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
        toast.error("Failed to download invoice PDF");
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
      toast.error("Error downloading PDF.");
    }
  };

  useEffect(() => {
    fetchMyInvoices();
  }, []);

  return (
    <div className="page-container mobile-container">
      <div className="page-card">
        <h1 className="page-title">Your Invoices</h1>

        {invoices.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No Invoices Yet"
            description="You don't have any invoices. Once you place orders, they'll appear here."
            actionLabel="Place Your First Order"
            onAction={() => window.location.href = '/place-order'}
          />
        ) : (
          <div className="mobile-stack">
          {invoices.map((invoice) => (
            <div key={invoice._id} className="invoice-card">
              <div className="invoice-info">
                <p><strong>Order:</strong> {invoice.order?._id}</p>
                <p><strong>Total:</strong> ${invoice.order?.totalPrice.toFixed(2)}</p>
                <p><strong>Date:</strong> {new Date(invoice.createdAt).toLocaleDateString()}</p>
              </div>
              <button 
                className="mobile-fullwidth-button" 
                onClick={() => downloadPDF(invoice._id)}
                aria-label={`Download invoice for order ${invoice.order?._id}`}
              >
                Download PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoicesPage;