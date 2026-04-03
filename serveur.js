const express = require('express');
const path = require('path');
const Groq = require('groq-sdk')
const app = express();
const port = 3005;

app.use(express.json());

// Initialisation du SDK Groq avec la clé API
// La clé est chargée depuis le fichier .env pour des raisons de sécurité
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Serve les fichiers statiques du dossier 'public'
app.use(express.static(path.join(__dirname, 'docs')));
// Endpoint pour la requête d'extraction de données


app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});