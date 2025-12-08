import React, { useEffect, useState } from "react";
import { API_BASE } from "../../../utils/api";

const InventoryManager = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch inventory
  const loadItems = async () => {
    const res = await fetch(`${API_BASE}api/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Input handler
  const updateForm = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Create or Update
  const saveItem = async () => {
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${API_BASE}api/products/${editingId}`
      : `${API_BASE}api/products`;

    await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm({ name: "", price: "", stock: "" });
    setEditingId(null);
    loadItems();
  };

  // Delete
  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    await fetch(`${API_BASE}api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadItems();
  };

  // Fill form for editing
  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      price: item.price,
      stock: item.stock,
    });
  };

  return (
    <div className="page-container">
      <div className="page-card">
      <h2 className="page-title">Inventory Manager</h2>

      <h3>{editingId ? "Edit Item" : "Add New Item"}</h3>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={updateForm}
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={updateForm}
      />
      <input
        name="stock"
        type="number"
        placeholder="Stock"
        value={form.stock}
        onChange={updateForm}
      />
      <button onClick={saveItem}>
        {editingId ? "Update" : "Add"}
      </button>

      <hr />

      <h3>Current Inventory</h3>
      {items.map((item) => (
        <div
          key={item._id}
          style={{
            border: "1px solid #ccc",
            marginBottom: "8px",
            padding: "8px",
          }}
        >
          <p><strong>{item.name}</strong></p>
          <p>Price: ${item.price}</p>
          <p>Stock: {item.stock}</p>

          <button onClick={() => startEdit(item)}>Edit</button>
          <button
            style={{ marginLeft: "10px", color: "red" }}
            onClick={() => deleteItem(item._id)}
          >
            Delete
          </button>
        </div>
      ))}
      </div>
    </div>
  );
};

export default InventoryManager;
