// Données manuelles pour chaque année
const years = ['2019', '2020', '2021', '2022', '2023', '2024'];
const data = [10, 27, 45, 57, 63, 70];  // Performance Développement Informatique
const data2 = [2, 5, 15, 34, 57, 75]; // Performance Data Analyse

// Configuration du graphique
const config = {
    type: 'bar',
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
                title: {
                    display: true,
                    text: 'Niveau de Maîtrise (%)'
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top'
            },
            title: {
                display: true,
                text: 'Performance par Année'
            }
        }
    }
};

// Créer le graphique
var myChart = new Chart(
    document.getElementById('myChart'),
    config
);