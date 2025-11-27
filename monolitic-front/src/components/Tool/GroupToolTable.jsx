import React from "react";

const GroupedToolTable = ({ groupedTools }) => (
  <table className="table table-bordered table-striped">
    <thead>
      <tr>
        <th>Name</th>
        <th>Category</th>
        <th>Condition</th>
        <th>Loan Fee</th>
        <th>Penalty</th>
        <th>Replacement Value</th>
        <th>Damage Value</th>
        <th>Stock</th>
      </tr>
    </thead>
    <tbody>
      {groupedTools.map((group, index) => (
        <tr key={index}>
          <td>{group.name}</td>
          <td>{group.category}</td>
          <td>{group.initialCondition}</td>
          <td>{group.loanFee}</td>
          <td>{group.penaltyForDelay}</td>
          <td>{group.replacementValue}</td>
          <td>{group.damageValue}</td>
          <td>{group.stock}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default GroupedToolTable;
