import React, { useEffect, useState } from "react";
import { listLoan } from "../../services/LoanService";
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from "@react-keycloak/web";
import ReturnLoanOptions from "./ReturnLoanOptions";
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
  Chip,
  Box,
  Pagination,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export const ListLoanComponent = () => {
  const [loans, setLoans] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { keycloak } = useKeycloak();
  const userEmail = keycloak?.tokenParsed?.email;
  const navigator = useNavigate();

  useEffect(() => {
    loadLoans();
  }, []);

  function loadLoans() {
    listLoan()
      .then((response) => {
        setLoans(response.data);
        setCurrentPage(1);
      })
      .catch((error) => {
        console.error("Error al cargar préstamos:", error);
      });
  }

  function handleFinalizeClick(idLoan) {
    setSelectedLoanId(idLoan);
    setShowOptions(true);
  }

  const handleMakeLoan = () => {
    navigator('/add-Loan');
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const totalPages = Math.ceil(loans.length / itemsPerPage);
  const currentLoans = loans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>
        List of Loans
      </Typography>

      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleMakeLoan}
        >
          Make Loan
        </Button>
      </Box>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader aria-label="loans table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Loan ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Delivery Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Return Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Client RUT</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Tool ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Penalty</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Penalty Total</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Overall</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentLoans.map((loan) => (
                <TableRow key={loan.loanId} hover>
                  <TableCell>{loan.loanId}</TableCell>
                  <TableCell>{loan.deliveryDate}</TableCell>
                  <TableCell>{loan.returnDate}</TableCell>
                  <TableCell>{loan.clientRut}</TableCell>
                  <TableCell>{loan.toolId}</TableCell>
                  <TableCell>
                    <Chip
                      label={loan.loanStatus ? "Active" : "Finished"}
                      color={loan.loanStatus ? "success" : "default"}
                      size="small"
                      variant={loan.loanStatus ? "filled" : "outlined"}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={loan.penalty ? "Penalized" : "Free"}
                      color={loan.penalty ? "error" : "success"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{loan.penaltyTotal}</TableCell>
                  <TableCell>{loan.priceToPay}</TableCell>
                  <TableCell>
                    {loan.loanStatus && (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleFinalizeClick(loan.loanId)}
                      >
                        Finalize
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {currentLoans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center">No loans found</TableCell>
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

      {showOptions && (
        <ReturnLoanOptions
          loanId={selectedLoanId}
          userEmail={userEmail}
          onClose={() => setShowOptions(false)}
          onSuccess={loadLoans}
        />
      )}
    </Container>
  );
};

export default ListLoanComponent;
