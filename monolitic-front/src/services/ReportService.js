import axios from 'axios';

const API_URL = 'http://localhost:8090/api/reports';

const getActiveLoans = (startDate, endDate) => {
    let url = `${API_URL}/active-loans`;
    if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return axios.get(url);
};

const getOverdueLoans = (startDate, endDate) => {
    let url = `${API_URL}/overdue-loans`;
    if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return axios.get(url);
};

const getClientsWithOverdueLoans = (startDate, endDate) => {
    let url = `${API_URL}/overdue-clients`;
    if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return axios.get(url);
};

const getToolRanking = (startDate, endDate) => {
    let url = `${API_URL}/ranking`;
    if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return axios.get(url);
};

export default {
    getActiveLoans,
    getOverdueLoans,
    getClientsWithOverdueLoans,
    getToolRanking
};
