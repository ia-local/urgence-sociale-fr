require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const Groq = require('groq-sdk');

const app = express();
const port = 3005;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'docs')));

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Fichier d'historique
const SOUP_FILE = path.join(__dirname, 'soup.md');

// Fonction pour archiver dans soup.md
function logToSoup(role, content) {
    const timestamp = new Date().toISOString();
    const logEntry = `\n### [${timestamp}] ${role.toUpperCase()}\n${content}\n`;
    fs.appendFileSync(SOUP_FILE, logEntry, 'utf8');
}

// Endpoint de l'IA (Générosité Programmée)
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        logToSoup('User', userMessage);

        const systemPrompt = `Tu es l'IA de Générosité Programmée. Ton rôle est de proposer des solutions concrètes de solidarité, d'entraide locale et de dénoncer pacifiquement les inégalités économiques. Réponds de manière concise, percutante, avec des punchlines.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.7
        });

        const aiResponse = chatCompletion.choices[0].message.content;
        logToSoup('AGI', aiResponse);

        res.json({ response: aiResponse });
    } catch (error) {
        console.error("Erreur Groq:", error);
        res.status(500).json({ error: "Défaillance du réseau de solidarité." });
    }
});

app.listen(port, () => {
    console.log(`🚀 Serveur IA (Générosité Programmée) en ligne sur http://localhost:${port}`);
    if (!fs.existsSync(SOUP_FILE)) {
        fs.writeFileSync(SOUP_FILE, '# HISTORIQUE COGNITIF - SOUP.MD\n', 'utf8');
    }
});