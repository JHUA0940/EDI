import React, { useState } from 'react';
import { Box, Paper, Tabs, Tab } from '@mui/material';
import CargoForm from './CargoForm';
import EDIDecoder from './EDIDecoder';

/**
 * Main component for handling EDI message generation and decoding
 * Manages tab switching and maintains separate states for generate and decode functionalities
 */
const EDIMessageHandler = () => {
  // Tab state management
  const [activeTab, setActiveTab] = useState('generate');

  // Cargo form states
  const [cargoItems, setCargoItems] = useState([{
    cargo_type: 'FCL',
    number_of_packages: '',
    container_number: '',
    master_bill_of_lading_number: '',
    house_bill_of_lading_number: '',
  }]);

  // Separate states for generate and decode EDI messages
  const [generatedEdiMessage, setGeneratedEdiMessage] = useState('');
  const [decoderEdiMessage, setDecoderEdiMessage] = useState('');
  const [decodedItems, setDecodedItems] = useState([]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Common styles for components
  const tabStyles = {
    '& .MuiTabs-indicator': {
      display: 'none',
    },
    '& .MuiTab-root': {
      minHeight: '40px',
      borderRadius: 2,
      mx: 0.5,
      color: 'text.secondary',
      '&.Mui-selected': {
        color: 'text.primary',
        bgcolor: 'background.paper',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      },
    },
  };

  return (
    <Box>
      {/* Tab navigation */}
      <Paper 
        sx={{ 
          mb: 3,
          p: 0.5,
          bgcolor: 'background.default',
          boxShadow: 'none',
          borderRadius: 3,
          display: 'inline-flex',
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={tabStyles}
        >
          <Tab
            label="Generate EDI"
            value="generate"
            disableRipple
          />
          <Tab
            label="Decode EDI"
            value="decode"
            disableRipple
          />
        </Tabs>
      </Paper>

      {/* Content container */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {activeTab === 'generate' ? (
          <CargoForm 
            cargoItems={cargoItems}
            setCargoItems={setCargoItems}
            ediMessage={generatedEdiMessage}
            setEdiMessage={setGeneratedEdiMessage}
          />
        ) : (
          <EDIDecoder 
            ediMessage={decoderEdiMessage}
            setEdiMessage={setDecoderEdiMessage}
            decodedItems={decodedItems}
            setDecodedItems={setDecodedItems}
          />
        )}
      </Paper>
    </Box>
  );
};

export default EDIMessageHandler; 