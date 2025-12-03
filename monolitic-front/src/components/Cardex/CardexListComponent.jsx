import React, { useState, useEffect } from "react";
import { listForTime } from "../../services/CardexService";
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Pagination,
  Stack,
  Grid,
  TextField
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export const CardexListComponent = () => {
  const [cardexList, setCardexList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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

    // Dates are already strings in YYYY-MM-DD format from input type="date"
    const formattedStart = startDate || null;
    const formattedEnd = endDate || null;

    await loadAllCardex(formattedStart, formattedEnd, parsedToolId);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setToolId("");
    loadAllCardex(null, null, null);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const totalPages = Math.ceil(cardexList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCardex = cardexList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>
        Kardex
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <form onSubmit={handleFilter}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                label="Tool ID"
                type="number"
                variant="outlined"
                value={toolId}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || (Number(val) >= 0 && !val.includes("-"))) {
                    setToolId(val);
                  }
                }}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Box display="flex" gap={1}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<FilterListIcon />}
                >
                  Filter
                </Button>
                <Button
                  fullWidth
                  type="button"
                  variant="outlined"
                  color="secondary"
                  startIcon={<RestartAltIcon />}
                  onClick={handleClear}
                >
                  Reset
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader aria-label="cardex table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Date Move</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Type Move</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Email User</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ID Tool</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ID Loan</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Client Rut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentCardex.map((entry) => (
                <TableRow key={entry.id} hover>
                  <TableCell>{entry.id}</TableCell>
                  <TableCell>{entry.moveDate}</TableCell>
                  <TableCell>{entry.typeMove}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>{entry.quantity}</TableCell>
                  <TableCell>{entry.amount}</TableCell>
                  <TableCell>{entry.userEmail}</TableCell>
                  <TableCell>{entry.toolId}</TableCell>
                  <TableCell>{entry.loanId}</TableCell>
                  <TableCell>{entry.clientRut}</TableCell>
                </TableRow>
              ))}
              {currentCardex.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center">No records found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="center" p={3}>
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default CardexListComponent;
