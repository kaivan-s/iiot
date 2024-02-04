import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyForm from './form.js'; // Adjust the path as necessary
import Dashboard from './Dashboard'; // Adjust the path as necessary
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar style={{backgroundColor:"#7851a9"}}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            IIOT Demo
          </Typography>
          <Box sx={{ marginRight: 2 }}>
            <Button
              component="a"
              href="/"
              style={{ background: 'transparent', color: 'inherit' }}
            >
              Form
            </Button>
          </Box>
          <Box sx={{ marginRight: 2 }}>
            <Button
              component="a"
              href="/dashboard"
              style={{ background: 'transparent', color: 'inherit' }}
            >
              Dashboard
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route exact path="/" element={<MyForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;