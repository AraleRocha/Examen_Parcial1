const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path'); 

const app = express();
app.use(cors()); 
app.use(express.json());

app.use(express.static(path.join(__dirname, '.')));

const REMOTE_URL = process.env.REMOTE_URL || 'https://diane-domesticable-eliz.ngrok-free.dev/enviar';

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'examen.html'));
});

app.post('/enviar', async (req, res) => {
  try {
    const resp = await axios.post(REMOTE_URL, req.body, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true
    });
    return res.status(resp.status).send(resp.data);
  } catch (err) {
    console.error('Proxy error:', err.stack || err.message || err);
    return res.status(500).json({ error: 'Proxy error: ' + (err.message || 'unknown') });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy corriendo en puerto ${PORT}`));