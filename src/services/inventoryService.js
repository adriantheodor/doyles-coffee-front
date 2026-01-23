// Helper function to get authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const API_BASE_URL = process.env.REACT_APP_API_BASE || "/";

// CREATE OPERATIONS
export const createInventoryItem = async (itemData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/inventory/item`, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create inventory item");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Error creating inventory item");
  }
};

export const createBatchInventoryItems = async (batchData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/inventory/batch`, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(batchData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create batch items");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Error creating batch items");
  }
};

// RETRIEVAL OPERATIONS
export const scanQRCode = async (itemCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/inventory/scan/${itemCode}`, {
      method: "GET",
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Item not found");
      }
      const error = await response.json();
      throw new Error(error.message || "Failed to scan QR code");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Error scanning QR code");
  }
};

export const getInventoryItemByCode = async (itemCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/inventory/item/${itemCode}`, {
      method: "GET",
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Item not found");
      }
      const error = await response.json();
      throw new Error(error.message || "Failed to retrieve item");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Error retrieving item");
  }
};

export const getQRCode = async (itemCode, format = "image") => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/inventory/qr/${itemCode}?format=${format}`,
      {
        method: "GET",
        headers: getAuthHeader(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to retrieve QR code");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Error retrieving QR code");
  }
};

export const getProductInventory = async (productId, status = null) => {
  try {
    let url = `${API_BASE_URL}/api/inventory/product/${productId}`;
    if (status) {
      url += `?status=${status}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to retrieve product inventory");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Error retrieving product inventory");
  }
};

export const getInventoryStats = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/inventory/stats/${productId}`, {
      method: "GET",
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to retrieve inventory stats");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Error retrieving inventory stats");
  }
};

// UPDATE OPERATIONS
export const updateInventoryItemStatus = async (itemCode, statusData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/inventory/item/${itemCode}/status`,
      {
        method: "PUT",
        headers: getAuthHeader(),
        body: JSON.stringify(statusData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update item status");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Error updating item status");
  }
};

// DELETE OPERATIONS
export const deleteInventoryItem = async (itemCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/inventory/item/${itemCode}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete inventory item");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Error deleting inventory item");
  }
};
