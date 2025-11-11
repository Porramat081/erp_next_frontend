import axios from "axios";
import { config } from "../config";

export const createSaleTemp = async (productId: number) => {
  const payload = {
    production: {
      id: productId,
    },
  };
  const token = localStorage.getItem(config.tokenKey);
  return await axios.post(`${config.apiUrl}/api/saleTemp`, payload, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const getSaleTemp = async () => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.get(`${config.apiUrl}/api/saleTemp`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const editQtySaleTemp = async (
  id: number,
  oldQty: number,
  isUp: boolean
) => {
  const token = localStorage.getItem(config.tokenKey);
  const payload = {
    qty: isUp ? oldQty + 1 : oldQty - 1,
  };
  return await axios.put(`${config.apiUrl}/api/saleTemp/${id}`, payload, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const deleteSaleTemp = async (id: number) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.delete(`${config.apiUrl}/api/saleTemp/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const endSale = async (payload: {
  inputMoney: number;
  total: number;
  discount: number;
}) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.post(`${config.apiUrl}/api/saleTemp/endSale`, payload, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
