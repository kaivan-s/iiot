import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { createTheme, alpha, getContrastRatio, ThemeProvider } from '@mui/material/styles';
import mqtt from 'mqtt';
import axios from 'axios'
import './App.css'

const Dashboard = () => {
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

  const [rows, setRows] = useState([
    { id: 1, time: '10:00', ack: 'ACK', status: 'Active', area: 'Area 1', name: 'Machine 1', description: 'Description 1', value: '100', setpoint: '150', unit: 'kg', style: '' },
  ]);

  useEffect(() => {
    const client = mqtt.connect('ws://w1900034.emqx.cloud:8083/mqtt', {
      clientId: process.env.REACT_APP_CLIENT_ID,
      username: process.env.REACT_APP_USERNAME,
      password: process.env.REACT_APP_PASSWORD,
    });

    client.on('connect', function () {
      console.log('Connected to EMQX Cloud!');
      client.subscribe('topic/1');
      client.subscribe('topic/2');
      client.subscribe('topic/3');
      client.subscribe('topic/4');
    });

    client.on('message', function (topic, message) {
      console.log(topic, message.toString());
      if (topic === 'topic/1') {
        updateRowStyle(1, 'yellow');
      } else if (topic === 'topic/2') {
        updateRowStyle(1, 'blinking');
      } else if (topic === 'topic/4') {
        updateRowStyle(1, 'red');
        handleSendSMS();
      }
    });

    return () => {
      if (client) {
        client.end();
      }
    };
  }, []);

  const updateRowStyle = (rowId, style) => {
    setRows(currentRows =>
      currentRows.map(row =>
        row.id === rowId ? { ...row, style: style } : row
      )
    );
  };

  const handleAck = (rowId) => {
    updateRowStyle(rowId, '');
  };

  const handleSendSMS = () => {
    const serverEndpoint = process.env.REACT_APP_SERVER_ENDPOINT;

    console.log(process.env)
  
    axios.get(process.env.REACT_APP_SHEETS_BEST)
      .then(response => {
        const data = response.data;
        console.log(data)
        if (data.length > 0) {
          const lastRow = data[data.length - 1];
          const mobileNumber = lastRow.mobile;
  
          if (mobileNumber) {
            const messageData = {
              to: '+91'+mobileNumber,
              body: '[ALERT] MACHINE DOWN'
            };
  
            axios.post(serverEndpoint, messageData)
              .then(smsResponse => {
                console.log('SMS sent:', smsResponse.data);
              })
              .catch(error => {
                console.error('Error sending SMS:', error);
              });
          } else {
            console.error('No mobile number found in the last row');
          }
        } else {
          console.error('No data found in the sheet');
        }
      })
      .catch(error => {
        console.error('Error fetching data from the sheet:', error);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          {/* <Button variant="contained" color="violet" onClick={handleSendSMS}>
            Send SMS
          </Button> */}
          <TableContainer component={Paper} sx={{ marginTop: 2,}}>
            <Table>
            <TableHead>
                <TableRow style={{ backgroundColor: '#8f00ff' }}>
                  {['Time', 'ACK', 'Status', 'Area', 'Name', 'Description', 'Value', 'Setpoint', 'Unit'].map((header) => (
                    <TableCell key={header} style={{ color: 'white' }}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} style={getRowStyle(row.style)}>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="violet" onClick={() => handleAck(row.id)}>{row.ack}</Button>
                    </TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.area}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.value}</TableCell>
                    <TableCell>{row.setpoint}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

const getRowStyle = (style) => {
  switch (style) {
    case 'yellow':
      return { backgroundColor: 'yellow' };
    case 'blinking':
      return { animation: 'blinking 1s linear infinite' };
    case 'red':
      return { backgroundColor: '#FF7F7F' };
    default:
      return {};
  }
};

export default Dashboard;
