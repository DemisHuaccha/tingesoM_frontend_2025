import React, { useEffect, useState } from "react";
import { listLoan, returnLoan} from "../../services/LoanService";
import {useNavigate} from 'react-router-dom'
import { useKeycloak } from "@react-keycloak/web";

export const ListLoanComponent = () => {
  const [loans, setLoans] = useState([]);
    const { keycloak } = useKeycloak();
    const userEmail = keycloak?.tokenParsed?.email;

  const navigator = useNavigate();

  
  function ReturnLoan(idLoan) {
    const email = userEmail;
    const payload = { loanId: idLoan, email };
    returnLoan(payload)
      .then(() => {
        loadLoans();
      })
      .catch((error) => {
        console.error("Error al actualizar status:", error);
      });
    }


    useEffect(() => {
      loadLoans()} , []);

    function addNewLoan(){
      navigator('/add-Loan')
    }

    function loadLoans() {
          listLoan()
          .then((response) => {
            setLoans(response.data);
          })
          .catch((error) => {
            console.error("Error al cargar clientes:", error);
          });
        }
/*
    function ReturnLoan(idLoan) {
      returnLoan(idLoan)
      .then((response) => {
        //console.log('Loan status update:', response.data);
        setLoans(prev => prev.filter(loan => loan.idLoan !== idLoan));
        loadLoans();
      })
      .catch((error) => {
        console.error('Error al actualizar status:', error);
      });
    }
//<button className='btn btn-primary' onClick={addNewLoan}>Add Loan</button>
*/
  return (
    <div className="container">
      <h2 className="text-center"> List of Loans</h2>
      <div style={{ textAlign: 'left', marginBottom: '10px' }}>
      </div>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Loan id</th>
            <th>Loan delivery date</th>
            <th>Loan return date</th>
            <th>Loan client Rut</th>
            <th>Loan tool id</th>
            <th>Loan status</th>
            <th>Loan penalty</th>
            <th>Loan penalty total</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.loanId}>
              <td>{loan.loanId}</td>
              <td>{loan.deliveryDate} </td>
              <td>{loan.returnDate} </td>
              <td>{loan.clientRut} </td>
              <td>{loan.toolId} </td>
              <td>{loan.loanStatus ? "Active" : "Finished"} </td>
              <td>{loan.penalty ? "Penalized" : "Free"} </td>
              <td>{loan.penaltyTotal} </td>
              <td><button className="btn btn-danger" onClick={() => ReturnLoan(loan.loanId)}> Finalize loan </button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListLoanComponent;