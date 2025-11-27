import React, { useEffect, useState } from "react";
import {  filterTool, updateStatusTool, underRepairTool, deleteTool, gruopTools } from "../../services/ToolService";
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from "@react-keycloak/web";
import ToolTable from "./ToolTable";
import GroupedToolTable from "./GroupToolTable";

export const ListToolComponent = () => {
  const [tools, setTools] = useState([]);
  const [filters, setFilters] = useState({ nameTool: "", categoryTool: "", feeTool: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [groupedTools, setGroupedTools] = useState([]);
  const [showGrouped, setShowGrouped] = useState(false);

  const navigator = useNavigate();
  const { keycloak } = useKeycloak();

  useEffect(() => {
    applyFilter();
  }, [filters]);

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
      if (field === "deleteStatus") {
        if (!hasRole("ADMIN")) {
          alert("Only ADMIN users can delete tools.");
          return;
        }
        await deleteTool(dto);}
      applyFilter();
    } catch (error) {
      console.error(`Error in the update ${field}:`, error);
    }
  };
  

  const handleGroupToolsToggle = () => {
    if (!hasRole("ADMIN") && !hasRole("USER")) {
      alert("No authorization.");
      return;
    }

    if (showGrouped) {
      setShowGrouped(false);
    } else {
      gruopTools()
        .then((response) => {
          setGroupedTools(response.data);
          setShowGrouped(true);
        })
        .catch((error) => {
          console.error("Error fetching grouped tools:", error);
        });
    }
  };


  const addNewTool = () => navigator('/add-Tool');

  const navigateToUpdateTool = (tool) => {
    if (!hasRole("ADMIN")) {
      alert("Only admin user can update a tool.");
      return;
    }
    navigator(`/updateTool/${tool.idTool}`, { state: { tool } });
  };

   const navigateToLoan = (tool) => {
    if (!hasRole("ADMIN") && !hasRole("USER")) {
      alert("No authorization.");
      return;
    }
    navigator(`/add-Loan/${tool.idTool}`, { state: { tool } });
  };

  const handleClear = () => {
  setFilters({ nameTool: "", categoryTool: "", feeTool: "" });
  };

  const totalPages = Math.ceil(tools.length / itemsPerPage);
  const currentTools = tools.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="container mt-3">
      <h2 className="text-center">List of Tools</h2>

      <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-primary mx-2" onClick={handleGroupToolsToggle}>
            {showGrouped ? "Show All Tools" : "Group Tools"}
          </button>
          <button className="btn btn-primary" onClick={addNewTool}>
            Add Tool
          </button>
        </div>

        {!showGrouped && (
          <div className="d-flex justify-content-end mb-3">
            <input
              type="text"
              className="form-control mx-2"
              placeholder="Name"
              value={filters.nameTool}
              onChange={(e) => setFilters({ ...filters, nameTool: e.target.value })}
            />
            <input
              type="text"
              className="form-control mx-2"
              placeholder="Category"
              value={filters.categoryTool}
              onChange={(e) => setFilters({ ...filters, categoryTool: e.target.value })}
            />
            <input
              type="number"
              className="form-control mx-2"
              placeholder="Fee"
              value={filters.feeTool}
              onChange={(e) => setFilters({ ...filters, feeTool: e.target.value })}
            />

            <div className="col-md-2 d-flex align-items-end">
          <button type="button" className="btn btn-outline-secondary w-5000" onClick={handleClear}>
            Reset
          </button>
        </div>
          </div>
        )}
      </div>

      {showGrouped ? 
      ( <>
        <GroupedToolTable groupedTools={groupedTools} />
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
      </>   
      ) : (
        <>
          <ToolTable
            tools={currentTools}
            onStatusChange={handleStatusChange}
            onLoan={navigateToLoan}
            onUpdate={navigateToUpdateTool}
          />
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
        </>
      )}
    </div>
  );
};

export default ListToolComponent;
