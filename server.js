const express = require('express');
const mongoose = require('mongoose')
const app = express();
const port = process.env.PORT || 3000;
import User from './user';

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connecté à la base de données MongoDB avec succès.');
  } catch (error) {
    console.error('Erreur de connexion à la base de données MongoDB:', error);
  }
}

connectToDatabase();

app.get('/', (req, res) => {
  res.status(200).send('Trop bon le cloud.');
});

app.get('/load', (req, res) => {
  const start = Date.now();
  let i = 0;
  while (Date.now() - start < 10000) { // simule une tâche de 10 secondes
    i++;
  }

  res.status(200).send(`Charge CPU effectuée avec ${i} itérations`);
});

app.get('/exit', (req, res) => {
  res.status(200).send('Fermeture du serveur.');
  process.exit(0);
});

app.post('/api/data', async (req, res) => {
  try {
    const newData = new User(req.body);
    await newData.save();
    res.status(201).send(newData);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/data', async (req, res) => {
  try {
    const data = await User.find({});
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Serveur chargé sur le port ${port}`);
});
