import axios from "axios";
const apiBase = import.meta.env.VITE_API_BASE_URL;


export const listCardex = () => axios.get(apiBase+"/cardex/getAllCardex");

export const listForTime = (start, end, idTool) => axios.post(`${apiBase}/cardex/getForTime`, { start, end, idTool });

export const searchByToolId = () => axios.post(`${apiBase}/cardex/createCardex`);