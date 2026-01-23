import React, { useState, useEffect } from "react";
import "./AdminInventoryPage.css";
import useToast from "../../hooks/useToast";
import QRCodeGenerator from "../../components/QRCodeGenerator";
import BatchInventoryUpload from "../../components/BatchInventoryUpload";
import QRCodeScanner from "../../components/QRCodeScanner";
import {
  getProductInventory,
  getInventoryStats,
  updateInventoryItemStatus,
  deleteInventoryItem,
} from "../../services/inventoryService";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";

export function AdminInventoryPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("scanner");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
  });
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    status: "",
    location: "",
    notes: "",
  });

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch inventory when product is selected
  useEffect(() => {
    if (selectedProduct) {
      fetchInventory(selectedProduct._id);
      fetchStats(selectedProduct._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct, filters.status]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  const fetchInventory = async (productId) => {
    setLoading(true);
    try {
      const status = filters.status !== "all" ? filters.status : null;
      const data = await getProductInventory(productId, status);
      setInventory(data);
    } catch (error) {
      toast.error(error.message);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (productId) => {
    try {
      const data = await getInventoryStats(productId);
      setStats(data);
    } catch (error) {
      toast.error("Failed to load inventory stats");
    }
  };

  const handleStatusChange = (item) => {
    setEditingItem(item);
    setEditForm({
      status: item.status,
      location: item.location || "",
      notes: "",
    });
  };

  const handleSaveStatusChange = async () => {
    if (!editingItem) return;

    try {
      await updateInventoryItemStatus(editingItem.itemCode, editForm);
      toast.success("Item status updated successfully");
      setEditingItem(null);
      if (selectedProduct) {
        fetchInventory(selectedProduct._id);
        fetchStats(selectedProduct._id);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteItem = async (itemCode) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteInventoryItem(itemCode);
      toast.success("Item deleted successfully");
      if (selectedProduct) {
        fetchInventory(selectedProduct._id);
        fetchStats(selectedProduct._id);
      }
    } catch (error) {
      toast.error(error.message);
    }
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
    <div className="admin-inventory-page">
      <div className="page-header">
        <h1>Inventory Management System</h1>
        <p>Create, scan, and manage QR-coded inventory items</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === "scanner" ? "active" : ""}`}
          onClick={() => setActiveTab("scanner")}
        >
          📱 Scanner
        </button>
        <button
          className={`tab-btn ${activeTab === "generate" ? "active" : ""}`}
          onClick={() => setActiveTab("generate")}
        >
          🔲 Generate QR Code
        </button>
        <button
          className={`tab-btn ${activeTab === "batch" ? "active" : ""}`}
          onClick={() => setActiveTab("batch")}
        >
          📦 Batch Create
        </button>
        <button
          className={`tab-btn ${activeTab === "manage" ? "active" : ""}`}
          onClick={() => setActiveTab("manage")}
        >
          📊 Manage Inventory
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Scanner Tab */}
        {activeTab === "scanner" && (
          <div className="tab-pane">
            <QRCodeScanner />
          </div>
        )}

        {/* Generate QR Code Tab */}
        {activeTab === "generate" && (
          <div className="tab-pane">
            <div className="product-selector">
              <h2>Select Product</h2>
              <div className="product-grid">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className={`product-card ${
                      selectedProduct?._id === product._id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="product-name">{product.name}</div>
                    <div className="product-price">${product.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {selectedProduct && (
              <QRCodeGenerator
                productId={selectedProduct._id}
                productName={selectedProduct.name}
              />
            )}

            {!selectedProduct && (
              <EmptyState
                icon="🏷️"
                title="Select a Product"
                message="Choose a product to generate QR codes for its inventory items"
              />
            )}
          </div>
        )}

        {/* Batch Create Tab */}
        {activeTab === "batch" && (
          <div className="tab-pane">
            <div className="product-selector">
              <h2>Select Product</h2>
              <div className="product-grid">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className={`product-card ${
                      selectedProduct?._id === product._id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="product-name">{product.name}</div>
                    <div className="product-price">${product.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {selectedProduct && (
              <BatchInventoryUpload
                productId={selectedProduct._id}
                productName={selectedProduct.name}
                onSuccess={() => {
                  if (selectedProduct) {
                    fetchInventory(selectedProduct._id);
                    fetchStats(selectedProduct._id);
                  }
                }}
              />
            )}

            {!selectedProduct && (
              <EmptyState
                icon="📦"
                title="Select a Product"
                message="Choose a product to create batch inventory items"
              />
            )}
          </div>
        )}

        {/* Manage Inventory Tab */}
        {activeTab === "manage" && (
          <div className="tab-pane">
            <div className="inventory-management">
              <div className="management-sidebar">
                <h3>Products</h3>
                <div className="product-list">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className={`product-item ${
                        selectedProduct?._id === product._id ? "active" : ""
                      }`}
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="product-info">
                        <div className="product-title">{product.name}</div>
                        <div className="product-price">
                          ${product.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="inventory-main">
                {selectedProduct ? (
                  <>
                    <div className="inventory-header">
                      <h2>{selectedProduct.name}</h2>

                      {stats && (
                        <div className="inventory-stats">
                          <div className="stat-card">
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-label">Total Items</div>
                          </div>
                          <div className="stat-card available">
                            <div className="stat-value">{stats.available}</div>
                            <div className="stat-label">Available</div>
                          </div>
                          <div className="stat-card sold">
                            <div className="stat-value">{stats.sold}</div>
                            <div className="stat-label">Sold</div>
                          </div>
                          <div className="stat-card damaged">
                            <div className="stat-value">{stats.damaged}</div>
                            <div className="stat-label">Damaged</div>
                          </div>
                          <div className="stat-card returned">
                            <div className="stat-value">{stats.returned}</div>
                            <div className="stat-label">Returned</div>
                          </div>
                          <div className="stat-card in-transit">
                            <div className="stat-value">{stats["in-transit"]}</div>
                            <div className="stat-label">In Transit</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="filters">
                      <label>Filter by Status:</label>
                      <select
                        value={filters.status}
                        onChange={(e) =>
                          setFilters({ ...filters, status: e.target.value })
                        }
                      >
                        <option value="all">All Status</option>
                        <option value="available">Available</option>
                        <option value="sold">Sold</option>
                        <option value="damaged">Damaged</option>
                        <option value="returned">Returned</option>
                        <option value="in-transit">In Transit</option>
                      </select>
                    </div>

                    {loading ? (
                      <div className="loading-state">
                        <LoadingSpinner size="medium" />
                        <p>Loading inventory...</p>
                      </div>
                    ) : inventory.length > 0 ? (
                      <div className="inventory-table">
                        <div className="table-header">
                          <div className="col-code">Item Code</div>
                          <div className="col-batch">Batch</div>
                          <div className="col-status">Status</div>
                          <div className="col-location">Location</div>
                          <div className="col-created">Created</div>
                          <div className="col-actions">Actions</div>
                        </div>
                        <div className="table-body">
                          {inventory.map((item) => (
                            <div key={item._id} className="table-row">
                              <div className="col-code">
                                <code>{item.itemCode}</code>
                              </div>
                              <div className="col-batch">
                                {item.batchNumber || "-"}
                              </div>
                              <div className="col-status">
                                <span
                                  className="status-badge"
                                  style={{
                                    backgroundColor: getStatusColor(item.status),
                                  }}
                                >
                                  {item.status}
                                </span>
                              </div>
                              <div className="col-location">
                                {item.location || "-"}
                              </div>
                              <div className="col-created">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </div>
                              <div className="col-actions">
                                <button
                                  onClick={() => handleStatusChange(item)}
                                  className="btn-edit"
                                  title="Edit Status"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(item.itemCode)}
                                  className="btn-delete"
                                  title="Delete Item"
                                >
                                  🗑️
                                </button>
                              </div>

                              {editingItem?._id === item._id && (
                                <div className="edit-form-overlay">
                                  <div className="edit-form">
                                    <h4>Update Item Status</h4>

                                    <div className="form-group">
                                      <label>Status</label>
                                      <select
                                        value={editForm.status}
                                        onChange={(e) =>
                                          setEditForm({
                                            ...editForm,
                                            status: e.target.value,
                                          })
                                        }
                                      >
                                        <option value="available">Available</option>
                                        <option value="sold">Sold</option>
                                        <option value="damaged">Damaged</option>
                                        <option value="returned">Returned</option>
                                        <option value="in-transit">In Transit</option>
                                      </select>
                                    </div>

                                    <div className="form-group">
                                      <label>Location</label>
                                      <input
                                        type="text"
                                        value={editForm.location}
                                        onChange={(e) =>
                                          setEditForm({
                                            ...editForm,
                                            location: e.target.value,
                                          })
                                        }
                                        placeholder="e.g., Warehouse A"
                                      />
                                    </div>

                                    <div className="form-group">
                                      <label>Notes</label>
                                      <textarea
                                        value={editForm.notes}
                                        onChange={(e) =>
                                          setEditForm({
                                            ...editForm,
                                            notes: e.target.value,
                                          })
                                        }
                                        placeholder="Additional notes..."
                                        rows="3"
                                      ></textarea>
                                    </div>

                                    <div className="form-actions">
                                      <button
                                        onClick={handleSaveStatusChange}
                                        className="btn-primary"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingItem(null)}
                                        className="btn-secondary"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <EmptyState
                        icon="📦"
                        title="No Items"
                        message={
                          filters.status === "all"
                            ? "No inventory items for this product yet"
                            : `No ${filters.status} items for this product`
                        }
                      />
                    )}
                  </>
                ) : (
                  <EmptyState
                    icon="📊"
                    title="Select a Product"
                    message="Choose a product from the list to view and manage its inventory"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminInventoryPage;
