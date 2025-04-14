import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CopyableTextField from './shared/CopyableTextField';
import CargoItemForm from './CargoItemForm';
import axios from 'axios';

const CargoForm = ({ cargoItems, setCargoItems, ediMessage, setEdiMessage }) => {
  const [alert, setAlert] = useState({ message: '', severity: '', show: false });
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const ediMessageRef = useRef(null);
  const errorRefs = useRef([]);

  const showAlert = (message, severity) => {
    setAlert({ message, severity, show: true });
  };

  const validateForm = () => {
    const errors = {};
    cargoItems.forEach((item, index) => {
      if (!item.cargo_type) {
        errors[`cargo_type_${index}`] = 'Cargo type is required';
      }
      if (!item.number_of_packages) {
        errors[`number_of_packages_${index}`] = 'Number of packages is required';
      } else if (parseInt(item.number_of_packages) <= 0) {
        errors[`number_of_packages_${index}`] = 'Number of packages must be greater than 0';
      }
    });
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      const firstErrorKey = Object.keys(errors)[0];
      const firstErrorRef = errorRefs.current[firstErrorKey];
      if (firstErrorRef?.scrollIntoView) {
        firstErrorRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorRef.focus?.();
      }
    }
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (index, field, value) => {
    const filteredValue = value.split('')
      .filter(char => {
        const charCode = char.charCodeAt(0);
        return charCode >= 32 && charCode <= 126 && charCode !== 91 && charCode !== 93;
      })
      .join('');

    const newCargoItems = [...cargoItems];
    newCargoItems[index][field] = filteredValue;
    setCargoItems(newCargoItems);
    setAlert({ ...alert, show: false });
  };

  const addCargoItem = () => {
    setCargoItems([
      ...cargoItems,
      {
        cargo_type: 'FCL',
        number_of_packages: '',
        container_number: '',
        master_bill_of_lading_number: '',
        house_bill_of_lading_number: '',
      },
    ]);
  };

  const removeCargoItem = (index) => {
    if (cargoItems.length > 1) {
      const newCargoItems = cargoItems.filter((_, i) => i !== index);
      setCargoItems(newCargoItems);
    }
  };

  const handleGenerateEDI = async () => {
    if (!validateForm()) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }

    try {
      setAlert({ ...alert, show: false });
      const response = await axios.post('http://3.25.202.61:8000/api/edi/generate', {
        items: cargoItems,
      });
      setEdiMessage(response.data.message);
      setGenerateSuccess(true);
      setTimeout(() => {
        ediMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error('Error generating EDI:', error);
      showAlert('Error generating EDI message. Please try again.', 'error');
      setGenerateSuccess(false);
    }
  };

  return (
    <Box>
      {alert.show && (
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, show: false })} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h5" sx={{
          fontWeight: 600, mb: 3,
          background: 'linear-gradient(45deg, #1A3A8F 0%, #0D2B7A 50%, #001C65 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Cargo Details
        </Typography>

        {cargoItems.map((item, index) => (
          <CargoItemForm
            key={index}
            item={item}
            index={index}
            validationErrors={validationErrors}
            errorRefs={errorRefs}
            handleInputChange={handleInputChange}
            removeCargoItem={removeCargoItem}
            isRemovable={cargoItems.length > 1}
          />
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, gap: 2 }}>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={addCargoItem} sx={{ borderRadius: 2 }}>
            Add Cargo Item
          </Button>
          <Button variant="contained" onClick={handleGenerateEDI} sx={{ borderRadius: 2 }}>
            Generate EDI
          </Button>
        </Box>
      </Paper>

      {ediMessage && (
        <Paper ref={ediMessageRef} elevation={0} sx={{ p: 3, mt: 3, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{
              fontWeight: 600,
              background: 'linear-gradient(45deg, #1A3A8F 0%, #0D2B7A 50%, #001C65 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Generated EDI Message
            </Typography>
            {generateSuccess && (
              <Alert severity="success" sx={{ py: 0.5, px: 2, fontSize: 14 }} icon={false}>
                EDI message generated successfully!
              </Alert>
            )}
          </Box>
          <CopyableTextField value={ediMessage} rows={10} />
        </Paper>
      )}
    </Box>
  );
};

export default CargoForm;
