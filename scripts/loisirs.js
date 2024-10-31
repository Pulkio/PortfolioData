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
    const defaultVolume = 0.1; // Définir le volume par défaut à 10%
    let currentButton = null; // Variable pour garder une référence au bouton en cours

    soundButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Récupère les fichiers son depuis l'attribut data-sounds
            const soundFiles = JSON.parse(this.getAttribute('data-sounds'));

            // Si un son est déjà en cours
            if (currentAudio) {
                // Si le même bouton est cliqué
                if (currentButton === this) {
                    // Met la musique en pause si elle est en cours
                    if (!currentAudio.paused) {
                        currentAudio.pause(); // Arrête le son
                        currentAudio.currentTime = 0; // Réinitialise le temps de lecture
                        this.innerHTML = '<i class="fas fa-volume-up"></i>'; // Change l'icône à volume-up
                        currentAudio = null; // Réinitialise la référence audio
                        currentButton = null; // Réinitialise le bouton courant
                        return; // Sort de la fonction
                    } else {
                        // Reprend la lecture si la musique est en pause
                        currentAudio.play().catch(error => {
                            console.error("Erreur lors de la reprise du son :", error);
                        });
                        this.innerHTML = '<i class="fas fa-stop"></i>'; // Change l'icône à stop
                        return; // Sort de la fonction
                    }
                } else {
                    // Si un autre bouton est cliqué, arrête le son actuel
                    currentAudio.pause(); // Arrête l'audio actuel
                    currentAudio.currentTime = 0; // Réinitialise le temps de lecture
                    currentButton.innerHTML = '<i class="fas fa-volume-up"></i>'; // Réinitialise l'icône de l'ancien bouton
                }
            }

            // Tirer un son aléatoire de la liste
            const soundFile = soundFiles[Math.floor(Math.random() * soundFiles.length)];

            // Crée un nouvel objet Audio et joue le son
            currentAudio = new Audio(soundFile);
            currentAudio.volume = defaultVolume; // Réduit le volume
            currentAudio.play().catch(error => {
                console.error("Erreur lors de la lecture du son :", error);
            });

            // Change l'icône du bouton
            this.innerHTML = '<i class="fas fa-stop"></i>'; // Change l'icône à stop

            // Réinitialiser les icônes des autres boutons
            soundButtons.forEach(btn => {
                if (btn !== this) {
                    btn.innerHTML = '<i class="fas fa-volume-up"></i>'; // Réinitialise l'icône
                }
            });

            // Met à jour le bouton actuel
            currentButton = this;

            // Réinitialise l'icône lorsque le son se termine
            currentAudio.addEventListener('ended', () => {
                this.innerHTML = '<i class="fas fa-volume-up"></i>'; // Réinitialise l'icône quand le son se termine
                currentAudio = null; // Réinitialise la référence audio
                currentButton = null; // Réinitialise le bouton courant
            });
        });
    });
});









