// Fichier: app.js

// Charger les données depuis le fichier JSON
let qaData = [];

// Charger les données à partir de data.json
console.log("Tentative de chargement de data.json...");
fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("Erreur HTTP: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        qaData = data; // Mettre à jour qaData avec les données chargées
        console.log("Données chargées :", qaData); // Log des données
    })
    .catch(error => console.error("Erreur lors du chargement des données :", error));

// Fonction pour calculer la similarité
async function getAnswer(userQuestion) {
    // Créer un tableau pour stocker les promesses
    const promises = qaData.map(async (item) => {
        const response = await fetch('https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "source_sentence": userQuestion,  // Question de l'utilisateur
                "sentences": [item.question]      // Question à comparer
            })
        });

        if (response.ok) {
            const data = await response.json();
            return data; // retourner les résultats
        } else {
            console.error("Erreur lors de la récupération de la réponse :", response.statusText);
            return null; // gérer l'erreur
        }
    });

    // Attendre que toutes les promesses soient résolues
    const results = await Promise.all(promises);
    
    // Traiter les résultats pour obtenir la meilleure correspondance
    let bestMatchIndex = -1;
    let bestSimilarity = -Infinity;

    results.forEach((result, index) => {
        if (result) {
            const similarityScore = result[0]; // Utiliser le premier score
            if (similarityScore > bestSimilarity) {
                bestSimilarity = similarityScore;
                bestMatchIndex = index;
            }
        }
    });

    return bestSimilarity >= 0.7 ? qaData[bestMatchIndex].answer : "Désolé, je n'ai pas de réponse pour cette question.";
}


// Fonction pour calculer la similarité cosinus
function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

// Envoyer le message
async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    if (!userInput) return;

    // Ajouter le message de l'utilisateur au log
    document.getElementById("chat-log").innerHTML += `<div class="user-message">${userInput}</div>`;
    document.getElementById("user-input").value = "";  // Effacer l'input après envoi

    // Obtenir la réponse du chatbot
    const answer = await getAnswer(userInput);
    document.getElementById("chat-log").innerHTML += `<div class="bot-message">${answer}</div>`;
}
