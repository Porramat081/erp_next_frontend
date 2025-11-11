import axios from "axios";
import { config } from "../config";

export const getReports = async (year: number) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.get(
    `${config.apiUrl}/api/report/sum-income-per-month/${year}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
};

export const getBillSale = async () => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.get(`${config.apiUrl}/api/bill-sale`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const getBillSaleDetail = async (billId: number) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.get(`${config.apiUrl}/api/bill-sale/${billId}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const deleteBillSale = async (billId: number) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.delete(`${config.apiUrl}/api/bill-sale/${billId}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const paidBillSale = async (billId: number) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.put(`${config.apiUrl}/api/bill-sale/${billId}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const getDashboard = async () => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.get(`${config.apiUrl}/api/report/dashboard`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
