import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material';
import { createTheme, alpha, getContrastRatio, ThemeProvider } from '@mui/material/styles';

const violetBase = '#7851a9';

const theme = createTheme({
    palette: {
      violet: {
        main: violetBase,
        light: alpha(violetBase, 0.5),
        dark: alpha(violetBase, 0.9),
        contrastText: getContrastRatio(violetBase, '#fff') > 4.5 ? '#fff' : '#111',
      },
    },
});

const MyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    verified:'no'
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sheetBestUrl = 'https://sheet.best/api/sheets/4a7ec22a-1314-44b3-86c0-928595c33fc4'; // Replace with your Sheet.Best URL

    try {
      const response = await fetch(sheetBestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([formData]), // Sheet.Best expects an array of objects
      });

      if (response.ok) {
        console.log('Form submitted successfully');
        setShowSuccessMessage(true);
        setFormData({
            name: '',
            email: '',
            mobile: '',
        });
        // Optionally, reset the success message after a few seconds
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        console.error('Error submitting form');
        // Handle failure (e.g., show error message)
      }
    } catch (error) {
      console.error('Network error:', error);
      // Handle network error
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Contact Form
          </Typography>
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              name="name"
              label="Name"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              name="email"
              label="Email Address"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              name="mobile"
              label="Mobile Number"
              fullWidth
              margin="normal"
              value={formData.mobile}
              onChange={handleChange}
            />
            {showSuccessMessage && (
              <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
                Form submitted successfully!
              </Alert>
            )}
            <Button 
              type="submit" 
              variant="contained" 
              color="violet" 
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default MyForm;
