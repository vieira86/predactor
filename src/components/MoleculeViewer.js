import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const MoleculeViewer = ({ smiles }) => {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Carrega o 3Dmol.js dinamicamente
    const script = document.createElement('script');
    script.src = 'https://3Dmol.org/build/3Dmol-min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.$3Dmol && smiles) {
        initViewer();
      }
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (window.$3Dmol && smiles) {
      initViewer();
    }
  }, [smiles]);

  const initViewer = async () => {
    if (!containerRef.current || !smiles) return;

    try {
      // Limpa o container
      containerRef.current.innerHTML = '';

      // Cria um div específico para o 3Dmol
      const viewerDiv = document.createElement('div');
      viewerDiv.style.width = '100%';
      viewerDiv.style.height = '400px';
      viewerDiv.style.position = 'relative';
      containerRef.current.appendChild(viewerDiv);

      // Inicializa o viewer
      const viewer = window.$3Dmol.createViewer(viewerDiv, {
        backgroundColor: 'white'
      });
      viewerRef.current = viewer;

      // Usa a API do NCI para converter SMILES para SDF
      const url = `https://cactus.nci.nih.gov/chemical/structure/${encodeURIComponent(smiles)}/sdf?get3d=true`;
      const response = await fetch(url);
      const sdfData = await response.text();

      if (sdfData) {
        viewer.addModel(sdfData, "sdf");
        viewer.setStyle({}, { stick: {} });
        viewer.zoomTo();
        viewer.render();
      }
    } catch (error) {
      console.error('Error initializing viewer:', error);
      // Tenta mostrar uma visualização 2D como fallback
      const img = document.createElement('img');
      img.src = `https://cactus.nci.nih.gov/chemical/structure/${encodeURIComponent(smiles)}/image`;
      img.style.maxWidth = '100%';
      img.style.maxHeight = '400px';
      img.style.display = 'block';
      img.style.margin = '0 auto';
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(img);
    }
  };

  return (
    <Box 
      ref={containerRef}
      sx={{
        width: '100%',
        height: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& > div': {
          width: '100% !important',
          height: '100% !important'
        }
      }}
    />
  );
};

export default MoleculeViewer;
