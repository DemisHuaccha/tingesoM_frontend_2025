import React from 'react';
import { returnLoan, returnLoanNotool, returnLoanLate } from '../../services/LoanService';

const ReturnLoanOptions = ({ loanId, userEmail, onClose, onSuccess }) => {
  const handleReturn = async (action) => {
    const payload = { loanId, email: userEmail };
    try {
      await action(payload);
      onSuccess(); // recarga lista en el padre
      onClose();   // cierra el recuadro
    } catch (error) {
      console.error("Error al actualizar préstamo:", error);
    }
  };

  return (
    <div className="card p-3 mt-4">
      <h5>Choose return status for loan #{loanId}</h5>
      <div className="d-flex gap-3 mt-2">
        <button className="btn btn-success" onClick={() => handleReturn(returnLoan)}>
          Tool returned successfully
        </button>
        <button className="btn btn-warning" onClick={() => handleReturn(returnLoanNotool)}>
          Tool needs repair
        </button>
        <button className="btn btn-secondary" onClick={() => handleReturn(returnLoanLate)}>
          Tool must be replaced
        </button>
        <button className="btn btn-outline-dark" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReturnLoanOptions;
