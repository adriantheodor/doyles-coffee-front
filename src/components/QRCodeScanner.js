import React, { useState } from "react";
import "./QRCodeScanner.css";
import useToast from "../hooks/useToast";
import { scanQRCode } from "../services/inventoryService";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";

export function QRCodeScanner() {
  const toast = useToast();
  const [itemCode, setItemCode] = useState("");
  const [scannedItem, setScannedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!itemCode.trim()) {
      toast.error("Please enter or scan an item code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await scanQRCode(itemCode);
      setScannedItem(data);
      setScanHistory((prev) => [
        {
          itemCode: data.itemCode,
          productName: data.productId?.name || "Unknown",
          status: data.status,
          timestamp: new Date(),
        },
        ...prev.slice(0, 9), // Keep last 10 scans
      ]);
      toast.success("Item scanned successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      setScannedItem(null);
    } finally {
      setLoading(false);
      setItemCode("");
    }
  };

  const handleClearScan = () => {
    setScannedItem(null);
    setItemCode("");
    setError(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      available: "#2e7d32",
      sold: "#e65100",
      damaged: "#c62828",
      returned: "#6a1b9a",
      "in-transit": "#1565c0",
    };
    return colors[status] || "#666";
  };

  return (
    <div className="qr-scanner-container">
      <div className="scanner-section">
        <div className="scanner-form-wrapper">
          <h2>QR Code Scanner</h2>
          <form onSubmit={handleScan}>
            <div className="scan-input-group">
              <input
                type="text"
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
                placeholder="Scan QR code or enter item code (e.g., SKU-001-2024)..."
                autoFocus
                className="scan-input"
              />
              <button type="submit" disabled={loading} className="btn-scan">
                {loading ? <LoadingSpinner size="small" /> : "Scan"}
              </button>
            </div>
          </form>
        </div>

        {loading && (
          <div className="loading-state">
            <LoadingSpinner size="medium" />
            <p>Scanning item...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p className="error-message">⚠️ {error}</p>
          </div>
        )}

        {scannedItem && (
          <div className="scanned-item-details">
            <div className="item-header">
              <h3>{scannedItem.productId?.name || "Unknown Product"}</h3>
              <button onClick={handleClearScan} className="btn-close">
                ✕
              </button>
            </div>

            <div className="item-content">
              <div className="item-section">
                <h4>Item Information</h4>
                <div className="info-grid">
                  <div className="info-row">
                    <span className="label">Item Code:</span>
                    <span className="value code">{scannedItem.itemCode}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Status:</span>
                    <span
                      className="value status-badge"
                      style={{ backgroundColor: getStatusColor(scannedItem.status) }}
                    >
                      {scannedItem.status.toUpperCase()}
                    </span>
                  </div>
                  {scannedItem.batchNumber && (
                    <div className="info-row">
                      <span className="label">Batch Number:</span>
                      <span className="value">{scannedItem.batchNumber}</span>
                    </div>
                  )}
                  <div className="info-row">
                    <span className="label">Location:</span>
                    <span className="value">{scannedItem.location || "N/A"}</span>
                  </div>
                </div>
              </div>

              {scannedItem.productId && (
                <div className="item-section">
                  <h4>Product Details</h4>
                  <div className="info-grid">
                    <div className="info-row">
                      <span className="label">Product:</span>
                      <span className="value">{scannedItem.productId.name}</span>
                    </div>
                    {scannedItem.productId.price && (
                      <div className="info-row">
                        <span className="label">Price:</span>
                        <span className="value">
                          ${scannedItem.productId.price.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {scannedItem.productId.stock !== undefined && (
                      <div className="info-row">
                        <span className="label">Stock:</span>
                        <span className="value">{scannedItem.productId.stock}</span>
                      </div>
                    )}
                    {scannedItem.productId.description && (
                      <div className="info-row full-width">
                        <span className="label">Description:</span>
                        <span className="value">
                          {scannedItem.productId.description}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(scannedItem.manufacturingDate || scannedItem.expiryDate) && (
                <div className="item-section">
                  <h4>Date Information</h4>
                  <div className="info-grid">
                    {scannedItem.manufacturingDate && (
                      <div className="info-row">
                        <span className="label">Manufacturing Date:</span>
                        <span className="value">
                          {new Date(scannedItem.manufacturingDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {scannedItem.expiryDate && (
                      <div className="info-row">
                        <span className="label">Expiry Date:</span>
                        <span className="value">
                          {new Date(scannedItem.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {scannedItem.notes && (
                <div className="item-section">
                  <h4>Notes</h4>
                  <p className="notes">{scannedItem.notes}</p>
                </div>
              )}

              {scannedItem.scanHistory && scannedItem.scanHistory.length > 0 && (
                <div className="item-section">
                  <h4>Scan History</h4>
                  <div className="scan-history-list">
                    {scannedItem.scanHistory.map((scan, index) => (
                      <div key={index} className="scan-history-item">
                        <div className="scan-time">
                          {new Date(scan.scannedAt).toLocaleString()}
                        </div>
                        <div className="scan-details">
                          <span className="scan-by">by {scan.scannedBy}</span>
                          {scan.notes && <span className="scan-notes">{scan.notes}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!scannedItem && !loading && !error && (
          <EmptyState
            icon="📱"
            title="Ready to Scan"
            message="Use your device camera or barcode scanner to scan a QR code, or manually enter the item code above."
          />
        )}
      </div>

      {scanHistory.length > 0 && (
        <div className="scan-history-section">
          <h3>Recent Scans</h3>
          <div className="history-list">
            {scanHistory.map((item, index) => (
              <div
                key={index}
                className="history-item"
                onClick={() => setItemCode(item.itemCode)}
              >
                <div className="history-item-code">{item.itemCode}</div>
                <div className="history-item-product">{item.productName}</div>
                <div
                  className="history-item-status"
                  style={{ color: getStatusColor(item.status) }}
                >
                  {item.status}
                </div>
                <div className="history-item-time">
                  {item.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default QRCodeScanner;
