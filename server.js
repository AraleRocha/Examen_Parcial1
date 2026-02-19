const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors()); // habilitar CORS para el frontend
app.use(express.json());

const REMOTE_URL = process.env.REMOTE_URL || 'https://diane-domesticable-eliz.ngrok-free.dev/enviar';

app.post('/enviar', async (req, res) => {
  try {
    const resp = await axios.post(REMOTE_URL, req.body, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true
    });
    // reenviamos status y body tal cual venga del server remoto
    return res.status(resp.status).send(resp.data);
  } catch (err) {
    console.error('Proxy error:', err.stack || err.message || err);
    return res.status(500).json({ error: 'Proxy error: ' + (err.message || 'unknown') });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy corriendo en http://localhost:${PORT}`));