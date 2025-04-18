import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

const MoleculeEditor = ({ onMoleculeChange, disabled }) => {
  const [smiles, setSmiles] = useState('');

  const handleSubmit = () => {
    if (smiles && smiles.trim() !== '') {
      onMoleculeChange(smiles.trim());
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <TextField
        fullWidth
        label="SMILES"
        variant="outlined"
        value={smiles}
        onChange={(e) => setSmiles(e.target.value)}
        disabled={disabled}
        placeholder="Enter SMILES notation"
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={disabled || !smiles.trim()}
        fullWidth
      >
        Submit Structure
      </Button>
    </Box>
  );
};

export default MoleculeEditor;
