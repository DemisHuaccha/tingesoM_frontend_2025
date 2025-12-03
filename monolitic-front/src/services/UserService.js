import axios from "axios";
const apiBase = import.meta.env.VITE_API_BASE_URL;

export const createUser = (user) => axios.post(`${apiBase}/user/createUser`, user);

export const updateUser = (user) => axios.put(`${apiBase}/user/updateUser`, user);