import React from "react";

const ToolTable = ({ tools, onStatusChange, onLoan, onUpdate }) => (
  <table className="table table-striped table-bordered">
    <thead>
      <tr>
        <th>Loan</th>
        <th>Tool id</th>
        <th>Name</th>
        <th>Category</th>
        <th>Replacement Value</th>
        <th>Damage Value</th>
        <th>Loan Fee</th>
        <th>Penalty</th>
        <th>Condition</th>
        <th>Status</th>
        <th>Repair</th>
        <th>Delete</th>

      </tr>
    </thead>
    <tbody>
      {tools.map((tool) => (
        <tr key={tool.idTool}>
          <td>
            <button className="btn btn-warning btn-sm" onClick={() => onLoan(tool)}>Make Loan</button>
          </td>
          <td>{tool.idTool}</td>
          <td>{tool.name}</td>
          <td>{tool.category}</td>
          <td>{tool.replacementValue}</td>
          <td>{tool.damageValue}</td>
          <td>{tool.loanFee}</td>
          <td>{tool.penaltyForDelay}</td>
          <td>{tool.initialCondition}</td>
          <td>{tool.status ? "Available" : "Unavailable"}</td>
          <td>{tool.underRepair ? "In Repair" : "Available"}</td>
          <td>{tool.deleteStatus ? "Deleted" : "Available"}</td>
          <td><button className="btn btn-danger btn-sm" onClick={() => onStatusChange(tool.idTool, "status", tool.status)}>Change Status</button></td>
          <td><button className="btn btn-info btn-sm" onClick={() => onStatusChange(tool.idTool, "underRepair", tool.underRepair)}>Repair</button></td>
          <td><button className="btn btn-dark btn-sm" onClick={() => onStatusChange(tool.idTool, "deleteStatus", tool.deleteStatus)}>Delete</button></td>
          <td><button className="btn btn-warning btn-sm" onClick={() => onUpdate(tool)}>Update</button></td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ToolTable;
