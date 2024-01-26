import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';

const MyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
  });

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
        setFormData({
            name: '',
            email: '',
            mobile: '',
          });
        // Handle success (e.g., clear form, show message)
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
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default MyForm;
