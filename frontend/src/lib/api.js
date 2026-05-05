import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  timeout: 15000,
});

export const fetchRepos = async (username = "surya1321", limit = 12) => {
  const { data } = await api.get("/github/repos", { params: { username, limit } });
  return data;
};

export const submitContact = async (payload) => {
  const { data } = await api.post("/contact", payload);
  return data;
};

export const healthCheck = async () => {
  const { data } = await api.get("/health");
  return data;
};
