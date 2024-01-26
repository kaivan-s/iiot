import React from 'react';
import MyForm from './form.js'; // Make sure the path is correct based on your file structure
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container component="main" maxWidth="sm">
        <MyForm />
      </Container>
      <h1></h1>
    </React.Fragment>
  );
}

export default App;
