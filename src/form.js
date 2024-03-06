import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material';
import { createTheme, alpha, getContrastRatio, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.mobile) {
      alert("All fields are required.");
      return;
    }

    const sheetBestUrl = 'https://sheet.best/api/sheets/64f72e8e-7274-4c35-8808-03e162da0162';

    try {
      const response = await fetch(sheetBestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([formData]),
      });

      if (response.ok) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          navigate('/dashboard');
        }, 3000);
      } else {
        console.error('Error submitting form');
      }
    } catch (error) {
      console.error('Network error:', error);
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
              required
            />
            <TextField
              name="email"
              label="Email Address"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              name="mobile"
              label="Mobile Number"
              fullWidth
              margin="normal"
              value={formData.mobile}
              onChange={handleChange}
              required
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
