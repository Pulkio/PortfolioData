const scrollContainer = document.getElementById('scroll-container');
let currentSection = 0;

function scrollToSection(section) {
    scrollContainer.children[section].scrollIntoView({ behavior: 'smooth' });
}

let isScrolling = false;
let startY = 0;

window.addEventListener('wheel', (event) => {
    if (isScrolling) return;
    isScrolling = true;

    if (event.deltaY > 0) {
        currentSection = Math.min(currentSection + 1, scrollContainer.children.length - 1);
    } else {
        currentSection = Math.max(currentSection - 1, 0);
    }

    scrollToSection(currentSection);

    setTimeout(() => {
        isScrolling = false;
    }, 300);
});

window.addEventListener('touchstart', (event) => {
    startY = event.touches[0].clientY;
});

window.addEventListener('touchmove', (event) => {
    if (isScrolling) return;
    isScrolling = true;

    const currentY = event.touches[0].clientY;
    const deltaY = currentY - startY; // Inverse le sens du défilement

    if (deltaY > 0) {
        currentSection = Math.max(currentSection - 1, 0);
    } else {
        currentSection = Math.min(currentSection + 1, scrollContainer.children.length - 1);
    }

    scrollToSection(currentSection);

    setTimeout(() => {
        isScrolling = false;
    }, 300);

    startY = currentY;
});

document.addEventListener('DOMContentLoaded', function () {
    const soundButtons = document.querySelectorAll('.sound-button');
    let currentAudio = null; // Variable pour garder une référence au son en cours
    const defaultVolume = 0.2; // Définir le volume par défaut à 10%
    let currentButton = null; // Variable pour garder une référence au bouton en cours
    let soundFiles = []; // Pour stocker les fichiers son du bouton actuel
    let currentSoundIndex = -1; // Index du son actuel

    soundButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Récupère les fichiers son depuis l'attribut data-sounds
            soundFiles = JSON.parse(this.getAttribute('data-sounds'));

            // Si un son est déjà en cours
            if (currentAudio) {
                // Met la musique en pause si elle est en cours
                if (currentButton === this) {
                    if (!currentAudio.paused) {
                        currentAudio.pause(); // Arrête le son
                        currentButton.innerHTML = '<i class="fas fa-volume-up"></i>'; // Change l'icône à volume-up
                        currentButton = null; // Réinitialise le bouton courant
                        currentAudio = null; // Réinitialise la référence audio
                        return; // Sort de la fonction
                    }
                } else {
                    // Si un autre bouton est cliqué, arrête le son actuel
                    currentAudio.pause(); // Arrête l'audio actuel
                    currentAudio.currentTime = 0; // Réinitialise le temps de lecture
                    currentButton.innerHTML = '<i class="fas fa-volume-up"></i>'; // Réinitialise l'icône de l'ancien bouton
                }
            }

            // Si c'est le premier clic, choisir un son aléatoire
            if (currentSoundIndex === -1) {
                currentSoundIndex = Math.floor(Math.random() * soundFiles.length);
            } else {
                // Sinon, passer à l'index suivant
                currentSoundIndex = (currentSoundIndex + 1) % soundFiles.length;
            }

            // Crée un nouvel objet Audio et joue le son
            currentAudio = new Audio(soundFiles[currentSoundIndex]);
            currentAudio.volume = defaultVolume; // Réduit le volume
            currentAudio.play().catch(error => {
                console.error("Erreur lors de la lecture du son :", error);
            });

            // Change l'icône du bouton à "stop"
            this.innerHTML = '<i class="fas fa-stop"></i>'; // Change l'icône à stop

            // Réinitialiser les icônes des autres boutons
            soundButtons.forEach(btn => {
                if (btn !== this) {
                    btn.innerHTML = '<i class="fas fa-volume-up"></i>'; // Réinitialise l'icône
                }
            });

            // Met à jour le bouton actuel
            currentButton = this;

            // Ajouter un événement pour jouer le son suivant à la fin
            currentAudio.addEventListener('ended', () => {
                // Joue le son suivant
                currentSoundIndex = (currentSoundIndex + 1) % soundFiles.length; // Passe à l'index suivant
                currentAudio = new Audio(soundFiles[currentSoundIndex]); // Crée un nouvel objet Audio
                currentAudio.volume = defaultVolume; // Réduit le volume
                currentAudio.play().catch(error => {
                    console.error("Erreur lors de la lecture du son :", error);
                });
            });
        });
    });
});









