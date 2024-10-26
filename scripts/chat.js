let qaData = []; // Contiendra les données de questions/réponses

// Charger les données depuis le fichier JSON
async function loadData() {
    try {
        const response = await fetch('data/data.json');
        if (!response.ok) throw new Error("Erreur lors du chargement des données");
        qaData = await response.json();
        console.log("Données chargées :", qaData);
    } catch (error) {
        showError("Erreur lors du chargement des données : " + error);
    }
}

// Fonction pour obtenir une réponse à partir de l'API Hugging Face
async function getAnswer(userQuestion) {
    try {
        const response = await fetch('https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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', // Remplace par ton token
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "source_sentence": userQuestion,
                "sentences": qaData.map(item => item.question)
            })
        });

        if (response.ok) {
            const data = await response.json();
            const similarities = data; // Similitudes retournées par le modèle
            let bestMatchIndex = similarities.indexOf(Math.max(...similarities));

            return similarities[bestMatchIndex] >= 0.5 ? qaData[bestMatchIndex].answer : "Désolé, je n'ai pas de réponse pour cette question.";
        } else {
            throw new Error("Erreur lors de la récupération de la réponse : " + response.statusText);
        }
    } catch (error) {
        showError(error.message);
        return "Erreur lors de la récupération de la réponse.";
    }
}

// Fonction pour envoyer le message
async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    if (!userInput) return;

    document.getElementById("chat-log").innerHTML += `<div class="user-message">${userInput}</div>`;
    document.getElementById("user-input").value = ""; 

    const answer = await getAnswer(userInput);
    document.getElementById("chat-log").innerHTML += `<div class="bot-message">${answer}</div>`;
}

// Charger les données au démarrage
loadData();
