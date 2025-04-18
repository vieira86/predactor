import React from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

function PredictionResult({ prediction, loading, error, pdbContent, onDownload }) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, color: 'error.main' }}>
        <Typography variant="body1">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!prediction) {
    return null;
  }

  const handleDownload = () => {
    if (!pdbContent) return;
    
    // Criar um blob com o conteúdo PDB
    const blob = new Blob([pdbContent], { type: 'chemical/x-pdb' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'molecule.pdb';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Prediction Result
      </Typography>
      <Typography variant="body1" paragraph>
        Label: {prediction.value.toFixed(2)}
      </Typography>
      <Typography variant="body1" paragraph>
        Status: {prediction.isActive ? 'Active' : 'Inactive'}
      </Typography>
      {pdbContent && (
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          sx={{ mt: 2 }}
        >
          Download PDB
        </Button>
      )}
    </Box>
  );
}

export default PredictionResult;
