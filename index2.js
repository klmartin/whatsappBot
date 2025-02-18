const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();
const port = 3008;


const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/bangapp.pro/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/bangapp.pro/fullchain.pem') // Use fullchain.pem to fix certificate chain issues
};


const VERIFY_TOKEN = 'meatyhamhock';

app.use(express.json());


app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const challenge = req.query['hub.challenge'];
  const verify_token = req.query['hub.verify_token'];

  
  if (mode && challenge && verify_token === VERIFY_TOKEN) {

    res.status(200).send(challenge);
  } else {
    
    res.status(403).send('Forbidden');
  }
});

// Handle POST request for receiving events
app.post('/webhook', (req, res) => {
  console.log('Webhook received:', JSON.stringify(req.body));
  res.status(200).send('Webhook received');
});

// Create an HTTPS server and listen on port 3008
https.createServer(options, app).listen(port, () => {
  console.log(`Server running on https://bangapp.pro:${port}/`);
});
