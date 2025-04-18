import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const MoleculeInput = ({ onSubmit, disabled }) => {
  const [smiles, setSmiles] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (smiles.trim()) {
      onSubmit(smiles.trim());
      setSmiles('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2 }}>
      <TextField
        fullWidth
        label="SMILES String"
        value={smiles}
        onChange={(e) => setSmiles(e.target.value)}
        disabled={disabled}
        placeholder="Enter SMILES notation (e.g., CC(=O)OC1=CC=CC=C1C(=O)O)"
      />
      <Button
        type="submit"
        variant="contained"
        disabled={disabled || !smiles.trim()}
      >
        Submit
      </Button>
    </Box>
  );
};

export default MoleculeInput;
