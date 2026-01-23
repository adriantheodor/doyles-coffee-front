import { useState, useEffect } from "react";
import auditService from "../../../services/auditService";
import "./AuditLogsManager.css";

const AuditLogsManager = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    action: "",
    startDate: "",
    endDate: "",
    userId: "",
    limit: 50,
    skip: 0,
  });
  const [totalLogs, setTotalLogs] = useState(0);
  const [viewMode, setViewMode] = useState("table"); // "table" or "timeline"
  const [selectedLog, setSelectedLog] = useState(null);
  const [expandedLogId, setExpandedLogId] = useState(null);

  // Audit action types for filtering dropdown
  const auditActions = [
    "LOGIN",
    "FAILED_LOGIN",
    "LOGOUT",
    "REGISTER",
    "EMAIL_VERIFY",
    "RESEND_EMAIL",
  ];

  const fetchAuditLogs = async (newFilters = null) => {
    setLoading(true);
    setError(null);

    try {
      const filterParams = newFilters || filters;
      const cleanFilters = {};

      if (filterParams.action) cleanFilters.action = filterParams.action;
      if (filterParams.startDate) cleanFilters.startDate = filterParams.startDate;
      if (filterParams.endDate) cleanFilters.endDate = filterParams.endDate;
      if (filterParams.userId) cleanFilters.userId = filterParams.userId;
      cleanFilters.limit = filterParams.limit;
      cleanFilters.skip = filterParams.skip;

      const response = await auditService.getAuditLogs(cleanFilters);

      setAuditLogs(response.logs || []);
      setTotalLogs(response.total || 0);
    } catch (err) {
      setError(err.message || "Failed to fetch audit logs");
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value, skip: 0 };
    setFilters(newFilters);
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchAuditLogs(filters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      action: "",
      startDate: "",
      endDate: "",
      userId: "",
      limit: 50,
      skip: 0,
    };
    setFilters(resetFilters);
    fetchAuditLogs(resetFilters);
  };

  const handlePagination = (direction) => {
    const newSkip = direction === "next" 
      ? filters.skip + filters.limit 
      : Math.max(0, filters.skip - filters.limit);
    
    const newFilters = { ...filters, skip: newSkip };
    setFilters(newFilters);
    fetchAuditLogs(newFilters);
  };

  const getActionBadgeColor = (action) => {
    const colors = {
      LOGIN: "#4CAF50",
      FAILED_LOGIN: "#f44336",
      LOGOUT: "#FF9800",
      REGISTER: "#2196F3",
      EMAIL_VERIFY: "#9C27B0",
      RESEND_EMAIL: "#00BCD4",
    };
    return colors[action] || "#757575";
  };

  const getStatusColor = (status) => {
    return status === "SUCCESS" ? "#4CAF50" : "#f44336";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const renderTableView = () => (
    <div className="audit-logs-table-container">
      <table className="audit-logs-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Action</th>
            <th>User</th>
            <th>IP Address</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {auditLogs.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                No audit logs found
              </td>
            </tr>
          ) : (
            auditLogs.map((log) => (
              <tr key={log._id} className="audit-log-row">
                <td className="timestamp">{formatDate(log.timestamp)}</td>
                <td>
                  <span
                    className="action-badge"
                    style={{ backgroundColor: getActionBadgeColor(log.action) }}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="user-info">
                  <div className="user-name">{log.userEmail}</div>
                  <div className="user-role">{log.userRole}</div>
                </td>
                <td className="ip-address">{log.ipAddress || "N/A"}</td>
                <td>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(log.status) }}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="details-cell">
                  <button
                    className="details-btn"
                    onClick={() =>
                      setExpandedLogId(
                        expandedLogId === log._id ? null : log._id
                      )
                    }
                  >
                    {expandedLogId === log._id ? "Hide" : "View"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Expanded Detail View */}
      {expandedLogId && (
        <div className="audit-log-details">
          {auditLogs.map((log) => {
            if (log._id !== expandedLogId) return null;

            return (
              <div key={log._id} className="details-panel">
                <h4>Audit Log Details</h4>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Log ID:</span>
                    <span className="detail-value">{log._id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">User ID:</span>
                    <span className="detail-value">{log.userId || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">User Agent:</span>
                    <span className="detail-value user-agent">
                      {log.userAgent || "N/A"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Endpoint:</span>
                    <span className="detail-value">{log.endpoint || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Method:</span>
                    <span className="detail-value">{log.method || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status Code:</span>
                    <span className="detail-value">{log.statusCode || "N/A"}</span>
                  </div>
                  <div className="detail-item full-width">
                    <span className="detail-label">Description:</span>
                    <span className="detail-value">{log.description || "N/A"}</span>
                  </div>
                  {log.resourceType && (
                    <div className="detail-item">
                      <span className="detail-label">Resource Type:</span>
                      <span className="detail-value">{log.resourceType}</span>
                    </div>
                  )}
                  {log.resourceId && (
                    <div className="detail-item">
                      <span className="detail-label">Resource ID:</span>
                      <span className="detail-value">{log.resourceId}</span>
                    </div>
                  )}
                </div>
                <button
                  className="close-details"
                  onClick={() => setExpandedLogId(null)}
                >
                  Close Details
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderTimelineView = () => (
    <div className="audit-logs-timeline">
      {auditLogs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          No audit logs found
        </div>
      ) : (
        auditLogs.map((log, index) => (
          <div key={log._id} className="timeline-item">
            <div
              className="timeline-marker"
              style={{ backgroundColor: getActionBadgeColor(log.action) }}
            />
            <div className="timeline-content">
              <div className="timeline-header">
                <span className="timeline-action">{log.action}</span>
                <span className="timeline-time">{formatDate(log.timestamp)}</span>
              </div>
              <div className="timeline-details">
                <p>
                  <strong>User:</strong> {log.userEmail} ({log.userRole})
                </p>
                <p>
                  <strong>IP:</strong> {log.ipAddress || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color: getStatusColor(log.status),
                      fontWeight: "bold",
                    }}
                  >
                    {log.status}
                  </span>
                </p>
                {log.description && (
                  <p>
                    <strong>Description:</strong> {log.description}
                  </p>
                )}
                <button
                  className="expand-timeline"
                  onClick={() =>
                    setSelectedLog(selectedLog?._id === log._id ? null : log)
                  }
                >
                  {selectedLog?._id === log._id ? "Collapse" : "View Details"}
                </button>
              </div>

              {selectedLog?._id === log._id && (
                <div className="timeline-expanded">
                  <h5>Full Details</h5>
                  <div className="expanded-details">
                    {log.userId && (
                      <p>
                        <strong>User ID:</strong> {log.userId}
                      </p>
                    )}
                    {log.endpoint && (
                      <p>
                        <strong>Endpoint:</strong> {log.endpoint}
                      </p>
                    )}
                    {log.method && (
                      <p>
                        <strong>Method:</strong> {log.method}
                      </p>
                    )}
                    {log.statusCode && (
                      <p>
                        <strong>Status Code:</strong> {log.statusCode}
                      </p>
                    )}
                    {log.userAgent && (
                      <p className="user-agent-text">
                        <strong>User Agent:</strong> {log.userAgent}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  const currentPage = Math.floor(filters.skip / filters.limit) + 1;
  const totalPages = Math.ceil(totalLogs / filters.limit);
  const hasNextPage = filters.skip + filters.limit < totalLogs;
  const hasPrevPage = filters.skip > 0;

  return (
    <div className="section-container audit-logs-container">
      <h2 className="section-title">📋 Audit Logs</h2>

      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
          <button onClick={() => setError(null)} className="close-alert">
            ×
          </button>
        </div>
      )}

      {/* Filter Panel */}
      <div className="audit-filters-card">
        <h3 className="sub-title">Filters & Search</h3>
        <form className="audit-filters-form" onSubmit={handleApplyFilters}>
          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="action">Action:</label>
              <select
                id="action"
                name="action"
                value={filters.action}
                onChange={handleFilterChange}
              >
                <option value="">All Actions</option>
                {auditActions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="userId">User ID:</label>
              <input
                id="userId"
                type="text"
                name="userId"
                placeholder="Enter user ID"
                value={filters.userId}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="startDate">Start Date:</label>
              <input
                id="startDate"
                type="datetime-local"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="endDate">End Date:</label>
              <input
                id="endDate"
                type="datetime-local"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="limit">Limit:</label>
              <select
                id="limit"
                name="limit"
                value={filters.limit}
                onChange={handleFilterChange}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="filters-actions">
            <button type="submit" className="btn btn-primary">
              🔍 Apply Filters
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleResetFilters}
            >
              ↺ Reset
            </button>
          </div>
        </form>
      </div>

      {/* View Mode Toggle */}
      <div className="view-mode-toggle">
        <button
          className={`toggle-btn ${viewMode === "table" ? "active" : ""}`}
          onClick={() => setViewMode("table")}
        >
          📊 Table View
        </button>
        <button
          className={`toggle-btn ${viewMode === "timeline" ? "active" : ""}`}
          onClick={() => setViewMode("timeline")}
        >
          📈 Timeline View
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading audit logs...</p>
        </div>
      )}

      {/* Results Summary */}
      {!loading && auditLogs.length > 0 && (
        <div className="results-summary">
          <span>
            Showing {filters.skip + 1} to{" "}
            {Math.min(filters.skip + filters.limit, totalLogs)} of {totalLogs}{" "}
            logs (Page {currentPage} of {totalPages})
          </span>
        </div>
      )}

      {/* Main Content */}
      {!loading && (
        <>
          {viewMode === "table" ? renderTableView() : renderTimelineView()}
        </>
      )}

      {/* Pagination */}
      {!loading && auditLogs.length > 0 && (
        <div className="pagination-controls">
          <button
            className="btn btn-pagination"
            onClick={() => handlePagination("prev")}
            disabled={!hasPrevPage}
          >
            ← Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-pagination"
            onClick={() => handlePagination("next")}
            disabled={!hasNextPage}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default AuditLogsManager;
