import { useEffect, useState } from 'react';
import { rankingTools } from '../../services/ToolService';

export const RankingComponent = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    rankingTools()
      .then(response => {
        setTools(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error in load of ranking');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading ranking...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2> Ranking Tools</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={th}>Name</th>
            <th style={th}>Category</th>
            <th style={th}>Fee</th>
            <th style={th}>Stock </th>
          </tr>
        </thead>
        <tbody>
          {tools.map((tool, index) => (
            <tr key={`${tool.nameTool}-${index}`} style={{ textAlign: 'center' }}>
              <td style={td}>{tool.nameTool}</td>
              <td style={td}>{tool.categoryTool}</td>
              <td style={td}>${tool.feeTool}</td>
              <td style={td}>{tool.quantityTool}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  padding: '0.5rem',
  borderBottom: '2px solid #ccc',
};

const td = {
  padding: '0.5rem',
  borderBottom: '1px solid #eee',
};

export default RankingComponent;