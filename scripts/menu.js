// Fonction pour charger le menu depuis menu.html
function loadMenu() {
    const menuContainer = document.getElementById("menu");
    console.log("here1")
    fetch("../html/menu.html") // Vérifiez ce chemin
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau');
            }
            return response.text();
        })
        .then(data => {
            menuContainer.innerHTML = data; // Charger le contenu ici
        })
        .catch(error => console.error('Erreur lors du chargement du menu:', error));
}

// Fonction pour afficher/masquer le menu avec animation
function toggleMenu() {
    const menu = document.getElementById("menu");
    console.log("here2")

    if (menu.classList.contains("visible")) {
        // Si le menu est visible, le cacher avec animation
        menu.classList.remove("visible");
        menu.classList.add("hidden");
        
        // Attendre que l'animation de fermeture soit terminée avant de cacher complètement le menu
        setTimeout(() => {
            menu.style.visibility = "hidden"; // Rendre invisible après l'animation
        }, 500); // Correspond à la durée de l'animation
    } else {
        // Sinon, le montrer
        menu.style.visibility = "visible"; // Rendre visible avant l'animation
        menu.classList.remove("hidden");
        menu.classList.add("visible");
    }
}

// Charger le menu lors du chargement de la page
window.onload = loadMenu;
