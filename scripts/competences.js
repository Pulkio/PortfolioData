// Données manuelles pour chaque année
const years = ['2019', '2020', '2021', '2022', '2023', '2024'];
const data = [10, 27, 45, 57, 63, 70];  // Performance Développement Informatique
const data2 = [2, 5, 15, 34, 57, 75]; // Performance Data Analyse

// Fonction pour créer le graphique
function createChart() {
    const isMobile = window.innerWidth < 600; // Détermine si l'écran est petit
    const chartType = isMobile ? 'horizontalBar' : 'bar'; // Choisir le type de graphique

    // Configuration du graphique
    const config = {
        type: chartType, // Utiliser le type basé sur la taille de l'écran
        data: {
            labels: years, // Les années sur l'axe X
            datasets: [{
                label: 'Développement Informatique',
                data: data,
                backgroundColor: "#ff0000", // Couleur de la barre
                borderColor: "#ff0000",
                borderWidth: 1,
            },
            {
                label: 'Data Analyse',
                data: data2,
                backgroundColor: "#00FFFF", // Couleur de la barre
                borderColor: "#00FFFF",
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,   // Début de l'axe Y à 0
                    max: 100, // Fin de l'axe Y à 100
                    title: {
                        display: true,
                        text: 'Niveau de Maîtrise (%)',
                        color: '#ffffff' // Couleur du titre de l'axe Y en blanc
                    },
                    ticks: {
                        color: '#ffffff' // Couleur des ticks de l'axe Y en blanc
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Années',
                        color: '#ffffff' // Couleur du titre de l'axe X en blanc
                    },
                    ticks: {
                        color: '#ffffff' // Couleur des ticks de l'axe X en blanc
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#ffffff' // Couleur de la légende en blanc
                    }
                },
                title: {
                    display: true,
                    text: 'Performance par Année',
                    color: '#ffffff' // Couleur du titre en blanc
                },
                datalabels: { // Configuration des étiquettes de données
                    anchor: 'end',
                    align: 'end',
                    formatter: (value) => `${value}%`, // Formater l'étiquette pour inclure le symbole de pourcentage
                    color: '#ffffff' // Couleur des étiquettes en blanc
                }
            }
        },
        plugins: [ChartDataLabels] // Assurez-vous d'utiliser le plugin ici
    };

    // Créer le graphique
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, config);
}

// Ajuster la hauteur minimale du conteneur du graphique
const chartContainer = document.querySelector('.chart-container');
chartContainer.style.height = `${Math.max(window.innerHeight * 0.5, 300)}px`; // 50% de la hauteur de l'écran ou 300px

// Créer le graphique au chargement de la page
createChart();

// Optionnel : Recréer le graphique lors du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    chartContainer.style.height = `${Math.max(window.innerHeight * 0.5, 300)}px`; // Réajuster la hauteur
    createChart();
});
