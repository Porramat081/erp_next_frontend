import axios from "axios";
import { config } from "../config";

export const getUserData = async () => {
  const token = localStorage.getItem(config.tokenKey);
  if (!token) {
    return false;
  }
  return await axios.get(`${config.apiUrl}/api/users/admin-info`, {
    headers: {
      Authorization: `Bearer ` + token,
    },
  });
};

export const editUserData = async (payload: {
  username: string;
  email: string;
  password: string;
}) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.put(
    `${config.apiUrl}/api/users/admin-edit-profile`,
    payload,
    {
      headers: {
        Authorization: `Bearer ` + token,
      },
    }
  );
};

export const getAllUsers = async () => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.get(`${config.apiUrl}/api/users`, {
    headers: {
      Authorization: `Bearer ` + token,
    },
  });
};

export const createUser = async (payload: {
  username: string;
  email: string;
  password: string;
}) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.post(`${config.apiUrl}/api/users/admin-create`, payload, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const editUser = async (
  id: number,
  payload: { username: string; email: string; password: string }
) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.put(`${config.apiUrl}/api/users/${id}`, payload, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const deleteUser = async (id: number) => {
  const token = localStorage.getItem(config.tokenKey);
  return await axios.delete(`${config.apiUrl}/api/users/admin-delete/` + id, {
    headers: { Authorization: "Bearer " + token },
  });
};
