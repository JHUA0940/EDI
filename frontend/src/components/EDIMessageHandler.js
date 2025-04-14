import React, { useState } from 'react';
import { Box, Paper, Tabs, Tab } from '@mui/material';
import CargoForm from './CargoForm';
import EDIDecoder from './EDIDecoder';

const EDIMessageHandler = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [cargoItems, setCargoItems] = useState([{
    cargo_type: 'FCL',
    number_of_packages: '',
    container_number: '',
    master_bill_of_lading_number: '',
    house_bill_of_lading_number: '',
  }]);
  const [generatedEdiMessage, setGeneratedEdiMessage] = useState('');
  const [decoderEdiMessage, setDecoderEdiMessage] = useState('');
  const [decodedItems, setDecodedItems] = useState([]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
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
          sx={{
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
          }}
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