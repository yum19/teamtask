const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'build')));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/task'));

// Wildcard route for React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'), (err) => {
    if (err) {
      console.error('Error serving file:', err);
      res.status(500).send('Unable to load the application.');
    }
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connecté ✅");
    app.listen(5000, () => {
      console.log("Serveur lancé sur le port 5000 ✅");
    });
  }).catch(err => {
    console.error("Erreur MongoDB ❌", err);
  });