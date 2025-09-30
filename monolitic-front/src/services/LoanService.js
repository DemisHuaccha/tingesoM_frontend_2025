import axios from "axios";
const apiBase = import.meta.env.VITE_API_BASE_URL;

export const listLoan = () => axios.get(apiBase+"/Loan/getAll");

export const createLoan =  (loan) => axios.post(apiBase+"/Loan/createLoan", loan);

//export const returnLoan = (loanData) =>axios.put(`${apiBase}/Loan/return`, loanData);

export const returnLoan = (loanData) =>
  axios.put(`${apiBase}/Loan/return`, loanData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