const canvas = document.getElementById('snake-game-canvas');
const context = canvas.getContext('2d');
const startButton = document.getElementById('start-snake-game');
const scoreDisplay = document.getElementById('score');
const box = 20; // Largeur de chaque segment
const boxHeight = box * 1; // Hauteur de chaque segment
let snake = [{ x: 9 * box, y: 9 * box }]; // Initialisation du serpent
let direction = 'RIGHT'; // Direction initiale
let nextDirection = 'RIGHT'; // Prochaine direction
let food = generateFood(); // Génération initiale de la nourriture
let game;
let speed = 100; // Vitesse initiale en millisecondes
let score = 0; // Initialiser le score à 0

// Événement pour redimensionner le canevas
window.addEventListener('resize', resizeCanvas);

// Fonction pour mettre à jour le score
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`; // Met à jour le texte du score
}

// Fonction pour gérer la nourriture
function eatFood() {
    score++; // Incrémente le score
    updateScore(); // Met à jour l'affichage du score
}

// Appeler updateScore() lors de l'initialisation du jeu
updateScore();

// Fonction pour générer la nourriture
function generateFood() {
    let foodX, foodY;
    do {
        foodX = Math.floor(Math.random() * (canvas.width / box)) * box; // Alignement à la grille
        foodY = Math.floor(Math.random() * (canvas.height / boxHeight)) * boxHeight; // Alignement à la grille
    } while (snake.some(segment => segment.x === foodX && segment.y === foodY)); // Vérification si la nourriture se trouve dans le serpent

    return { x: foodX, y: foodY };
}

// Fonction pour dessiner la nourriture
function drawFood() {
    context.fillStyle = 'red'; // Couleur de la nourriture
    context.fillRect(food.x, food.y, box, boxHeight); // Nourriture de 20x40 pixels
}

// Fonction pour dessiner le serpent
function drawSnake() {
    snake.forEach((segment) => {
        context.fillStyle = 'green'; // Couleur du serpent
        context.fillRect(segment.x, segment.y, box, boxHeight); // Segment du serpent de 20x40 pixels
    });
}

// Fonction pour déplacer le serpent
function moveSnake() {
    let head = { ...snake[0] }; // Nouvelle tête du serpent
    direction = nextDirection; // Appliquer la prochaine direction

    if (direction === 'LEFT') head.x -= box;
    if (direction === 'RIGHT') head.x += box;
    if (direction === 'UP') head.y -= boxHeight; // Déplacement vertical en fonction de la hauteur
    if (direction === 'DOWN') head.y += boxHeight; // Déplacement vertical en fonction de la hauteur

    // Assurer que la position est un multiple de box pour éviter les désalignements
    head.x = Math.round(head.x / box) * box;
    head.y = Math.round(head.y / boxHeight) * boxHeight; // Arrondir selon la hauteur

    snake.unshift(head); // Ajouter la nouvelle tête

    // Si le serpent mange la nourriture
    if (head.x === food.x && head.y === food.y) {
        food = generateFood(); // Générer une nouvelle nourriture
        speed = Math.max(50, speed - 10); // Augmenter la vitesse (réduire l'intervalle, minimum 50 ms)
        clearInterval(game); // Arrêter le jeu actuel
        game = setInterval(gameLoop, speed); // Redémarrer le jeu avec la nouvelle vitesse
        eatFood(); // Incrémente le score
    } else {
        snake.pop(); // Retirer le dernier segment si le serpent n'a pas mangé
    }
}

// Fonction pour détecter les collisions
function checkCollision() {
    const [head, ...body] = snake; // Extraire la tête et le corps
    const hitWall = head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height;
    const hitSelf = body.some(segment => segment.x === head.x && segment.y === head.y);
    return hitWall || hitSelf; // Retourne vrai si collision
}

// Boucle de jeu principale
function gameLoop() {
    if (checkCollision()) {
        // Créer une boîte de dialogue de Game Over
        showGameOver();
        return; // Quitter la boucle de jeu
    }
    context.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canevas
    drawFood(); // Dessiner la nourriture
    drawSnake(); // Dessiner le serpent
    moveSnake(); // Déplacer le serpent
}

// Fonction pour afficher le Game Over
function showGameOver() {
    clearInterval(game); // Arrêter le jeu
    canvas.style.display = 'none'; // Cacher le canevas
    startButton.style.display = 'block'; // Afficher le bouton de démarrage

    // Réafficher le texte
    const snakeGameSection = document.getElementById('snake-game-section');
    snakeGameSection.querySelector('h2').style.display = 'block';
    snakeGameSection.querySelector('.encouragement-text').style.display = 'block';
    document.getElementById('score').style.display = 'none'; // Cacher le score

    // Réinitialiser le score
    score = 0;
    updateScore(); // Met à jour l'affichage du score à 0

    // Afficher une boîte de dialogue stylisée
    const gameOverMessage = document.createElement('div');
    gameOverMessage.className = 'game-over-message';
    gameOverMessage.innerHTML = `<h3>Game Over</h3><p>Votre score final : ${score}</p>`;
    snakeGameSection.appendChild(gameOverMessage);
}

// Fonction pour démarrer le jeu lorsque le bouton est cliqué
startButton.addEventListener('click', () => {
    // Cacher le texte et le bouton
    document.getElementById('snake-game-section').querySelector('h2').style.display = 'none';
    document.getElementById('snake-game-section').querySelector('.content').style.display = 'none';
    document.getElementById('score').style.display = 'block'; // Afficher le score
    startButton.style.display = 'none'; // Cacher le bouton
    canvas.style.display = 'block'; // Afficher le canevas
    resizeCanvas(); // Redimensionner le canevas
    direction = 'RIGHT'; // Réinitialiser la direction
    nextDirection = 'RIGHT'; // Réinitialiser la prochaine direction
    snake = [{ x: 9 * box, y: 9 * box }]; // Réinitialiser le serpent
    food = generateFood(); // Générer la nourriture
    speed = 100; // Réinitialiser la vitesse
    score = 0; // Réinitialiser le score à 0
    updateScore(); // Mettre à jour l'affichage du score
    clearInterval(game);
    game = setInterval(gameLoop, speed); // Démarrer la boucle de jeu
});

// Écouter les flèches de direction et ZQSD pour déplacer le serpent
document.addEventListener('keydown', (event) => {
    // Contrôle avec les flèches de direction
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') nextDirection = 'LEFT';
    if (event.key === 'ArrowUp' && direction !== 'DOWN') nextDirection = 'UP';
    if (event.key === 'ArrowRight' && direction !== 'LEFT') nextDirection = 'RIGHT';
    if (event.key === 'ArrowDown' && direction !== 'UP') nextDirection = 'DOWN';

    // Contrôle avec ZQSD
    if (event.key === 'q' && direction !== 'RIGHT') nextDirection = 'LEFT'; // Q
    if (event.key === 'z' && direction !== 'DOWN') nextDirection = 'UP'; // Z
    if (event.key === 'd' && direction !== 'LEFT') nextDirection = 'RIGHT'; // D
    if (event.key === 's' && direction !== 'UP') nextDirection = 'DOWN'; // S
});


// Fonction pour redimensionner le canevas
function resizeCanvas() {
    const maxWidth = window.innerWidth * 0.7; // 70% de la largeur de la fenêtre
    const maxHeight = window.innerHeight * 0.5; // 70% de la hauteur de la fenêtre

    canvas.width = Math.floor(maxWidth / box) * box; // Ajuster la largeur
    canvas.height = Math.floor(maxHeight / boxHeight) * boxHeight; // Ajuster la hauteur

    // S'assurer que le canevas est strictement inférieur à l'écran
    if (canvas.width >= window.innerWidth) {
        canvas.width = window.innerWidth - 1; // S'assurer que c'est strictement inférieur
    }
    if (canvas.height >= window.innerHeight) {
        canvas.height = window.innerHeight - 1; // S'assurer que c'est strictement inférieur
    }
}

// Appeler resizeCanvas au démarrage
resizeCanvas();
