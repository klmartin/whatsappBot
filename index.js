const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();
const port = 3008;
const axios = require('axios');

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


//app.post('/webhook', (req, res) => {
 // console.log('Webhook received:', JSON.stringify(req.body));
 // res.status(200).send('Webhook received');
//});

// Handle incoming POST request to /webhook
app.post('/webhook', async (req, res) => {
  console.log('Webhook received:', JSON.stringify(req.body));

  // Extract incoming message and sender information
  const messages = req.body.entry[0].changes[0].value.messages;
  if (messages && messages.length > 0) {
    const incomingMessage = messages[0].text.body;
    const senderPhoneNumber = messages[0].from;  // WA ID of the sender

    // Check if the message contains "hello"
    if (incomingMessage.toLowerCase().includes("hello")) {
      // Send response message
      const message = "Hello! How can I assist you today?";
      await sendWhatsAppSMS(senderPhoneNumber, message);
    }
  }

  res.status(200).send('Webhook received');
});

// Function to send WhatsApp message (adjusted for axios)
async function sendWhatsAppSMS(to, message) {
  try {
    const authToken = 'EAAlUgcfa4CsBO1kZBuK9i4xKEzrdp99HpyX7TyVtLFe9bBiheOHg5aiKNENJPSjZCR4Gsi4vw1e8lJNw6TRpXuaSghD8ENBcNjPPi5jmbLmR4adKS5GH2bW3bGwhXZBclOYCkwngglcTj5Bf34jNgxRtqQiE0y4osH7XtBnRyw6CeXj9HIYtnf7tOCniRBcUAZDZD';
    const url = 'https://graph.facebook.com/v21.0/562717046919324/messages';

    const payload = {
      messaging_product: 'whatsapp',
      to: to,
      text: { body: message }
    };

    const options = {
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      data: payload
    };

    // Send the message using axios
    const response = await axios(options);
    console.log('WhatsApp message sent:', response.data);
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
}


https.createServer(options, app).listen(port, () => {
  console.log(`Server running on https://bangapp.pro:${port}/`);
});
