import React, { useState, useEffect } from "react";
import { listForTime } from "../../services/CardexService";

export const CardexListComponent = () => {
  const [cardexList, setCardexList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const itemsPerPage = 8  ;

  useEffect(() => {
    loadAllCardex();
  }, []);

  const loadAllCardex = async () => {
      const response = await listForTime(null, null);
      setCardexList(response.data);
  };

  const handleFilter = async (e) => {
    e.preventDefault();

      const response = await listForTime(
        startDate || null,
        endDate || null
      );
      setCardexList(response.data);
      setCurrentPage(1);
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    loadAllCardex();
  };

  const totalPages = Math.ceil(cardexList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCardex = cardexList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container">
      <h2 className="text-center">Kardex</h2>

      <form className="row g-3 mb-4" onSubmit={handleFilter}>
        <div className="col-md-4">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button type="submit" className="btn btn-primary w-100">
            Filter
          </button>
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button type="button" className="btn btn-outline-secondary w-5000" onClick={handleClear}>
            Reset
          </button>
        </div>
      </form>

  
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date Move</th>
            <th>Type Move</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Amount</th>
            <th>Email User</th>
            <th>ID Tool</th>
            <th>ID Loan</th>
            <th>Client Rut</th>
          </tr>
        </thead>
        <tbody>
          {currentCardex.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.id}</td>
              <td>{entry.moveDate}</td>
              <td>{entry.typeMove}</td>
              <td>{entry.description}</td>
              <td>{entry.quantity}</td>
              <td>{entry.amount}</td>
              <td>{entry.userEmail}</td>
              <td>{entry.toolId}</td>
              <td>{entry.loanId}</td>
              <td>{entry.clientRut}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ← Previus Page
        </button>

        <span>Page {currentPage} of {totalPages}</span>

        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next Page →
        </button>
      </div>
    </div>
  );
};

export default CardexListComponent;
