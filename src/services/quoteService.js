// src/services/quoteService.js
import api from "../utils/api";

class QuoteService {
  /**
   * Submit a new quote request
   * POST /api/quotes
   */
  async submitQuote(quoteData) {
    const response = await api.post("api/quotes", quoteData);
    return response.data;
  }

  /**
   * Convert quote to customer and auto-create user account
   * POST /api/quotes/{quoteId}/convert-to-customer
   * Requires: quoteId, password (and optionally other user details)
   */
  async convertQuoteToCustomer(quoteId, userData) {
    const response = await api.post(
      `api/quotes/${quoteId}/convert-to-customer`,
      userData
    );
    return response.data;
  }

  /**
   * Get a specific quote by ID
   * GET /api/quotes/{quoteId}
   */
  async getQuote(quoteId) {
    const response = await api.get(`api/quotes/${quoteId}`);
    return response.data;
  }
}

const quoteService = new QuoteService();
export default quoteService;
