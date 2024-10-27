// Data-----
const data = [];  // Tableau pour la première série de données
const data2 = []; // Tableau pour la seconde série de données
const startDate = new Date('2019-09-01'); // Date de début
const endDate = new Date('2024-11-30');   // Date de fin
const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)); // Nombre total de jours

// Créer un tableau pour les étiquettes de mois
const labels = [];

// Variables pour les valeurs
let prev = 0;  // Valeur initiale pour data
let prev2 = 0; // Valeur initiale pour data2

// Générer les données et les étiquettes
for (let i = 0; i < totalDays; i++) {
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    
    // Ajouter des étiquettes tous les trois mois
    if (i % 180 === 0 || i === totalDays - 1) { // Tous les trois mois ou dernière date
        labels.push(currentDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }));
    }

    // Augmentation de data selon les périodes définies
    if (currentDate < new Date('2021-01-01')) {
        // Augmentation de 0 à 55 % entre septembre 2019 et décembre 2021
        prev += (40 / 485); // 485 jours entre septembre 2019 et fin 2021
    } else if (currentDate < new Date('2022-01-01')) {
        // Augmentation de 55 % à 65 % entre 2021 et fin 2021
        prev += (55 - 40) / (365); // 365 jours de 2021 à 2022
    } else if (currentDate < new Date('2023-01-01')) {
        // Augmentation de 65 % à 70 % entre 2022 et fin 2024
        prev += (60 - 55) / (365); // 730 jours de 2022 à 2024
    } else if (currentDate < new Date('2024-11-30')) {
        // Continuer jusqu'à fin 2024
        prev += (67 - 60) / (690); // 730 jours de 2022 à 2024
    }
    
    // Augmentation de data selon les périodes définies
    if (currentDate < new Date('2021-01-01')) {
        // Augmentation de 0 à 55 % entre septembre 2019 et décembre 2021
        prev2 += (8 / 485); // 485 jours entre septembre 2019 et fin 2021
    } else if (currentDate < new Date('2022-01-01')) {
        // Augmentation de 55 % à 65 % entre 2021 et fin 2021
        prev2 += (13 - 8) / (365); // 365 jours de 2021 à 2022
    } else if (currentDate < new Date('2023-01-01')) {
        // Augmentation de 65 % à 70 % entre 2022 et fin 2024
        prev2 += (25 - 15) / (365); // 730 jours de 2022 à 2024
    } else if (currentDate < new Date('2024-11-30')) {
        // Continuer jusqu'à fin 2024
        prev2 += (70 - 25) / (690); // 730 jours de 2022 à 2024
    }
    
    // Ajouter les données au tableau
    data.push({ x: i, y: prev });   // Ajouter à data
    data2.push({ x: i, y: prev2 }); // Ajouter à data2
}

// data contient les valeurs pour y entre 0 et 70 %
// data2 contient les valeurs pour y entre 0 et 75 %


// Animation-----
const totalDuration = 10000;
const delayBetweenPoints = totalDuration / data.length;
const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
const animation = {
    x: {
        type: 'number',
        easing: 'linear',
        duration: delayBetweenPoints,
        from: NaN, // the point is initially skipped
        delay(ctx) {
            if (ctx.type !== 'data' || ctx.xStarted) {
                return 0;
            }
            ctx.xStarted = true;
            return ctx.index * delayBetweenPoints;
        }
    },
    y: {
        type: 'number',
        easing: 'linear',
        duration: delayBetweenPoints,
        from: previousY,
        delay(ctx) {
            if (ctx.type !== 'data' || ctx.yStarted) {
                return 0;
            }
            ctx.yStarted = true;
            return ctx.index * delayBetweenPoints;
        }
    }
};
// Animation-----

// Config-----
const config = {
    type: 'line',
    data: {
        datasets: [{
            label: 'Développement informatique', // Légende pour le premier dataset
            borderColor: "#ff0000",
            borderWidth: 1,
            radius: 0,
            data: data,
        },
        {
            label: 'Data Analyse', // Légende pour le deuxième dataset
            borderColor: "#00FFFF",
            borderWidth: 1,
            radius: 0,
            data: data2,
        }]
    },
    options: {
        responsive: true,            // Rendre le graphique responsive
        maintainAspectRatio: true,  // Permettre au canvas d'avoir une hauteur flexible
        animation,
        interaction: {
            intersect: false
        },
        plugins: {
            legend: {
                display: true, // Afficher la légende
                position: 'top' // Positionner la légende en haut
            }
        },
        scales: {
            x: {
                type: 'linear',
                title: {
                    display: true,
                    text: 'Temps' // Légende de l'axe des abscisses
                },
                ticks: {
                    callback: function(value, index) {
                        return labels[index] || ''; // Utiliser les étiquettes de mois
                    }
                }
            },
            y: {
                beginAtZero: true,
                max: 100, // Pour assurer que l'axe Y atteigne jusqu'à 75%
                title: {
                    display: true,
                    text: 'Pourcentage de maîtrise' // Légende de l'axe des ordonnées
                }
            }
        }
    }
};


var myChart = new Chart(
    document.getElementById('myChart'),
    config
);
