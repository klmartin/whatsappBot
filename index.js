const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();
const port = 3008;

// Reading the SSL certificate and key files
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/bangapp.pro/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/bangapp.pro/fullchain.pem')
};

app.use(express.json());

app.get('/webhook', (req, res) => {
  console.log('Webhook received:', req.body);
  res.status(200).send('1158201444');
});

// Create an HTTPS server and listen on port 3008
https.createServer(options, app).listen(port, () => {
  console.log(`Server running on https://bangapp.pro:${port}/`);
});
