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
    const defaultVolume = 0.1;
    let currentAudio = null;
    let currentButton = null;

    // Fonction pour lancer la musique
    function playMusic(button, soundFiles) {
        const soundFile = soundFiles[Math.floor(Math.random() * soundFiles.length)];

        // Arrête la musique actuelle si elle existe
        if (currentAudio) {
            currentAudio.pause();
            currentButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        }

        // Initialise et joue la nouvelle musique
        currentAudio = new Audio(soundFile);
        currentAudio.volume = defaultVolume;
        currentAudio.play().catch(error => console.error("Erreur lors de la lecture du son :", error));
        
        // Met à jour le bouton actuel et l'icône
        button.innerHTML = '<i class="fas fa-stop"></i>';
        currentButton = button;

        // Enregistre dans localStorage
        localStorage.setItem('currentSound', soundFile);
        localStorage.setItem('isPlaying', 'true');
        localStorage.setItem('buttonIndex', Array.from(soundButtons).indexOf(button));

        // Réinitialise quand la musique est terminée
        currentAudio.addEventListener('ended', () => {
            button.innerHTML = '<i class="fas fa-volume-up"></i>';
            localStorage.removeItem('currentSound');
            localStorage.removeItem('isPlaying');
            localStorage.removeItem('buttonIndex');
            currentAudio = null;
            currentButton = null;
        });
    }

    // Fonction pour arrêter la musique
    function stopMusic() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentButton.innerHTML = '<i class="fas fa-volume-up"></i>';

            // Supprime la musique de localStorage
            localStorage.removeItem('currentSound');
            localStorage.removeItem('isPlaying');
            localStorage.removeItem('buttonIndex');
            currentAudio = null;
            currentButton = null;
        }
    }

    // Reprise de la musique au chargement si elle est enregistrée dans localStorage
    const savedSound = localStorage.getItem('currentSound');
    const isPlaying = localStorage.getItem('isPlaying');
    const buttonIndex = localStorage.getItem('buttonIndex');

    // Reprendre la lecture si une piste est déjà active
    if (savedSound && isPlaying === 'true' && buttonIndex !== null) {
        currentAudio = new Audio(savedSound);
        currentAudio.volume = defaultVolume;
        currentAudio.play().catch(error => console.error("Erreur lors de la lecture du son :", error));
        
        currentButton = soundButtons[buttonIndex];
        currentButton.innerHTML = '<i class="fas fa-stop"></i>';
    }

    // Ajouter un gestionnaire de clic pour chaque bouton
    soundButtons.forEach((button, index) => {
        button.addEventListener('click', function () {
            const soundFiles = JSON.parse(this.getAttribute('data-sounds'));

            // Vérifie si c'est le même bouton pour démarrer ou arrêter
            if (currentButton === this) {
                if (currentAudio && !currentAudio.paused) {
                    stopMusic(); // Si en cours, arrête la lecture
                } else {
                    playMusic(this, soundFiles); // Sinon, relance la musique
                }
            } else {
                playMusic(this, soundFiles); // Si c'est un autre bouton, change de musique
            }
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
        alert('Game Over!');
        clearInterval(game);
        canvas.style.display = 'none'; // Cacher le canevas
        startButton.style.display = 'block'; // Afficher le bouton de démarrage
        scoreDisplay.style.display = 'none'; // Masquer le score
        return;
    }
    context.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canevas
    drawFood(); // Dessiner la nourriture
    drawSnake(); // Dessiner le serpent
    moveSnake(); // Déplacer le serpent
}

// Fonction pour démarrer le jeu lorsque le bouton est cliqué
startButton.addEventListener('click', () => {
    canvas.style.display = 'block'; // Afficher le canevas
    startButton.style.display = 'none'; // Cacher le bouton
    scoreDisplay.style.display = 'block'; // Afficher le score
    resizeCanvas(); // Redimensionner le canevas
    direction = 'RIGHT'; // Réinitialiser la direction
    nextDirection = 'RIGHT'; // Réinitialiser la prochaine direction
    snake = [{ x: 9 * box, y: 9 * box }]; // Réinitialiser le serpent
    food = generateFood(); // Générer la nourriture
    speed = 100; // Réinitialiser la vitesse
    clearInterval(game);
    game = setInterval(gameLoop, speed); // Démarrer la boucle de jeu
});

// Écouter les flèches de direction pour déplacer le serpent
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') nextDirection = 'LEFT';
    if (event.key === 'ArrowUp' && direction !== 'DOWN') nextDirection = 'UP';
    if (event.key === 'ArrowRight' && direction !== 'LEFT') nextDirection = 'RIGHT';
    if (event.key === 'ArrowDown' && direction !== 'UP') nextDirection = 'DOWN';
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


