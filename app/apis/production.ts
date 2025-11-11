import axios from "axios";
import { config } from "../config";
import { ProductionLogInterface } from "../interface/productionLogInterface";
import { ProductionLossInterface } from "../interface/ProductionLossInterface";
import { ProductionInterface } from "../interface/ProductionInterface";

export const getProductions = async () => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.get(`${config.apiUrl}/api/productions`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const getProduction = async (id: number) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.get(`${config.apiUrl}/api/productions/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const deleteProduction = async (id: number) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.delete(`${config.apiUrl}/api/productions/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const createProduction = async (production: {
  name: string;
  detail: string;
}) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.post(`${config.apiUrl}/api/productions`, production, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const editProduction = async (
  id: number,
  production: { name: string; detail: string }
) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.put(`${config.apiUrl}/api/productions/${id}`, production, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const getProductionLog = async (id: number) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.get(`${config.apiUrl}/api/production-log/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const createProductionLog = async (
  payload: Omit<ProductionLogInterface, "id" | "production">
) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.post(`${config.apiUrl}/api/production-log`, payload, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const updateProductionLog = async (
  id: number,
  payload: Omit<ProductionLogInterface, "id" | "production">
) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.put(`${config.apiUrl}/api/production-log/${id}`, payload, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const deleteProductionLog = async (id: number) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.delete(`${config.apiUrl}/api/production-log/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const getProductionLoss = async (productionId: number) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.get(
    `${config.apiUrl}/api/production-loss/${productionId}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
};

export const createProductionLoss = async (
  payload: Omit<ProductionLossInterface, "id" | "production">
) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.post(`${config.apiUrl}/api/production-loss`, payload, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const updateProductionLoss = async (
  id: number,
  payload: Omit<ProductionLossInterface, "id" | "production">
) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.put(
    `${config.apiUrl}/api/production-loss/${id}`,
    payload,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
};

export const deleteProductionLoss = async (id: number) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.delete(`${config.apiUrl}/api/production-loss/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const updatePrice = async (payload: ProductionInterface) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.put(
    `${config.apiUrl}/api/productions/updatePrice/${payload.id}`,
    payload,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
};
