import React, { useState, useEffect } from "react";
import { listForTime } from "../../services/CardexService";

export const CardexListComponent = () => {
  const [cardexList, setCardexList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [toolId, setToolId] = useState("");
  const itemsPerPage = 8;

  useEffect(() => {
    loadAllCardex(null, null, null);
  }, []);

  const loadAllCardex = async (start, end, idTool) => {
    try {
      const response = await listForTime(start, end, idTool);
      setCardexList(response.data);
    } catch (error) {
      console.error("Error loading cardex:", error);
    }
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    const parsedToolId = toolId !== "" ? Number(toolId) : null;
    await loadAllCardex(startDate || null, endDate || null, parsedToolId);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setToolId("");
    loadAllCardex(null, null, null);
  };

  const totalPages = Math.ceil(cardexList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCardex = cardexList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container">
      <h2 className="text-center">Kardex</h2>

      <form className="row g-3 mb-4" onSubmit={handleFilter}>
        <div className="col-md-4">
          <label htmlFor="toolId" className="form-label">Tool Id</label>
          <input
            type="number"
            id="toolId"
            name="toolId"
            className="form-control"
            placeholder='Enter Tool Id'
            value={toolId}
            onChange={(e) => setToolId(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="startDate" className="form-label">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="endDate" className="form-label">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
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
          <button type="button" className="btn btn-outline-secondary w-100" onClick={handleClear}>
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
          ← Previous Page
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
