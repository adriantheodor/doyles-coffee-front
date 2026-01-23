import React, { useState } from "react";
import "./QRCodeGenerator.css";
import useToast from "../hooks/useToast";
import { createInventoryItem } from "../services/inventoryService";

export function QRCodeGenerator({ productId, productName }) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    itemCode: "",
    batchNumber: "",
    manufacturingDate: "",
    expiryDate: "",
    notes: "",
  });
  const [generatedQR, setGeneratedQR] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateQR = async (e) => {
    e.preventDefault();

    if (!formData.itemCode.trim()) {
      toast.error("Please enter an item code");
      return;
    }

    setLoading(true);
    try {
      const response = await createInventoryItem({
        productId,
        ...formData,
      });

      setGeneratedQR(response);
      toast.success("QR code generated successfully!");
      
      // Reset form
      setFormData({
        itemCode: "",
        batchNumber: "",
        manufacturingDate: "",
        expiryDate: "",
        notes: "",
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQRCode = () => {
    if (!generatedQR?.qrCodeDataURL) return;

    const link = document.createElement("a");
    link.href = generatedQR.qrCodeDataURL;
    link.download = `QR_${generatedQR.itemCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintQRCode = () => {
    if (!generatedQR?.qrCodeDataURL) return;

    const printWindow = window.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code - ${generatedQR.itemCode}</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .print-container {
              background: white;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .qr-code {
              margin: 20px 0;
            }
            h3 {
              margin: 10px 0;
              color: #333;
            }
            .item-code {
              font-size: 18px;
              font-weight: bold;
              color: #1976d2;
            }
            img {
              max-width: 300px;
              border: 2px solid #ddd;
              padding: 10px;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <h3>${productName}</h3>
            <div class="item-code">${generatedQR.itemCode}</div>
            <div class="qr-code">
              <img src="${generatedQR.qrCodeDataURL}" alt="QR Code"/>
            </div>
            <p>Scan to access item details</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="qr-generator-container">
      <div className="qr-generator-form">
        <h3>Generate QR Code for Item</h3>
        <form onSubmit={handleGenerateQR}>
          <div className="form-group">
            <label htmlFor="itemCode">Item Code (SKU) *</label>
            <input
              type="text"
              id="itemCode"
              name="itemCode"
              value={formData.itemCode}
              onChange={handleInputChange}
              placeholder="e.g., SKU-001-2024"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="batchNumber">Batch Number</label>
            <input
              type="text"
              id="batchNumber"
              name="batchNumber"
              value={formData.batchNumber}
              onChange={handleInputChange}
              placeholder="e.g., BATCH-001"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="manufacturingDate">Manufacturing Date</label>
              <input
                type="date"
                id="manufacturingDate"
                name="manufacturingDate"
                value={formData.manufacturingDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional information about this item..."
              rows="3"
            ></textarea>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Generating..." : "Generate QR Code"}
          </button>
        </form>
      </div>

      {generatedQR && (
        <div className="qr-generator-preview">
          <h3>Generated QR Code</h3>
          <div className="qr-code-display">
            <img src={generatedQR.qrCodeDataURL} alt="Generated QR Code" />
          </div>

          <div className="qr-code-info">
            <div className="info-item">
              <strong>Item Code:</strong> {generatedQR.itemCode}
            </div>
            {generatedQR.batchNumber && (
              <div className="info-item">
                <strong>Batch Number:</strong> {generatedQR.batchNumber}
              </div>
            )}
            <div className="info-item">
              <strong>Status:</strong>{" "}
              <span className="status-badge available">{generatedQR.status}</span>
            </div>
            <div className="info-item">
              <strong>QR Code URL:</strong>
              <code className="code-block">{generatedQR.qrCode}</code>
            </div>
            {generatedQR.manufacturingDate && (
              <div className="info-item">
                <strong>Manufacturing Date:</strong>{" "}
                {new Date(generatedQR.manufacturingDate).toLocaleDateString()}
              </div>
            )}
            {generatedQR.expiryDate && (
              <div className="info-item">
                <strong>Expiry Date:</strong>{" "}
                {new Date(generatedQR.expiryDate).toLocaleDateString()}
              </div>
            )}
          </div>

          <div className="qr-code-actions">
            <button onClick={handleDownloadQRCode} className="btn-secondary">
              📥 Download QR Code
            </button>
            <button onClick={handlePrintQRCode} className="btn-secondary">
              🖨️ Print QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QRCodeGenerator;
