// server.js (versión con diagnóstico y robusta)
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname)));

// URL remota configurable
const REMOTE_URL = process.env.REMOTE_URL || 'https://diane-domesticable-eliz.ngrok-free.dev/enviar';

// Ruta raíz: comprobar y servir examen.html
app.get('/', (req, res) => {
  const file = path.join(__dirname, 'examen.html');
  console.log('DEBUG: __dirname =', __dirname);
  console.log('DEBUG: looking for file ->', file);
  if (!fs.existsSync(file)) {
    console.error('ERROR: examen.html no existe en el directorio del servidor');
    return res.status(404).send('Archivo examen.html no encontrado en el servidor');
  }
  res.sendFile(file);
});

// Endpoint proxy
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