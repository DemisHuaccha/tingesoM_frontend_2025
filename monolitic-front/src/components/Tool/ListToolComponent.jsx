import React, { useEffect, useState } from "react";
import {  filterTool, updateStatusTool, underRepairTool, deleteTool } from "../../services/ToolService";
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from "@react-keycloak/web";

export const ListToolComponent = () => {
  const [tools, setTools] = useState([]);
  const [filters, setFilters] = useState({ nameTool: "", categoryTool: "", feeTool: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigator = useNavigate();
  const { keycloak } = useKeycloak();

  useEffect(() => {
    applyFilter();
  }, []);

  const applyFilter = () => {
    const dto = {
      nameTool: filters.nameTool || null,
      categoryTool: filters.categoryTool || null,
      feeTool: filters.feeTool ? parseInt(filters.feeTool) : null,
    };

    filterTool(dto)
      .then((response) => {
        setTools(response.data);
        setCurrentPage(1);
      })
      .catch((error) => {
        console.error("Error in the tool filter:", error);
      });
  };

  const getEmail = () => keycloak.tokenParsed?.email;

  const hasRole = (role) => {
    const roles = keycloak.tokenParsed?.realm_access?.roles || [];
    return roles.includes(role);
  };

  const handleStatusChange = async (toolId, field, currentValue) => {
    const isAuthorized = hasRole("USER") || hasRole("ADMIN");
    if (!isAuthorized) {
      alert("No authorization.");
      return;
    }

    const dto = {
      idTool: toolId,
      email: getEmail(),
      status: field === "status" ? currentValue : undefined,
      underRepair: field === "underRepair" ? currentValue : undefined,
      deleteStatus: field === "deleteStatus" ? currentValue : undefined,
    };

    try {
      if (field === "status") await updateStatusTool(dto);
      if (field === "underRepair") await underRepairTool(dto);
      if (field === "deleteStatus") await deleteTool(dto);
      applyFilter();
    } catch (error) {
      console.error(`Error in the update ${field}:`, error);
    }
  };

  const addNewTool = () => navigator('/add-Tool');

  const navigateToUpdateTool = (tool) => {
    if (!hasRole("ADMIN")) {
      alert("No authorization.");
      return;
    }
    navigator(`/updateTool/${tool.idTool}`, { state: { tool } });
  };

   const navigateToLoan = (tool) => {
    if (!hasRole("ADMIN", "USER")) {
      alert("No authorization.");
      return;
    }
    navigator(`/add-Loan/${tool.idTool}`, { state: { tool } });
  };

  const totalPages = Math.ceil(tools.length / itemsPerPage);
  const currentTools = tools.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="container mt-3">
      <h2 className="text-center">List of Tools</h2>

      <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
        <button className="btn btn-primary" onClick={addNewTool}>Add Tool</button>
        <div  className="d-flex justify-content-end mb-3">
          <input type="text" className="form-control" placeholder="Name"
            value={filters.nameTool}
            onChange={(e) => setFilters({ ...filters, nameTool: e.target.value })}
          />
          <input type="text" className="form-control" placeholder="Category"
            value={filters.categoryTool}
            onChange={(e) => setFilters({ ...filters, categoryTool: e.target.value })}
          />
          <input type="number" className="form-control" placeholder="Fee"
            value={filters.feeTool}
            onChange={(e) => setFilters({ ...filters, feeTool: e.target.value })}
          />
          <button className="btn btn-primary" onClick={applyFilter}>Filter</button>
        </div>
      </div>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Loan</th>
            <th>Tool id</th>
            <th>Name</th>
            <th>Category</th>
            <th>Replacement Value</th>
            <th>Loan Fee</th>
            <th>Penalty</th>
            <th>Condition</th>
            <th>Status</th>
            <th>Repair</th>
            <th>Delete</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentTools.map((tool) => (
            <tr key={tool.idTool}>
              <td>
                <button
                  type="button"
                  className="btn btn-warning btn-sm"
                  onClick={() => navigateToLoan(tool)}
                >
                  Make Loan
                </button>
              </td>
              <td>{tool.idTool}</td>
              <td>{tool.name}</td>
              <td>{tool.category}</td>
              <td>{tool.replacementValue}</td>
              <td>{tool.loanFee}</td>
              <td>{tool.penaltyForDelay}</td>
              <td>{tool.initialCondition}</td>
              <td>{tool.status ? "Available" : "Unavailable"}</td>
              <td>{tool.underRepair ? "In Repair" : "Available"}</td>
              <td>{tool.deleteStatus ? "Deleted" : "Available"}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleStatusChange(tool.idTool, "status", tool.status)}
                >
                  Change Status
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-info btn-sm"
                  onClick={() => handleStatusChange(tool.idTool, "underRepair", tool.underRepair)}
                >
                  Repair
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-dark btn-sm"
                  onClick={() => handleStatusChange(tool.idTool, "deleteStatus", tool.deleteStatus)}
                >
                  Delete
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-warning btn-sm"
                  onClick={() => navigateToUpdateTool(tool)}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <button className="btn btn-secondary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}>
          ← Previous Page
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button className="btn btn-secondary"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}>
          Next Page →
        </button>
      </div>
    </div>
  );
};

export default ListToolComponent;
