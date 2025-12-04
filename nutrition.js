// --- ENCAPSULATED & ABSTRACTED DATA LOGIC (OOP Class) ---

/**
 * Encapsulates all data retrieval and processing logic for the Nutrition Insights page.
 */
class NutritionInsightsData {
    constructor(storageKey = 'myRecipes') {
        this.STORAGE_KEY = storageKey;
        this.recipes = this._loadRecipes();
    }

    // 1. Encapsulation: Internal Logic (Private-like methods)
    _loadRecipes() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        // Returns an empty array if data isn't found
        return data ? JSON.parse(data) : [];
    }

    _processRecipeCategoryDistribution() {
        const categoryCounts = {};
        this.recipes.forEach(recipe => {
            const category = recipe.category || 'Uncategorized';
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        return {
            labels: Object.keys(categoryCounts),
            data: Object.values(categoryCounts)
        };
    }

    _processNutritionalBreakdown() {
        let totals = { calories: 0, carbohydrates: 0, proteins: 0, fats: 0 };

        this.recipes.forEach(recipe => {
            if (recipe.nutrition) {
                // Use Number() to safely handle stored string/null values
                totals.calories += Number(recipe.nutrition.calories) || 0;
                totals.carbohydrates += Number(recipe.nutrition.carbohydrates) || 0;
                totals.proteins += Number(recipe.nutrition.proteins) || 0;
                totals.fats += Number(recipe.nutrition.fats) || 0;
            }
        });

        return {
            labels: ['Calories (kcal)', 'Carbohydrates (g)', 'Proteins (g)', 'Fats (g)'],
            data: Object.values(totals)
        };
    }

    // 2. Abstraction: Public Interface
    getCategoryDistributionData() {
        // Hides the complex logic of data aggregation
        return this._processRecipeCategoryDistribution();
    }

    getNutritionalBreakdownData() {
        // Hides the complex logic of summing up nutritional values
        return this._processNutritionalBreakdown();
    }
}


// --- DUMMY DATA SETUP ---
const DUMMY_RECIPES = [
    { name: "Adobong Manok", category: "Meat", nutrition: { calories: 400, proteins: 30, fats: 25, carbohydrates: 10 } },
    { name: "Pancit Bihon", category: "Noodle", nutrition: { calories: 550, proteins: 20, fats: 15, carbohydrates: 70 } },
    { name: "Sinigang na Isda", category: "Seafood", nutrition: { calories: 250, proteins: 40, fats: 5, carbohydrates: 15 } },
    { name: "Halo-halo", category: "Dessert", nutrition: { calories: 600, proteins: 5, fats: 10, carbohydrates: 100 } },
    { name: "Sinigang na baboy", category: "Meat", nutrition: { calories: 350, proteins: 35, fats: 20, carbohydrates: 15 } },
    { name: "Fruit Shake ( Mango)", category: "Beverage", nutrition: { calories: 150, proteins: 2, fats: 1, carbohydrates: 30 } },
    { name: "Lomi", category: "Noodle", nutrition: { calories: 650, proteins: 25, fats: 20, carbohydrates: 80 } },
];
localStorage.setItem('myRecipes', JSON.stringify(DUMMY_RECIPES));
// ------------------------

// --- CHART RENDERING LOGIC ---

const generateColors = (count) => {
    const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#A0522D', '#D2691E'
    ];
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

function renderPieChart(data) {
    const ctx = document.getElementById('categoryDistributionChart').getContext('2d');
    const backgroundColors = generateColors(data.labels.length);
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                backgroundColor: backgroundColors,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            aspectRatio: 1, // Makes the chart square
            plugins: {
                legend: { position: 'right' },
            }
        }
    });
}

function renderBarChart(data) {
    const ctx = document.getElementById('nutritionalBreakdownChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Total Nutrient Intake from Saved Recipes',
                data: data.data,
                backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0', '#FF9F40'],
                borderColor: ['#FF6384', '#36A2EB', '#4BC0C0', '#FF9F40'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total Amount'
                    }
                }
            }
        }
    });
}

/**
 * Main function to start the application.
 */
function initializeInsightsPage() {
    // Instantiate the data processor, leveraging OOP pillars
    const insights = new NutritionInsightsData();
    
    // Get the clean, abstracted data
    const categoryData = insights.getCategoryDistributionData();
    const nutritionData = insights.getNutritionalBreakdownData();

    // Render the charts
    renderPieChart(categoryData);
    renderBarChart(nutritionData);
}

// Wait for the entire HTML document to load before running the script
document.addEventListener('DOMContentLoaded', initializeInsightsPage);