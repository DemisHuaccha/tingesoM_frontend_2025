import React, { useEffect, useState } from 'react';
import { rankingTools } from '../../services/ToolService';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Box,
  LinearProgress,
  Avatar,
  Chip
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ConstructionIcon from '@mui/icons-material/Construction';

const RankingComponent = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    rankingTools()
      .then(response => {
        // Sort by quantity descending by default
        const sortedData = (response.data || []).sort((a, b) => b.quantityTool - a.quantityTool);
        setTools(sortedData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error loading ranking data.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // Limit ranking to top 5 tools
  const limitedTools = tools.slice(0, 5);
  const topThree = limitedTools.slice(0, 3);
  const maxLoans = limitedTools.length > 0 ? limitedTools[0].quantityTool : 1;

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 4 }}>
        <EmojiEventsIcon sx={{ fontSize: 40, verticalAlign: 'middle', mr: 2, color: '#ffb300' }} />
        Tool Ranking
      </Typography>

      {/* Top 3 Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }} justifyContent="center" alignItems="flex-end">
        {/* 3rd Place (Left) */}
        {topThree[2] && (
          <Grid size={{ xs: 12, sm: 4 }} key={topThree[2].nameTool}>
            <Card
              elevation={4}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transform: 'scale(0.95)',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(0.98)' }
              }}
            >
              <CardContent>
                <Avatar
                  sx={{
                    bgcolor: '#cd7f32',
                    width: 50,
                    height: 50,
                    mb: 2,
                    mx: 'auto'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>#3</Typography>
                </Avatar>
                <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {topThree[2].nameTool}
                </Typography>
                <Chip icon={<ConstructionIcon />} label={topThree[2].categoryTool} color="primary" variant="outlined" sx={{ mb: 2 }} />
                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                  {topThree[2].quantityTool}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Loans
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* 1st Place (Center) */}
        {topThree[0] && (
          <Grid size={{ xs: 12, sm: 4 }} key={topThree[0].nameTool}>
            <Card
              elevation={8}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                border: '2px solid #ffb300',
                transform: 'scale(1.1)',
                zIndex: 2,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.13)' }
              }}
            >
              <CardContent>
                <Avatar
                  sx={{
                    bgcolor: '#ffb300',
                    width: 70,
                    height: 70,
                    mb: 2,
                    mx: 'auto'
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>#1</Typography>
                </Avatar>
                <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {topThree[0].nameTool}
                </Typography>
                <Chip icon={<ConstructionIcon />} label={topThree[0].categoryTool} color="primary" variant="outlined" sx={{ mb: 2 }} />
                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                  {topThree[0].quantityTool}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Loans
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* 2nd Place (Right) */}
        {topThree[1] && (
          <Grid size={{ xs: 12, sm: 4 }} key={topThree[1].nameTool}>
            <Card
              elevation={4}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transform: 'scale(1)',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.03)' }
              }}
            >
              <CardContent>
                <Avatar
                  sx={{
                    bgcolor: '#e0e0e0',
                    width: 60,
                    height: 60,
                    mb: 2,
                    mx: 'auto'
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#fff' }}>#2</Typography>
                </Avatar>
                <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {topThree[1].nameTool}
                </Typography>
                <Chip icon={<ConstructionIcon />} label={topThree[1].categoryTool} color="primary" variant="outlined" sx={{ mb: 2 }} />
                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                  {topThree[1].quantityTool}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Loans
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Full Ranking Table */}
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        Top 5 List
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="ranking table">
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tool Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Loan Fee</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Total Loans</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} width="30%">Popularity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {limitedTools.map((tool, index) => (
              <TableRow
                key={tool.nameTool}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#f9f9f9' } }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: index < 3 ? '#ffb300' : 'text.primary' }}>
                    #{index + 1}
                  </Typography>
                </TableCell>
                <TableCell>{tool.nameTool}</TableCell>
                <TableCell>
                  <Chip label={tool.categoryTool} size="small" />
                </TableCell>
                <TableCell>${tool.feeTool}</TableCell>
                <TableCell align="center">
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    {tool.quantityTool}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(tool.quantityTool / maxLoans) * 100}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          bgcolor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: index < 3 ? '#ffb300' : '#1976d2'
                          }
                        }}
                      />
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default RankingComponent;