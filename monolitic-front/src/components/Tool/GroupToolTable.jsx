import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';

const GroupedToolTable = ({ groupedTools }) => (
  <Table aria-label="grouped tool table">
    <TableHead>
      <TableRow>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Name</TableCell>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Category</TableCell>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Condition</TableCell>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Loan Fee</TableCell>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Penalty</TableCell>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Replacement Value</TableCell>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Damage Value</TableCell>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Stock</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {groupedTools.map((group, index) => (
        <TableRow key={index} hover>
          <TableCell>{group.name}</TableCell>
          <TableCell>{group.category}</TableCell>
          <TableCell>{group.initialCondition}</TableCell>
          <TableCell>{group.loanFee}</TableCell>
          <TableCell>{group.penaltyForDelay}</TableCell>
          <TableCell>{group.replacementValue}</TableCell>
          <TableCell>{group.damageValue}</TableCell>
          <TableCell>{group.stock}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default GroupedToolTable;
