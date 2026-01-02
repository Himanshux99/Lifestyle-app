import { API_BASE_URL } from "../config/api";
import axios from "axios";

const headers = {
  "Content-Type": "application/json",
};

export const addExpenseApi = async (payload, accessToken) => {
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  const response = await axios.post(`${API_BASE_URL}/api/expenses`, payload, {
    withCredentials: true,
    headers,
  });

  return response.data;
};

export const getAllExpenseApi = async (accessToken) => {
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  const response = await axios.get(`${API_BASE_URL}/api/expenses`, {
    withCredentials: true,
    headers,
  });
  // console.log("response : ",response.data.data);
  return response.data;
};

export const deleteExpenseApi = async (id,accessToken)=>{
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  const response = await axios.delete(`${API_BASE_URL}/api/expenses/${id}`, {
    withCredentials: true,
    headers,
  });

  return response.data;
}