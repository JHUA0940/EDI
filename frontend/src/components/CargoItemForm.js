import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Grid,
  IconButton
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

/**
 * Component for rendering single cargo item form
 * Handles input fields for cargo details and validation display
 */
const CargoItemForm = ({ 
  item, 
  index, 
  validationErrors, 
  errorRefs,
  handleInputChange,
  removeCargoItem,
  isRemovable
}) => {
  // Common styles
  const labelStyles = {
    fontWeight: 600,
    background: 'linear-gradient(45deg, #1A3A8F 0%, #0D2B7A 50%, #001C65 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  return (
    <Box sx={{ 
      mb: 3, 
      position: 'relative', 
      border: '1px solid', 
      borderColor: 'divider', 
      borderRadius: 2, 
      p: 3, 
      pt: 5 
    }}>
      {/* Item number label */}
      <Box sx={{ 
        position: 'absolute', 
        top: -12, 
        left: 16, 
        px: 1, 
        backgroundColor: 'background.paper' 
      }}>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          Cargo Item #{index + 1}
        </Typography>
      </Box>

      {/* Remove button */}
      {isRemovable && (
        <Box sx={{ 
          position: 'absolute', 
          top: -12, 
          right: 12, 
          px: 1, 
          backgroundColor: 'background.paper' 
        }}>
          <IconButton 
            onClick={() => removeCargoItem(index)} 
            size="small" 
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'error.main' },
            }}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Box>
      )}

      {/* Form fields */}
      <Grid container spacing={2}>
        {/* Cargo Type */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            fullWidth
            required
            label="Cargo Type"
            inputRef={(el) => errorRefs.current[`cargo_type_${index}`] = el}
            value={item.cargo_type}
            onChange={(e) => handleInputChange(index, 'cargo_type', e.target.value)}
            error={!!validationErrors[`cargo_type_${index}`]}
            helperText={validationErrors[`cargo_type_${index}`]}
          >
            <MenuItem value="FCL">FCL</MenuItem>
            <MenuItem value="LCL">LCL</MenuItem>
            <MenuItem value="FCX">FCX</MenuItem>
          </TextField>
        </Grid>

        {/* Number of Packages */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            required
            type="number"
            label="Number of Packages"
            inputRef={(el) => errorRefs.current[`number_of_packages_${index}`] = el}
            value={item.number_of_packages}
            onChange={(e) => handleInputChange(index, 'number_of_packages', e.target.value)}
            error={!!validationErrors[`number_of_packages_${index}`]}
            helperText={validationErrors[`number_of_packages_${index}`]}
            inputProps={{ min: "1" }}
          />
        </Grid>

        {/* Container Number */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Container Number"
            value={item.container_number}
            onChange={(e) => handleInputChange(index, 'container_number', e.target.value)}
          />
        </Grid>

        {/* Master Bill of Lading */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Master Bill of Lading"
            value={item.master_bill_of_lading_number}
            onChange={(e) => handleInputChange(index, 'master_bill_of_lading_number', e.target.value)}
          />
        </Grid>

        {/* House Bill of Lading */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="House Bill of Lading"
            value={item.house_bill_of_lading_number}
            onChange={(e) => handleInputChange(index, 'house_bill_of_lading_number', e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CargoItemForm; 