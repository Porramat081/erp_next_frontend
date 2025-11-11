import axios from "axios";
import { config } from "../config";
import { StockInterface } from "../interface/StockInterface";
import { StoreImportInterface } from "../interface/StoreImportInterface";

export const getStocks = async () => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.get(`${config.apiUrl}/api/stock`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const createStock = async (payload: Omit<StockInterface, "id">) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.post(`${config.apiUrl}/api/stock`, payload, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const updateStock = async (
  id: number,
  payload: Omit<StockInterface, "id">
) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.put(`${config.apiUrl}/api/stock/${id}`, payload, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const deleteStock = async (id: number) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.delete(`${config.apiUrl}/api/stock/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const getDataImport = async (id: number) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.get(`${config.apiUrl}/api/stock/data-for-import/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const importProductToStock = async (
  payload: Omit<StoreImportInterface, "id" | "production" | "stock">
) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.post(`${config.apiUrl}/api/stock/import`, payload, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const getImportHistory = async (stockId: number) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.get(`${config.apiUrl}/api/stock/import/${stockId}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const deleteImportHistory = async (importId: number) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.delete(`${config.apiUrl}/api/stock/import/${importId}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const createTransferStock = async (data: {
  fromStockId: number;
  toStockId: number;
  productionId: number;
  quantity: number;
  remark: string;
  createdAt: Date;
}) => {
  const token = localStorage.getItem(config.tokenKey);
  const payload = {
    fromStock: { id: data.fromStockId },
    toStock: { id: data.toStockId },
    production: { id: data.productionId },
    quantity: data.quantity,
    remark: data.remark,
    createdAt: data.createdAt,
  };
  return await axios.post(`${config.apiUrl}/api/transfer-stock`, payload, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const getTransferStock = async () => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.get(`${config.apiUrl}/api/transfer-stock`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const deleteTransferStock = async (id: number) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.delete(`${config.apiUrl}/api/transfer-stock/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
