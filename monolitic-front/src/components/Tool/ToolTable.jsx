import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Chip,
  Stack
} from '@mui/material';

const ToolTable = ({ tools, onStatusChange, onLoan, onUpdate }) => (
  <Table aria-label="tool table">
    <TableHead>
      <TableRow>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Actions</TableCell>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ID</TableCell>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Name</TableCell>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Category</TableCell>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Value</TableCell>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Damage</TableCell>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Fee</TableCell>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Penalty</TableCell>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Condition</TableCell>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Status</TableCell>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Repair</TableCell>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Delete</TableCell>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Manage</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {tools.map((tool) => (
        <TableRow key={tool.idTool} hover>
          <TableCell>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => onLoan(tool)}
              sx={{ minWidth: '100px' }}
            >
              Make Loan
            </Button>
          </TableCell>
          <TableCell>{tool.idTool}</TableCell>
          <TableCell>{tool.name}</TableCell>
          <TableCell>{tool.category}</TableCell>
          <TableCell>{tool.replacementValue}</TableCell>
          <TableCell>{tool.damageValue}</TableCell>
          <TableCell>{tool.loanFee}</TableCell>
          <TableCell>{tool.penaltyForDelay}</TableCell>
          <TableCell>{tool.initialCondition}</TableCell>
          <TableCell>
            <Chip
              label={tool.status ? "Available" : "Unavailable"}
              color={tool.status ? "success" : "default"}
              size="small"
            />
          </TableCell>
          <TableCell>
            <Chip
              label={tool.underRepair ? "In Repair" : "Available"}
              color={tool.underRepair ? "warning" : "success"}
              size="small"
            />
          </TableCell>
          <TableCell>
            <Chip
              label={tool.deleteStatus ? "Deleted" : "Available"}
              color={tool.deleteStatus ? "error" : "success"}
              size="small"
            />
          </TableCell>
          <TableCell>
            <Stack direction="column" spacing={1}>
              <Button variant="outlined" color="warning" size="small" onClick={() => onStatusChange(tool.idTool, "status", tool.status)}>Status</Button>
              <Button variant="outlined" color="info" size="small" onClick={() => onStatusChange(tool.idTool, "underRepair", tool.underRepair)}>Repair</Button>
              <Button variant="outlined" color="error" size="small" onClick={() => onStatusChange(tool.idTool, "deleteStatus", tool.deleteStatus)}>Delete</Button>
              <Button variant="contained" color="primary" size="small" onClick={() => onUpdate(tool)}>Update</Button>
            </Stack>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default ToolTable;
