import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import { validateEDIMessage } from '../utils/ediValidator';
import CopyableTextField from './shared/CopyableTextField';

const EDIDecoder = ({ ediMessage, setEdiMessage, decodedItems, setDecodedItems }) => {
  const [alert, setAlert] = useState({ message: '', severity: '', show: false });
  const [success, setSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const decodedJsonRef = useRef(null);

  const handleEDIMessageChange = (e) => {
    const newMessage = e.target.value;
    setEdiMessage(newMessage);

    if (newMessage.trim()) {
      const error = validateEDIMessage(newMessage);
      setValidationError(error);
    } else {
      setValidationError('');
    }
  };

  const decodeEDI = async () => {
    const validationError = validateEDIMessage(ediMessage);
    if (validationError) {
      setAlert({ message: validationError, severity: 'error', show: true });
      setDecodedItems([]);
      return;
    }

    try {
      setAlert({ ...alert, show: false });
      setValidationError('');
      setSuccess(false);

      const response = await fetch('/api/edi/decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: ediMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to decode EDI message');
      }

      const data = await response.json();
      setDecodedItems(data.items || []);
      setSuccess(true);
      setTimeout(() => {
        decodedJsonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error('Error decoding EDI:', error);
      setDecodedItems([]);
      setSuccess(false);
      setAlert({
        message: 'Error decoding EDI message. Please check your input and try again.',
        severity: 'error',
        show: true
      });
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
  };

  return (
    <Box>
      {alert.show && (
        <Alert 
          severity={alert.severity} 
          onClose={() => setAlert({ ...alert, show: false })} 
          sx={{ mb: 2 }}
        >
          {alert.message}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h5" sx={{
          fontWeight: 600, mb: 3,
          background: 'linear-gradient(45deg, #1A3A8F 0%, #0D2B7A 50%, #001C65 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Decode EDI Message
        </Typography>

        <TextField
          fullWidth multiline rows={10}
          label="Paste EDI Message Here"
          value={ediMessage}
          onChange={handleEDIMessageChange}
          error={!!validationError}
          helperText={validationError}
          sx={{ mb: 2, '& .MuiInputBase-root': { fontFamily: 'monospace', bgcolor: 'background.paper' } }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={decodeEDI}
            disabled={!!validationError}
            sx={{ borderRadius: 2 }}
          >
            Decode EDI
          </Button>
        </Box>
      </Paper>

      {decodedItems.length > 0 && (
        <>
          <Paper ref={decodedJsonRef} elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{
                fontWeight: 600,
                background: 'linear-gradient(45deg, #1A3A8F 0%, #0D2B7A 50%, #001C65 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Decoded JSON
              </Typography>
              {success && (
                <Alert severity="success" sx={{ py: 0.5, px: 2, fontSize: 14 }} icon={false}>
                  EDI message decoded successfully!
                </Alert>
              )}
            </Box>
            <CopyableTextField
              value={JSON.stringify(decodedItems, null, 2)}
              rows={10}
            />
          </Paper>

          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h5" sx={{
              fontWeight: 600, mb: 3,
              background: 'linear-gradient(45deg, #1A3A8F 0%, #0D2B7A 50%, #001C65 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Decoded Cargo Items
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Cargo Type</TableCell>
                    <TableCell>Number of Packages</TableCell>
                    <TableCell>Container Number</TableCell>
                    <TableCell>Master Bill of Lading</TableCell>
                    <TableCell>House Bill of Lading</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {decodedItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>#{index + 1}</TableCell>
                      <TableCell>{item.cargo_type}</TableCell>
                      <TableCell>{item.number_of_packages}</TableCell>
                      <TableCell>{item.container_number || '-'}</TableCell>
                      <TableCell>{item.master_bill_of_lading_number || '-'}</TableCell>
                      <TableCell>{item.house_bill_of_lading_number || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}

      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ position: 'absolute', top: 0, left: 0, right: 0 }}
      >
        <Alert severity="success" sx={{ width: '100%' }} icon={false}>
          Text copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EDIDecoder;
