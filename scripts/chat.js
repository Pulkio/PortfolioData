let qaData = [];

// Charger les données depuis le fichier JSON
async function loadData() {
    try {
        const response = await fetch('../data/data.json');
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
                'Authorization': 'Bearer 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',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "source_sentence": userQuestion,
                "sentences": qaData.map(item => item.question)
            })
        });

        if (response.ok) {
            const data = await response.json();
            const similarities = data;
            let bestMatchIndex = similarities.indexOf(Math.max(...similarities));

            return similarities[bestMatchIndex] >= 0.7 ? qaData[bestMatchIndex].answer : "Comme le grand marathonien Eliud Kipchoge le dit si bien, No human is limited 😊. Mais n’étant ni humain ni omniscient, je dois avouer que je n’ai pas la réponse à cette question pour le moment 😅. N'hésitez pas à contacter directement Guillaume pour plus de précisions !";
        } else {
            throw new Error("Erreur lors de la récupération de la réponse : " + response.statusText);
        }
    } catch (error) {
        showError(error.message);
        return "Erreur lors de la récupération de la réponse.";
    }
}

// Fonction pour basculer la visibilité de la boîte de chat
function toggleChat() {
    const chatBox = document.getElementById("chat-box");
    chatBox.style.display = (chatBox.style.display === "none" || chatBox.style.display === "") ? "block" : "none";
}

// Fonction pour envoyer le message
async function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    const chatLog = document.getElementById("chat-log");

    if (!userInput) return;

    // Afficher le message de l'utilisateur
    const userMessage = document.createElement("div");
    userMessage.className = "user-message";
    userMessage.textContent = userInput;
    chatLog.appendChild(userMessage);

    // Réinitialiser le champ de saisie
    document.getElementById("user-input").value = "";

    // Obtenir et afficher la réponse du bot
    const answer = await getAnswer(userInput);
    const botMessage = document.createElement("div");
    botMessage.className = "bot-message";
    botMessage.textContent = answer;
    chatLog.appendChild(botMessage);

    // Faire défiler vers le bas de la boîte de dialogue
    chatLog.scrollTop = chatLog.scrollHeight;
}

// Écouter les événements de touche sur le champ de saisie
document.getElementById("user-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Empêche le comportement par défaut (naviguer ou envoyer le formulaire)
        sendMessage(); // Appelle la fonction pour envoyer le message
    }
});

// Fonction pour effacer le chat
function clearChat() {
    const chatLog = document.getElementById("chat-log");
    chatLog.innerHTML = ""; // Supprime tout le contenu du log de chat
}


// Charger les données au démarrage
loadData();
