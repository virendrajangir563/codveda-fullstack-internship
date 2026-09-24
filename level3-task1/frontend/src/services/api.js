import axios from "axios";

const api = axios.create({
  baseURL: "https://codveda-fullstack-internship-j933.onrender.com/api",
});

export default api;