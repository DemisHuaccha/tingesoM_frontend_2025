import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { listClients, updateStatusClient, getDelayedClients } from "../../services/ClientService";
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EditIcon from '@mui/icons-material/Edit';
import AutorenewIcon from '@mui/icons-material/Autorenew';

export const ListClientComponent = () => {
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDelayed, setShowDelayed] = useState(false);
  const itemsPerPage = 10;

  const navigator = useNavigate();

  useEffect(() => {
    loadClients()
  }, [showDelayed]);


  function addNewClient() {
    navigator('/add-Client')
  }

  function loadClients() {
    const service = showDelayed ? getDelayedClients : listClients;
    service()
      .then((response) => {
        setClients(response.data);
        setCurrentPage(1);
      })
      .catch((error) => {
        console.error("Error al cargar clientes:", error);
      });
  }

  function UpdateStatusClient(idClient) {
    updateStatusClient(idClient)
      .then((response) => {
        setClients(prev => prev.filter(client => client.idClient !== idClient));
        loadClients();
      })
      .catch((error) => {
        console.error('Error al actualizar status:', error);
      });

  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentClients = clients.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>
        {showDelayed ? "Delayed Clients" : "List of Clients"}
      </Typography>

      <Box display="flex" justifyContent="flex-end" mb={3} gap={2}>
        <Button
          variant="contained"
          color="info"
          startIcon={showDelayed ? <VisibilityOffIcon /> : <VisibilityIcon />}
          onClick={() => setShowDelayed(prev => !prev)}
        >
          {showDelayed ? "Show All Clients" : "Show Delayed Clients"}
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={addNewClient}
        >
          Add Client
        </Button>
      </Box>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader aria-label="clients table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>First Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Last Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>RUT</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentClients.map((client) => (
                <TableRow key={client.idClient} hover>
                  <TableCell>{client.idClient}</TableCell>
                  <TableCell>{client.firstName}</TableCell>
                  <TableCell>{client.lastName}</TableCell>
                  <TableCell>{client.rut}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={client.status ? "Allowed" : "Restricted"}
                      color={client.status ? "success" : "error"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => navigator(`/edit-Client/${client.idClient}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        startIcon={<AutorenewIcon />}
                        onClick={() => UpdateStatusClient(client.idClient)}
                      >
                        Status
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {currentClients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">No clients found</TableCell>
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

export default ListClientComponent