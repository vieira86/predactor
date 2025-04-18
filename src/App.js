import React, { useState } from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import MoleculeEditor from './components/MoleculeEditor';
import MoleculeViewer from './components/MoleculeViewer';
import PredictionResult from './components/PredictionResult';

function App() {
  const [smiles, setSmiles] = useState('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [pdbContent, setPdbContent] = useState(null);

  const handleMoleculeChange = async (newSmiles) => {
    setSmiles(newSmiles);
    setLoading(true);
    setError(null);
    setPrediction(null);
    setPdbContent(null);

    try {
      console.log('Sending request with SMILES:', newSmiles);
      const response = await fetch('https://predactor.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ smiles: newSmiles })
      });

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to get prediction: ${responseText}`);
      }

      const data = JSON.parse(responseText);
      console.log('Parsed response:', data);

      setPrediction({
        value: data.prediction,
        isActive: data.is_active
      });
      setPdbContent(data.pdb_content);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        <img src="/logo192.png" alt="Predactors Logo" style={{ width: '100px', marginRight: '10px' }} />
          Predactors Platform
        </Typography>

        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
           Predicting Activity in Organic Samples
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom align="center">
            Molecule Input
          </Typography>
          <MoleculeEditor onMoleculeChange={handleMoleculeChange} disabled={loading} />
        </Paper>

        {smiles && (
          <>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3,
                width: '100%',
                mb: 4
              }}
            >
              <Typography variant="h6" gutterBottom align="center" sx={{ mb: 3 }}>
                Molecule Visualization
              </Typography>
              <Box sx={{ 
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <MoleculeViewer smiles={smiles} />
              </Box>
            </Paper>

            <Paper elevation={3}>
              <PredictionResult 
                prediction={prediction}
                loading={loading}
                error={error}
                pdbContent={pdbContent}
              />
            </Paper>
          </>
        )}
      </Box>
    </Container>
  );
}

export default App;
