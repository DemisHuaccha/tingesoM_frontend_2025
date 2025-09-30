import axios from "axios";
const apiBase = import.meta.env.VITE_API_BASE_URL;

export const listCustomer = () => axios.get(apiBase+"/customer/getAll");

export const createCustomer =  (customer) => axios.post(apiBase+"/customer/createCustomer", customer);

export const updateStatusCustomer = (idCustomer) => axios.put(`${apiBase}/customer/updateStatus/${idCustomer}`);