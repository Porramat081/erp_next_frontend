import axios from "axios";
import { config } from "../config";

export const getMaterials = async () => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.get(`${config.apiUrl}/api/materials`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const createMaterial = async (payload: {
  name: string;
  unitName: string;
  qty: number;
}) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.post(`${config.apiUrl}/api/materials`, payload, {
    headers: { Authorization: "Bearer " + token },
  });
};

export const updateMaterial = async (
  id: number,
  payload: { name: string; unitName: string; qty: number }
) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.put(`${config.apiUrl}/api/materials/${id}`, payload, {
    headers: { Authorization: "Bearer " + token },
  });
};

export const deleteMaterial = async (id: number) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.delete(`${config.apiUrl}/api/materials/${id}`, {
    headers: { Authorization: "Bearer " + token },
  });
};
