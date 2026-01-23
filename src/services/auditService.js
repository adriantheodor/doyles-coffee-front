// src/services/auditService.js
import { API_BASE } from "../utils/api";

/**
 * Audit Log Service
 * Handles all audit log API calls for admin dashboard
 */
class AuditService {
  /**
   * Get all audit logs with optional filtering
   * GET /api/auth/admin/audit-logs
   * 
   * @param {Object} filters - Query filters
   * @param {string} filters.action - Filter by action (LOGIN, FAILED_LOGIN, REGISTER, etc.)
   * @param {number} filters.limit - Number of logs to return (default 50)
   * @param {number} filters.skip - Number of logs to skip for pagination (default 0)
   * @param {string} filters.startDate - Start date for filtering (ISO format)
   * @param {string} filters.endDate - End date for filtering (ISO format)
   * @param {string} filters.userId - Filter by specific user ID
   * @returns {Promise<Object>} { logs, total, count }
   */
  async getAuditLogs(filters = {}) {
    try {
      const token = localStorage.getItem("accessToken");
      const queryParams = new URLSearchParams();

      if (filters.action) queryParams.append("action", filters.action);
      if (filters.limit) queryParams.append("limit", filters.limit);
      if (filters.skip) queryParams.append("skip", filters.skip);
      if (filters.startDate) queryParams.append("startDate", filters.startDate);
      if (filters.endDate) queryParams.append("endDate", filters.endDate);
      if (filters.userId) queryParams.append("userId", filters.userId);

      const response = await fetch(
        `${API_BASE}api/auth/admin/audit-logs?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch audit logs: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      throw error;
    }
  }

  /**
   * Get specific user's activity history
   * GET /api/auth/admin/audit-logs/user/:userId
   * 
   * @param {string} userId - User ID to fetch logs for
   * @param {Object} filters - Additional filters
   * @param {number} filters.limit - Limit results
   * @param {number} filters.skip - Skip results
   * @returns {Promise<Object>} { logs, total }
   */
  async getUserAuditLogs(userId, filters = {}) {
    try {
      const token = localStorage.getItem("accessToken");
      const queryParams = new URLSearchParams();

      if (filters.limit) queryParams.append("limit", filters.limit);
      if (filters.skip) queryParams.append("skip", filters.skip);

      const response = await fetch(
        `${API_BASE}api/auth/admin/audit-logs/user/${userId}?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user audit logs: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user audit logs:", error);
      throw error;
    }
  }

  /**
   * Get resource change history
   * GET /api/auth/admin/audit-logs/resource/:resourceType/:resourceId
   * 
   * @param {string} resourceType - Type of resource (Product, Order, etc.)
   * @param {string} resourceId - ID of the resource
   * @param {Object} filters - Additional filters
   * @param {number} filters.limit - Limit results
   * @param {number} filters.skip - Skip results
   * @returns {Promise<Object>} { logs, total }
   */
  async getResourceAuditLogs(resourceType, resourceId, filters = {}) {
    try {
      const token = localStorage.getItem("accessToken");
      const queryParams = new URLSearchParams();

      if (filters.limit) queryParams.append("limit", filters.limit);
      if (filters.skip) queryParams.append("skip", filters.skip);

      const response = await fetch(
        `${API_BASE}api/auth/admin/audit-logs/resource/${resourceType}/${resourceId}?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch resource audit logs: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching resource audit logs:", error);
      throw error;
    }
  }
}

const auditService = new AuditService();
export default auditService;
