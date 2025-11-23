import axios from "axios";

export const API_BASE = process.env.REACT_APP_API_BASE;

console.log("API BASE:", API_BASE);

export const api = axios.create({
  baseURL: API_BASE,
});
