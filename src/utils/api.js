import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE;

console.log("API BASE:", API_BASE); // DEBUG — REMOVE LATER

export const api = axios.create({
  baseURL: API_BASE,
});
