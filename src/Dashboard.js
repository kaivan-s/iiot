import React, {useEffect} from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { createTheme, alpha, getContrastRatio, ThemeProvider } from '@mui/material/styles';
import AWS from 'aws-sdk';
import mqtt from 'mqtt';

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

  useEffect(() => {
    const client = mqtt.connect('wss://w59cd1b1.ala.us-east-1.emqxsl.com:8084/mqtt', {
      clientId: 'iiot',
      username: 'skaivan',
      password: 'Kai@280199',
    });
    client.on('connect', function () {
      console.log('Connected to EMQX Cloud!');
      client.subscribe('testtopic/1', function (err) {
        if (!err) {
          console.log('Subscribed to topic!');
        }
      });
    });
    client.on('message', function (topic, message) {
      console.log(message.toString());
    });
    console.log(process.env.ACCESS_KEY_ID)
    console.log(process.env.SECRET_ACCESS_KEY)
    return () => {
      if (client) {
        client.end();
      }
    };
  }, []);


  AWS.config.update({
    region: 'ap-south-1', // Your AWS Region
    accessKeyId: process.env.ACCESS_KEY_ID, // Your AWS Access Key
    secretAccessKey: process.env.SECRET_ACCESS_KEY // Your AWS Secret Access Key
  });
  const sns = new AWS.SNS();
  const handleSendEmail = () => {
    const params = {
      Message: 'Your demo email message text here',
      Subject: '[Alert] MACHINE DOWN',
      TopicArn: 'arn:aws:sns:ap-south-1:697609828266:iiot-demo' // Replace with your SNS topic ARN
    };
    sns.publish(params, (err, data) => {
      if (err) {
        console.error('Error sending email:', err);
      } else {
        console.log('Email sent:', data);
      }
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Button variant="contained" color="violet" onClick={handleSendEmail}>
            Send SMS
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Dashboard;
