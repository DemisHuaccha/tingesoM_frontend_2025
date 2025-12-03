import axios from "axios";
const apiBase = import.meta.env.VITE_API_BASE_URL;

export const listClients = () => axios.get(apiBase + "/client/getAll");

export const createClient = (client) => axios.post(apiBase + "/client/createClient", client);

export const updateStatusClient = (idClient) => axios.put(`${apiBase}/client/updateStatus/${idClient}`);

export const searchClientRuts = (partialRut) => {
    return axios.get(`${apiBase}/client/search`, { params: { rut: partialRut } });
};

export const updateClient = (client, id) => axios.put(`${apiBase}/client/update/${id}`, client);

export const getClientById = (id) => axios.get(`${apiBase}/client/get/${id}`);

export const getDelayedClients = () => axios.get(`${apiBase}/client/getDelayedClients`);
