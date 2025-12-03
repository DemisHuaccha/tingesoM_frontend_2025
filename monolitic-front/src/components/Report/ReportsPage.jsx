import React, { useState, useEffect } from 'react';
import ReportService from '../../services/ReportService';
import {
    Container,
    Grid,
    Paper,
    Typography,
    TextField,
    Button,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Box,
    Avatar,
    Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ConstructionIcon from '@mui/icons-material/Construction';
import PersonIcon from '@mui/icons-material/Person';
import './ReportsPage.css';

const ReportsPage = () => {
    const [activeTab, setActiveTab] = useState(0); // Tabs use index by default
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loanId, setLoanId] = useState('');

    const [mainData, setMainData] = useState([]);
    const [rankingData, setRankingData] = useState([]);

    const [loadingMain, setLoadingMain] = useState(false);
    const [loadingRanking, setLoadingRanking] = useState(false);

    const tabMap = {
        0: 'activeLoans',
        1: 'overdueLoans',
        2: 'overdueClients'
    };

    const fetchMainData = () => {
        setLoadingMain(true);
        let request;
        const currentTabName = tabMap[activeTab];

        switch (currentTabName) {
            case 'activeLoans':
                request = ReportService.getActiveLoans(startDate, endDate);
                break;
            case 'overdueLoans':
                request = ReportService.getOverdueLoans(startDate, endDate);
                break;
            case 'overdueClients':
                request = ReportService.getClientsWithOverdueLoans(startDate, endDate);
                break;
            default:
                request = ReportService.getActiveLoans(startDate, endDate);
        }

        request.then(response => {
            setMainData(response.data);
            setLoadingMain(false);
        }).catch(error => {
            console.error("Error fetching report data", error);
            setLoadingMain(false);
        });
    };

    const fetchRankingData = () => {
        setLoadingRanking(true);
        ReportService.getToolRanking(startDate, endDate)
            .then(response => {
                // Limit to top 5
                setRankingData(response.data.slice(0, 5));
                setLoadingRanking(false);
            })
            .catch(error => {
                console.error("Error fetching ranking data", error);
                setLoadingRanking(false);
            });
    };

    useEffect(() => {
        fetchMainData();
    }, [activeTab]);

    useEffect(() => {
        fetchRankingData();
    }, []);

    const handleFilter = (e) => {
        e.preventDefault();
        fetchMainData();
        fetchRankingData();
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Filter logic for Loan ID
    const filteredData = mainData.filter(item => {
        if (!loanId) return true;
        if (item.loanId) {
            return item.loanId.toString().includes(loanId);
        }
        return true;
    });

    return (
        <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>
                Reports
            </Typography>

            <Grid container spacing={3}>
                {/* Main Content Column */}
                <Grid size={{ xs: 12, md: 8 }}>
                    {/* Filter Section */}
                    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                        <form onSubmit={handleFilter}>
                            <Grid container spacing={2} alignItems="flex-end">
                                <Grid size={{ xs: 12, sm: 3 }}>
                                    <TextField
                                        fullWidth
                                        label="Loan ID"
                                        variant="outlined"
                                        value={loanId}
                                        onChange={(e) => setLoanId(e.target.value)}
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
                                    <Button
                                        fullWidth
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        startIcon={<SearchIcon />}
                                        sx={{ height: '40px' }}
                                    >
                                        Filter
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>

                    {/* Tabs and Table */}
                    <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={activeTab} onChange={handleTabChange} aria-label="report tabs" variant="fullWidth">
                                <Tab label="Active Loans" />
                                <Tab label="Overdue Loans" />
                                <Tab label="Overdue Clients" />
                            </Tabs>
                        </Box>

                        <TableContainer sx={{ maxHeight: 600 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {activeTab !== 2 ? (
                                            <>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Loan ID</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Client RUT</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Tool</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Delivery</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Return</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Status</TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>RUT</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Name</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Phone</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Email</TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loadingMain ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">Loading...</TableCell>
                                        </TableRow>
                                    ) : filteredData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">No data found</TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredData.map((item, index) => (
                                            <TableRow key={index} hover>
                                                {activeTab !== 2 ? (
                                                    <>
                                                        <TableCell>{item.loanId}</TableCell>
                                                        <TableCell>{item.client?.rut}</TableCell>
                                                        <TableCell>{item.tool?.nameTool}</TableCell>
                                                        <TableCell>{item.deliveryDate}</TableCell>
                                                        <TableCell>{item.returnDate}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={item.loanStatus ? 'Active' : 'Closed'}
                                                                color={item.loanStatus ? 'success' : 'default'}
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        </TableCell>
                                                    </>
                                                ) : (
                                                    <>
                                                        <TableCell>{item.rut}</TableCell>
                                                        <TableCell>{item.firstName} {item.lastName}</TableCell>
                                                        <TableCell>{item.phone}</TableCell>
                                                        <TableCell>{item.email}</TableCell>
                                                    </>
                                                )}
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* Ranking Column */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card elevation={4} sx={{ borderRadius: 2 }}>
                        <CardHeader
                            title="Top 5 Tools"
                            subheader="Most requested items"
                            titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                            sx={{
                                backgroundColor: '#2e7d32',
                                color: 'white',
                                '& .MuiCardHeader-subheader': { color: '#e8f5e9' }
                            }}
                        />
                        <CardContent sx={{ p: 0 }}>
                            {loadingRanking ? (
                                <Box p={2} textAlign="center">Loading...</Box>
                            ) : (
                                <Box>
                                    {rankingData.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: index === 0 ? '#ffb300' : index === 1 ? '#e0e0e0' : index === 2 ? '#cd7f32' : '#f5f5f5',
                                                        color: index > 2 ? '#757575' : 'white',
                                                        width: 40,
                                                        height: 40,
                                                        mr: 2,
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {index + 1}
                                                </Avatar>
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {item.nameTool}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <ConstructionIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {item.categoryTool}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Chip
                                                    label={`${item.quantityTool} Loans`}
                                                    color="primary"
                                                    size="small"
                                                />
                                            </Box>
                                            {index < rankingData.length - 1 && <Divider variant="inset" component="li" sx={{ listStyle: 'none' }} />}
                                        </React.Fragment>
                                    ))}
                                    {rankingData.length === 0 && (
                                        <Box p={3} textAlign="center" color="text.secondary">
                                            No ranking data available
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ReportsPage;
