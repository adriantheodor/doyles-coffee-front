import React, { useState } from "react";
import "./BatchInventoryUpload.css";
import useToast from "../hooks/useToast";
import { createBatchInventoryItems } from "../services/inventoryService";
import LoadingSpinner from "./LoadingSpinner";

export function BatchInventoryUpload({ productId, productName, onSuccess }) {
  const toast = useToast();
  const [batchData, setBatchData] = useState({
    itemCodes: "",
    batchNumber: "",
    manufacturingDate: "",
    expiryDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBatchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();

    if (!batchData.itemCodes.trim()) {
      toast.error("Please enter item codes");
      return;
    }

    if (!batchData.batchNumber.trim()) {
      toast.error("Please enter a batch number");
      return;
    }

    const itemCodesArray = batchData.itemCodes
      .split("\n")
      .map((code) => code.trim())
      .filter((code) => code.length > 0);

    if (itemCodesArray.length === 0) {
      toast.error("Please enter at least one item code");
      return;
    }

    setLoading(true);
    try {
      const response = await createBatchInventoryItems({
        productId,
        itemCodes: itemCodesArray,
        batchNumber: batchData.batchNumber,
        manufacturingDate: batchData.manufacturingDate || undefined,
        expiryDate: batchData.expiryDate || undefined,
      });

      setResults(response);
      toast.success(`Successfully created ${response.created} items!`);

      if (onSuccess) {
        onSuccess(response);
      }

      // Reset form
      setBatchData({
        itemCodes: "",
        batchNumber: "",
        manufacturingDate: "",
        expiryDate: "",
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const template = `SKU-001-2024
SKU-002-2024
SKU-003-2024
SKU-004-2024
SKU-005-2024`;

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(template)
    );
    element.setAttribute("download", "item_codes_template.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadQRCodes = () => {
    if (!results?.items) return;

    // Create a data structure for downloading all QR codes
    const qrData = results.items
      .map((item) => ({
        itemCode: item.itemCode,
        qrCodeDataURL: item.qrCodeDataURL,
      }))
      .filter((item) => item.qrCodeDataURL);

    // For simplicity, create an HTML page with all QR codes for printing
    let htmlContent = `
      <html>
        <head>
          <title>QR Codes - ${batchData.batchNumber}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              background-color: #f5f5f5;
            }
            h1 {
              text-align: center;
              color: #333;
              margin-bottom: 30px;
            }
            .qr-page {
              page-break-after: always;
              text-align: center;
              background: white;
              padding: 20px;
              margin-bottom: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .item-code {
              font-size: 18px;
              font-weight: bold;
              color: #1976d2;
              margin-bottom: 15px;
            }
            img {
              max-width: 200px;
              border: 2px solid #ddd;
              padding: 10px;
              background: white;
            }
            .product-name {
              margin-top: 15px;
              color: #666;
              font-size: 14px;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              .qr-page {
                box-shadow: none;
                margin-bottom: 0;
                page-break-after: always;
              }
            }
          </style>
        </head>
        <body>
          <h1>Batch: ${batchData.batchNumber}</h1>
          <h2>${productName}</h2>
    `;

    qrData.forEach((item) => {
      htmlContent += `
        <div class="qr-page">
          <div class="product-name">${productName}</div>
          <div class="item-code">${item.itemCode}</div>
          <img src="${item.qrCodeDataURL}" alt="QR Code for ${item.itemCode}" />
          <p>Scan to access item details</p>
        </div>
      `;
    });

    htmlContent += `
        </body>
      </html>
    `;

    const printWindow = window.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="batch-upload-container">
      <div className="batch-form-section">
        <h3>Create Batch of Items</h3>
        <p className="section-description">
          Create multiple inventory items at once for efficient batch processing
        </p>

        <form onSubmit={handleCreateBatch}>
          <div className="form-group">
            <label htmlFor="batchNumber">Batch Number *</label>
            <input
              type="text"
              id="batchNumber"
              name="batchNumber"
              value={batchData.batchNumber}
              onChange={handleInputChange}
              placeholder="e.g., BATCH-001"
              required
            />
            <small>Unique identifier for this batch of items</small>
          </div>

          <div className="form-group">
            <div className="label-with-action">
              <label htmlFor="itemCodes">Item Codes *</label>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="btn-template"
              >
                📋 Download Template
              </button>
            </div>
            <textarea
              id="itemCodes"
              name="itemCodes"
              value={batchData.itemCodes}
              onChange={handleInputChange}
              placeholder="Enter one item code per line:&#10;SKU-001-2024&#10;SKU-002-2024&#10;SKU-003-2024"
              rows="8"
              required
            ></textarea>
            <small>
              Enter one item code per line. {batchData.itemCodes.split("\n").filter((c) => c.trim()).length} codes
              entered
            </small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="manufacturingDate">Manufacturing Date</label>
              <input
                type="date"
                id="manufacturingDate"
                name="manufacturingDate"
                value={batchData.manufacturingDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={batchData.expiryDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary btn-large">
            {loading ? (
              <>
                <LoadingSpinner size="small" /> Creating Batch...
              </>
            ) : (
              "Create Batch Items"
            )}
          </button>
        </form>
      </div>

      {results && (
        <div className="batch-results-section">
          <h3>Batch Creation Results</h3>

          <div className="results-summary">
            <div className="summary-stat">
              <div className="stat-number">{results.created}</div>
              <div className="stat-label">Items Created</div>
            </div>
            {results.errors && results.errors.length > 0 && (
              <div className="summary-stat error">
                <div className="stat-number">{results.errors.length}</div>
                <div className="stat-label">Errors</div>
              </div>
            )}
          </div>

          {results.items && results.items.length > 0 && (
            <div className="results-actions">
              <button onClick={downloadQRCodes} className="btn-secondary">
                🖨️ Print All QR Codes
              </button>
              <button
                onClick={() => {
                  const csvContent = [
                    ["Item Code", "Status", "Batch Number", "Created At"].join(","),
                    ...results.items.map((item) =>
                      [
                        item.itemCode,
                        item.status,
                        item.batchNumber,
                        new Date(item.createdAt).toLocaleDateString(),
                      ].join(",")
                    ),
                  ].join("\n");

                  const element = document.createElement("a");
                  element.setAttribute(
                    "href",
                    "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent)
                  );
                  element.setAttribute("download", `batch_${batchData.batchNumber}.csv`);
                  element.style.display = "none";
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
                className="btn-secondary"
              >
                📊 Export to CSV
              </button>
            </div>
          )}

          <div className="results-list">
            <h4>Created Items</h4>
            <div className="items-table">
              <div className="table-header">
                <div className="col-code">Item Code</div>
                <div className="col-status">Status</div>
                <div className="col-created">Created</div>
              </div>
              <div className="table-body">
                {results.items?.map((item, index) => (
                  <div key={index} className="table-row">
                    <div className="col-code">
                      <code>{item.itemCode}</code>
                    </div>
                    <div className="col-status">
                      <span className={`status-badge ${item.status}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="col-created">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {results.errors && results.errors.length > 0 && (
            <div className="results-errors">
              <h4>Errors</h4>
              <ul>
                {results.errors.map((error, index) => (
                  <li key={index}>
                    <strong>{error.itemCode}:</strong> {error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BatchInventoryUpload;
