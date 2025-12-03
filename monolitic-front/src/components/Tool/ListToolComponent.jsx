import React, { useEffect, useState } from "react";
import { filterTool, updateStatusTool, underRepairTool, deleteTool, gruopTools } from "../../services/ToolService";
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from "@react-keycloak/web";
import ToolTable from "./ToolTable";
import GroupedToolTable from "./GroupToolTable";
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  Box,
  Pagination,
  Stack,
  TableContainer
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

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
        await deleteTool(dto);
      }
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

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const totalPages = Math.ceil(tools.length / itemsPerPage);
  const currentTools = tools.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>
        List of Tools
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<GroupWorkIcon />}
            onClick={handleGroupToolsToggle}
            sx={{ mr: 2 }}
          >
            {showGrouped ? "Show All Tools" : "Group Tools"}
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={addNewTool}
          >
            Add Tool
          </Button>
        </Box>

        {!showGrouped && (
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid>
                <TextField
                  label="Name"
                  variant="outlined"
                  size="small"
                  value={filters.nameTool}
                  onChange={(e) => setFilters({ ...filters, nameTool: e.target.value })}
                />
              </Grid>
              <Grid>
                <TextField
                  label="Category"
                  variant="outlined"
                  size="small"
                  value={filters.categoryTool}
                  onChange={(e) => setFilters({ ...filters, categoryTool: e.target.value })}
                />
              </Grid>
              <Grid>
                <TextField
                  label="Fee"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={filters.feeTool}
                  onChange={(e) => setFilters({ ...filters, feeTool: e.target.value })}
                />
              </Grid>
              <Grid>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<RestartAltIcon />}
                  onClick={handleClear}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          {showGrouped ? (
            <GroupedToolTable groupedTools={groupedTools} />
          ) : (
            <ToolTable
              tools={currentTools}
              onStatusChange={handleStatusChange}
              onLoan={navigateToLoan}
              onUpdate={navigateToUpdateTool}
            />
          )}
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

export default ListToolComponent;
