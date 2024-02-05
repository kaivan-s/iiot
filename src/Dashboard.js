import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import mqtt from 'mqtt';
import axios from 'axios';
import './App.css';
import RefreshIcon from '@mui/icons-material/Refresh';

const Dashboard = () => {
  const theme = createTheme({
    palette: {
      violet: {
        main: '#7851a9',
      },
    },
  });

  const [boxes, setBoxes] = useState([
    { id: 1, blinking: false, acknowledged: false },
    { id: 2, blinking: false, acknowledged: false },
    { id: 3, blinking: false, acknowledged: false },
    { id: 4, blinking: false, acknowledged: false },
  ]);
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL_GET}`);
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  useEffect(() => {
    fetchLogs(); // Call it once initially
  }, []);

  useEffect(() => {
    const client = mqtt.connect('ws://w1900034.emqx.cloud:8083/mqtt', {
      clientId: process.env.REACT_APP_CLIENT_ID,
      username: process.env.REACT_APP_USERNAME,
      password: process.env.REACT_APP_PASSWORD,
    });

    client.on('connect', () => {
      console.log('Connected to EMQX Cloud!');
      client.subscribe('micro800/topic1');
    });

    client.on('message', (topic, message) => {
      const messageContent = message.toString();
      let boxIndex = -1;
      if (messageContent.includes('125-XA-96730')) boxIndex = 0;
      else if (messageContent.includes('125-XA-96738')) boxIndex = 1;
      else if (messageContent.includes('VAHH 4051')) boxIndex = 2;
      else if (messageContent.includes('COMPRESSOR BEARING-1')) boxIndex = 3;

      if (boxIndex !== -1) {
        setBoxes(currentBoxes =>
          currentBoxes.map((box, index) =>
            index === boxIndex
              ? { ...box, blinking: true, acknowledged: false }
              : box
          )
        );
        logEventToBackend(topic, messageContent);
        handleSendSMS(messageContent)
      }
    });

    return () => {
      client.end();
    };
  }, [boxes]);

  const handleAck = () => {
    setBoxes(currentBoxes =>
      currentBoxes.map(box =>
        box.blinking ? { ...box, blinking: false, acknowledged: true } : box
      )
    );
  };

  const logEventToBackend = (topic, message) => {
    axios.post(`${process.env.REACT_APP_BACKEND_URL_POST}`, { 
      eventType: 'MQTT_MESSAGE',
      details: topic,
      message: message
    })
    .then(response => console.log('Log event response:', response.data))
    .catch(error => console.error('Error logging event:', error));
  };

  const handleSendSMS = (messageContent) => {
    axios.get(process.env.REACT_APP_SHEETS_BEST)
      .then(response => {
        const data = response.data;
        if (data.length > 0) {
          const lastRow = data[data.length - 1];
          const mobileNumber = lastRow.mobile;
          console.log(mobileNumber);
          if (mobileNumber) {
            // Include the messageContent received from MQTT in the body of the SMS
            const messageData = {
              to: '+91' + mobileNumber,
              body: `${messageContent}` // Modify this as needed
            };
            axios.post(process.env.REACT_APP_SERVER_ENDPOINT, messageData)
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
          <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', mb: 2 }}>
            {boxes.map((box, index) => (
              <Box
                key={box.id}
                sx={{
                  width: 100,
                  height: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #000',
                  margin: 1,
                  backgroundColor: box.acknowledged ? 'yellow' : 'transparent',
                  animation: box.blinking ? 'blinking 1s linear infinite' : 'none',
                }}
              >
                {box.blinking || box.acknowledged ? `Box ${index + 1}` : `Box ${index + 1}`}
              </Box>
            ))}
          </Box>
          <Button 
              variant="contained" 
              color="violet" 
              onClick={handleAck} 
              sx={{ 
                mb: 2, 
                color: 'white', // Set the font color to white
                backgroundColor: '#7851a9', // Ensure the background color is violet (or any color you prefer)
                '&:hover': {
                  backgroundColor: 'violet', // Optional: Change the background color slightly on hover
                }
              }}>
              ACKNOWLEDGE
          </Button>
          <TableContainer component={Paper} className="scrollableTableContainer">
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {['Time', 'Event Type', 'Details'].map((header) => (
                    <TableCell key={header} style={{ color: 'white', fontWeight: 'bold', backgroundColor: theme.palette.violet.main }}>
                      {header}
                    </TableCell>
                  ))}
<TableCell style={{ color: 'white', fontWeight: 'bold', backgroundColor: theme.palette.violet.main }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <span>Message</span>
                      <IconButton onClick={fetchLogs} size="large" sx={{ color: 'white' }}>
                        <RefreshIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log, index) => (
                  <TableRow key={index} className="tableRow">
                    <TableCell className="tableCell">{log.Timestamp}</TableCell>
                    <TableCell className="tableCell">{log.EventType}</TableCell>
                    <TableCell className="tableCell">{log.Details}</TableCell>
                    <TableCell className="tableCell">{log.Message}</TableCell>
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

export default Dashboard;
