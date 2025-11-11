import axios from "axios";
import { config } from "../config";
import { FormularInterface } from "../interface/FormularInterface";

export const getFormulars = async (id: number) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.get(`${config.apiUrl}/api/formulars/${id}`, {
    headers: { Authorization: "Bearer " + token },
  });
};

export const createFormular = async (
  payload: Omit<FormularInterface, "id" | "material" | "production">
) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.post(`${config.apiUrl}/api/formulars`, payload, {
    headers: { Authorization: "Bearer " + token },
  });
};

export const updateFormular = async (
  id: number,
  payload: Omit<FormularInterface, "id">
) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.put(`${config.apiUrl}/api/formulars/${id}`, payload, {
    headers: { Authorization: "Bearer " + token },
  });
};

export const deleteFormular = async (id: number) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.delete(`${config.apiUrl}/api/formulars/${id}`, {
    headers: { Authorization: "Bearer " + token },
  });
};
