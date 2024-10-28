// Données manuelles pour chaque année
const years = ['2019', '2020', '2021', '2022', '2023', '2024'];
const data = [10, 27, 45, 57, 63, 70];  // Performance Développement Informatique
const data2 = [2, 5, 15, 34, 57, 75]; // Performance Data Analyse

// Fonction pour créer le graphique
function createChart() {

    // Configuration du graphique
    const config = {
        type: 'bar', // Utiliser le type basé sur la taille de l'écran
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
                        color: '#ffffff', // Couleur du titre de l'axe Y en blanc
                        font: {
                            size: 16 // Augmente la taille de la police ici (par exemple, 18)
                        }
                    },
                    ticks: {
                        color: '#ffffff', // Couleur des ticks de l'axe Y en blanc
                        font: {
                            size: 14 // Augmente la taille de la police ici (par exemple, 18)
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Années',
                        color: '#ffffff', // Couleur du titre de l'axe X en blanc
                        font: {
                            size: 16 // Augmente la taille de la police ici (par exemple, 18)
                        }
                    },
                    ticks: {
                        color: '#ffffff', // Couleur des ticks de l'axe X en blanc
                        font: {
                            size: 14 // Augmente la taille de la police ici (par exemple, 18)
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#ffffff', // Couleur de la légende en blanc
                        font: {
                            size: 16 // Augmente la taille de la police ici
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Performance par Année',
                    color: '#ffffff', // Couleur du titre en blanc
                    font: {
                        size: 16 // Augmente la taille de la police ici (par exemple, 18)
                    }
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






// Données du Donut Chart
const doughnutData = {
    labels: ['Java', 'R', 'C#', 'C++', 'Python', 'PHP', 'SQL', 'JavaScript'],
    datasets: [{
        label: 'Niveau de maîtrise',
        data: [15, 25, 10, 7, 12, 6, 18, 8], // Valeurs de test
        backgroundColor: [
            '#ff6384', '#36a2eb', '#ffce56', '#ff9f40',
            '#4bc0c0', '#9966ff', '#ffcd56', '#ff5733'
        ],
        hoverOffset: 0 // Réduit le décalage lors du survol
    }]
};

// Configuration du Donut Chart
const configDoughnut = {
    type: 'doughnut',
    data: doughnutData,
    options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
            mode: 'nearest',
            intersect: false
        },
        plugins: {
            legend: {
                display: false // Masque la légende
            },
            title: {
                display: true,
                text: 'Répartition de Maîtrise Relative des Langages de Programmation',
                color: '#ffffff',
                font: {
                    size: 16
                }
            },
            datalabels: {
                color: '#ffffff',
                anchor: 'center',
                align: 'center',
                formatter: (value, context) => {
                    const label = context.chart.data.labels[context.dataIndex];
                    return `${label}: ${value}%`; // Affiche chaque niveau de maîtrise relatif
                },
                backgroundColor: '#000000',
                padding: 6
            }
        },
        elements: {
            arc: {
                borderWidth: 0
            }
        },
        animations: false
    },
    plugins: [ChartDataLabels]
};



// Créer le Donut Chart et ajuster la hauteur au chargement de la page
const ctxDoughnut = document.getElementById('doughnutChart').getContext('2d');
doughnutChart = new Chart(ctxDoughnut, configDoughnut); // Stocke la référence au graphique
adjustDoughnutHeight();
