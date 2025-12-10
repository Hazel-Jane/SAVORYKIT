// CHART COLOR CODINGS
const backgroundColors = [
    '#eb9671fc', //  (Carbs)
    '#acdfafff', //  (Protein)
    '#fbf851ee'  //  (Fat)
];

const borderColors = [
    '#eb9671fc', //  (Carbs)
    '#acdfafff', //  (Protein)
    '#fbf851ee'  //  (Fat)
];

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('nutrition-cards-container');

    // Recipes Data 
    const recipesData = [
        { name: "Bicol Express", calories: 350, macros: [10, 25, 25] },
        { name: "Dinuguan", calories: 300, macros: [15, 20, 20] },
        { name: "Adobong Sitaw", calories: 200, macros: [12, 8, 12] },
        { name: "Pancit Bihon", calories: 450, macros: [60, 18, 15] },
        { name: "Sinabawang Manok", calories: 280, macros: [10, 30, 12] },
        { name: "Adobong Manok", calories: 380, macros: [8, 40, 20] },
        { name: "Sisig", calories: 480, macros: [5, 30, 40] },
        { name: "Lomi", calories: 550, macros: [70, 25, 20] },
        { name: "Sinigang na Isda", calories: 220, macros: [15, 25, 6] },
        { name: "Sinigang na Baboy", calories: 330, macros: [15, 25, 20] },
        { name: "Sopas", calories: 320, macros: [30, 15, 15] },
        { name: "Halo-halo", calories: 400, macros: [80, 5, 8] },
        { name: "Batchoy", calories: 480, macros: [50, 25, 20] },
        { name: "Fruit Shake (Watermelon)", calories: 150, macros: [35, 2, 0] },
        { name: "Beef Stew (Kaldereta Style)", calories: 420, macros: [15, 35, 25] },
        { name: "Ramen (Filipino Style)", calories: 600, macros: [70, 30, 25] },
        { name: "Fruit Salad", calories: 300, macros: [45, 5, 12] },
        { name: "Lasagna", calories: 500, macros: [40, 30, 25] },
        { name: "Hot Cocoa", calories: 180, macros: [30, 5, 5] },
        { name: "Fruit Shake (Mango)", calories: 220, macros: [50, 3, 0] },
        { name: "Mais con yelo", calories: 250, macros: [55, 3, 3] },
        { name: "Kinilaw", calories: 180, macros: [5, 25, 5] },
        { name: "Atchara", calories: 50, macros: [12, 1, 0] },
        { name: "Buko Pandan", calories: 320, macros: [50, 5, 10] },
        { name: "Leche Flan", calories: 280, macros: [30, 8, 15] },
        { name: "Mango Float", calories: 380, macros: [60, 5, 15] },
        { name: "Mango Tapioca", calories: 250, macros: [55, 3, 2] },
        { name: "Kaldereta", calories: 420, macros: [15, 35, 25] }, 
        { name: "Lugaw", calories: 150, macros: [25, 5, 3] },
        { name: "Kape", calories: 50, macros: [8, 1, 1] }, 
        { name: "Tea", calories: 20, macros: [5, 0, 0] }, 
    ];


    recipesData.forEach((recipe, index) => {
        // Calculate Caloric Contribution of Macros (Approximation)
        const carbKcal = recipe.macros[0] * 4;
        const proteinKcal = recipe.macros[1] * 4;
        const fatKcal = recipe.macros[2] * 9;

        // Data for Pie Chart (Caloric contribution of Macros)
        const chartData = [carbKcal, proteinKcal, fatKcal];
        const cardHtml = `
            <div class="recipe-card" data-recipe-name="${recipe.name}">
                <span class='delete-icon' data-recipe-name="${recipe.name}">✖</span>
                
                <h3>${recipe.name}</h3>
                <div class="macro-info">
                    <div class="macro-calories">Calories: ${recipe.calories} kcal</div>
                    <div class="macro-carbs">Carbs: ${recipe.macros[0]}g</div>
                    <div class="macro-protein">Protein: ${recipe.macros[1]}g</div>
                    <div class="macro-fat">Fat: ${recipe.macros[2]}g</div>
                </div>
                <div class="chart-container">
                    <canvas id="chart-${index}"></canvas>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHtml);
        const ctx = document.getElementById(`chart-${index}`).getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Carbohydrates', 'Proteins', 'Fats'],
                datasets: [{
                    label: 'Caloric Breakdown',
                    data: chartData,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true, 
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 10,
                            padding: 10
                        }
                    },
                    title: {
                        display: true,
                        
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    // Show Calorie amount and percentage
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const value = context.parsed;
                                    // Calculate percentage only if total is not zero to avoid division error
                                    const percentage = (total > 0) ? ((value / total) * 100).toFixed(1) + '%' : '0%'; 
                                    label += `${Math.round(value)} kcal (${percentage})`;
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    });

    //  Add Event Listeners for Delete Icons
    container.addEventListener('click', (event) => {
        // Look for the closest element with the class 'delete-icon'
        const deleteIcon = event.target.closest('.delete-icon'); 
        if (deleteIcon) {
            const recipeName = deleteIcon.getAttribute('data-recipe-name');
            const isConfirmed = confirm(`Are you sure you want to delete the recipe card for "${recipeName}"?`);

            if (isConfirmed) {
                const recipeCard = deleteIcon.closest('.recipe-card');
                if (recipeCard) {
                    recipeCard.remove();
                    alert(`Recipe card for "${recipeName}" has been deleted.`);
                }
            } else {
                // User clicked No
                alert(`Deletion of "${recipeName}" canceled.`);
            }
        }
    });

    // Simple mobile menu toggle
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');

    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', () => {
            navbar.classList.toggle('active');
            menuIcon.classList.toggle('bx-x'); 
        });
    }
});