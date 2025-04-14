import React, { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Box
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

/**
 * A reusable text field component with copy functionality
 * Supports both read-only and editable modes
 */
const CopyableTextField = ({ 
  value, 
  rows = 10, 
  multiline = true, 
  readOnly = true,
  onChange,
  label,
  error,
  helperText,
  ...props 
}) => {
  const [copied, setCopied] = useState(false);

  // Handle copy to clipboard with fallback for HTTP
  const handleCopy = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(value || '').then(() => {
        setCopied(true);
      }).catch((err) => {
        console.error('Clipboard copy failed:', err);
      });
    } else {
      // Fallback method
      const textarea = document.createElement('textarea');
      textarea.value = value || '';
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
      } catch (err) {
        console.error('Fallback: Copy command failed', err);
      }
      document.body.removeChild(textarea);
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        fullWidth
        multiline={multiline}
        rows={rows}
        value={value}
        variant="outlined"
        onChange={onChange}
        label={label}
        error={error}
        helperText={helperText}
        InputProps={{
          readOnly: readOnly,
          sx: { fontFamily: 'monospace', bgcolor: 'background.paper' },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleCopy}
                sx={{
                  position: 'absolute',
                  right: 8,
                  bottom: 8,
                  zIndex: 1,
                  backgroundColor: 'background.paper',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ContentCopyIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...props}
      />

      {/* Copy success notification */}
      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ position: 'absolute', top: 0, left: 0, right: 0 }}
      >
        <Alert
          severity="success"
          sx={{ width: '100%' }}
          icon={false}
        >
          Text copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CopyableTextField;
