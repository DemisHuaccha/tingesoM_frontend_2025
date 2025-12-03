import axios from "axios";
const apiBase = import.meta.env.VITE_API_BASE_URL;

export const listTool = () => axios.get(apiBase + "/tool/getAll");

export const getToolById = (idTool) => axios.get(`${apiBase}/tool/${idTool}`);

export const createTool = (tool) => axios.post(`${apiBase}/tool/createTool`, tool);

export function updateTool(toolData) { return axios.put(`${apiBase}/tool/update`, toolData); }
export function underRepairTool(toolStatus) { return axios.put(`${apiBase}/tool/underRepair`, toolStatus); }
export function updateStatusTool(toolStatus) { return axios.put(`${apiBase}/tool/updateStatus`, toolStatus); }
export function deleteTool(toolStatus) { return axios.put(`${apiBase}/tool/deleteTool`, toolStatus); }

export const filterTool = (filterDto) => axios.post(`${apiBase}/tool/filter`, filterDto);
export const gruopTools = () => axios.get(`${apiBase}/tool/getGroup`);

export const rankingTools = () => axios.get(`${apiBase}/tool/ranking`);

export const searchTools = (id) => axios.get(`${apiBase}/tool/search/${id}`);