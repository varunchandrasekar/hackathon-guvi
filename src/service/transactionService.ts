import axios from "axios";

// Base backend URL
const API_BASE_URL = "http://localhost:8080/api/transactions";

// Axios instance (good practice)
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const transactionService = {
  
  addTransaction: (transaction) => {
    return api.post("/", transaction);
  },

  addTransferAccount: (transfer) => {
    return api.post("/transferAccounts", transfer);
  },

  getAllTransactions: () => {
    return api.get("/");
  },

  updateTransaction: (id, updatedTransaction) => {
    return api.put(`/${id}`, updatedTransaction);
  },

  deleteTransaction: (id) => {
    return api.get(`/${id}`);
  },

  getTransactionsByDateRange: (startDate, endDate) => {
    return api.get("/range", {
      params: {
        start: startDate,
        end: endDate,
      },
    });
  },

  getSummary: (startDate, endDate) => {
    return api.get("/summary", {
      params: {
        start: startDate,
        end: endDate,
      },
    });
  },

  getCategorySummary: (startDate, endDate) => {
    return api.get("/category-summary", {
      params: {
        start: startDate,
        end: endDate,
      },
    });
  },

  getExcelReport: (startDate, endDate) => {
    return api.get("/excelReport", {
      params: {
        start: startDate,
        end: endDate,
      },
      responseType: "blob", // Important for file downloads
    });
  },
};

export default transactionService;
