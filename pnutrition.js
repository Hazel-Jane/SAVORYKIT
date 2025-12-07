// --- OOP Implementation: NutritionDataProcessor Class ---
/**
 * Encapsulates the logic for retrieving, processing, and preparing recipe data
 * from LocalStorage for Chart.js visualization.
 */
class NutritionDataProcessor {
    constructor() {
        this.recipeKey = 'myRecipeBook';
        // Get or generate default recipes for a working demo
        this.defaultRecipes = this.getDefaultRecipes(); 
    }

    // Helper to fetch data (seeds LocalStorage if empty for a running demo)
    getAllRecipes() {
        const recipesJson = localStorage.getItem(this.recipeKey);
        
        if (!recipesJson) {
            this.seedLocalStorage();
            return this.defaultRecipes;
        }
        
        try {
            const storedRecipes = JSON.parse(recipesJson);
            // If stored recipes are parsed but the array is empty, use defaults
            return storedRecipes.length > 0 ? storedRecipes : this.defaultRecipes;
        } catch (e) {
            console.error("Error parsing recipes from LocalStorage:", e);
            return this.defaultRecipes;
        }
    }
    
    // Seeds LocalStorage with sample data 
    seedLocalStorage() {
        const recipeData = JSON.stringify(this.defaultRecipes);
        localStorage.setItem(this.recipeKey, recipeData);
        console.log("LocalStorage seeded with default recipes for demonstration.");
    }

    // 1. Processes data for the Recipe Category Distribution (Pie Chart)
    getCategoryDistributionData(recipes) {
        if (!recipes || recipes.length === 0) return null;

        const categoryCounts = recipes.reduce((acc, recipe) => {
            const category = recipe.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(categoryCounts);
        const data = Object.values(categoryCounts);

        return { labels, data };
    }

    // 2. Processes data for the Nutritional Breakdown (Bar Chart)
    getNutritionalBreakdownData(recipes) {
        if (!recipes || recipes.length === 0) return null;

        const nutrients = ['calories', 'carbohydrates', 'proteins', 'fats'];
        const totalNutrients = nutrients.reduce((acc, n) => ({ ...acc, [n]: 0 }), {});
        let validRecipeCount = 0;

        for (const recipe of recipes) {
            // Check if recipe has complete nutritional data
            const hasNutrition = nutrients.every(n => recipe.nutrition && typeof recipe.nutrition[n] === 'number');
            if (hasNutrition) {
                validRecipeCount++;
                nutrients.forEach(n => {
                    totalNutrients[n] += recipe.nutrition[n];
                });
            }
        }

        if (validRecipeCount === 0) return null;

        // Calculate the average
        const averageNutrients = nutrients.map(n => Math.round(totalNutrients[n] / validRecipeCount));

        return {
            labels: ['Calories (kcal)', 'Carbohydrates (g)', 'Proteins (g)', 'Fats (g)'],
            data: averageNutrients,
            validCount: validRecipeCount
        };
    }

    // 3. Processes data for User Cooking Habits (Line Chart)
    getCookingHabitsData(recipes) {
        if (!recipes || recipes.length === 0) return null;

        const monthlyCounts = recipes.reduce((acc, recipe) => {
            // Use dateAdded property, default to current date if missing
            const date = recipe.dateAdded ? new Date(recipe.dateAdded) : new Date();
            // Format: YYYY-MM
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            acc[monthKey] = (acc[monthKey] || 0) + 1;
            return acc;
        }, {});

        // Sort by date key for correct line chart order
        const sortedKeys = Object.keys(monthlyCounts).sort();
        
        const labels = sortedKeys.map(key => {
            const [year, month] = key.split('-');
            // Create date object to format month name
            const date = new Date(year, month - 1); 
            return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
        });

        const data = sortedKeys.map(key => monthlyCounts[key]);

        return { labels, data };
    }

    // Sample data to make the dashboard work immediately on load
    getDefaultRecipes() {
        return [
            { id: 1, name: "Spicy Tofu Stir-fry", category: "Healthy meals", dateAdded: "2025-10-01", nutrition: { calories: 350, carbohydrates: 35, proteins: 30, fats: 10 } },
            { id: 2, name: "Classic French Onion Soup", category: "Soups", dateAdded: "2025-10-05", nutrition: { calories: 280, carbohydrates: 25, proteins: 15, fats: 15 } },
            { id: 3, name: "Chocolate Lava Cake", category: "Desserts", dateAdded: "2025-10-15", nutrition: { calories: 550, carbohydrates: 70, proteins: 5, fats: 25 } },
            { id: 4, name: "Ginger Tea", category: "Drinks", dateAdded: "2025-11-01", nutrition: { calories: 50, carbohydrates: 12, proteins: 0, fats: 0 } },
            { id: 5, name: "Chicken and Vegetable Curry", category: "Spicy dishes", dateAdded: "2025-11-10", nutrition: { calories: 420, carbohydrates: 45, proteins: 40, fats: 15 } },
            { id: 6, name: "Lentil Soup", category: "Soups", dateAdded: "2025-11-20", nutrition: { calories: 300, carbohydrates: 40, proteins: 18, fats: 8 } },
            { id: 7, name: "Green Smoothie", category: "Drinks", dateAdded: "2025-12-01", nutrition: { calories: 180, carbohydrates: 30, proteins: 5, fats: 2 } },
            { id: 8, name: "Quinoa Salad", category: "Healthy meals", dateAdded: "2025-12-05", nutrition: { calories: 320, carbohydrates: 45, proteins: 12, fats: 10 } },
        ];
    }
}

// --- Chart Rendering Functions ---

// Unique colors for the Pie Chart based on CSS variables
const PIE_CHART_COLORS = [
    'var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)',
    'var(--color-chart-4)', 'var(--color-chart-5)', '#4371D5', '#33CCCC'
];

let categoryPieChartInstance;
let nutritionBarChartInstance;
let habitsLineChartInstance;


function renderCategoryPieChart(data) {
    const ctx = document.getElementById('categoryPieChart').getContext('2d');
    
    if (categoryPieChartInstance) {
        categoryPieChartInstance.destroy();
    }

    categoryPieChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                backgroundColor: PIE_CHART_COLORS,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
}


function renderNutritionBarChart(data) {
    const ctx = document.getElementById('nutritionBarChart').getContext('2d');
    
    if (nutritionBarChartInstance) {
        nutritionBarChartInstance.destroy();
    }
    
    // Specific colors for macro-nutrients
    const backgroundColors = ['#f44336', '#ff9800', '#4caf50', '#2196f3']; 
    
    nutritionBarChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Avg. Nutrient per Recipe',
                data: data.data,
                backgroundColor: backgroundColors,
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: `Average across ${data.validCount} recipes with full nutritional data`
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            }
        }
    });
}


function renderHabitsLineChart(data) {
    const ctx = document.getElementById('habitsLineChart').getContext('2d');
    
    if (habitsLineChartInstance) {
        habitsLineChartInstance.destroy();
    }

    habitsLineChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Recipes Added/Cooked',
                data: data.data,
                borderColor: 'var(--color-primary)',
                backgroundColor: 'rgba(56, 118, 29, 0.2)', // Semi-transparent primary
                tension: 0.3, 
                fill: true,
                pointBackgroundColor: 'var(--color-secondary)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: Math.max(...data.data) + 1,
                    title: {
                        display: true,
                        text: 'Recipe Count'
                    }
                }
            }
        }
    });
}

// --- Main Initialization Function ---
function initializeDashboard() {
    const processor = new NutritionDataProcessor();
    const recipes = processor.getAllRecipes();
    
    if (recipes.length === 0) {
        // Show empty state for all cards if no recipes exist
        document.getElementById('category-empty-message').style.display = 'block';
        document.getElementById('nutrition-empty-message').style.display = 'block';
        document.getElementById('habits-empty-message').style.display = 'block';
        return;
    }
    
    // Hide all empty messages initially (they are shown inside the conditional logic if data is invalid)
    document.getElementById('category-empty-message').style.display = 'none';
    document.getElementById('nutrition-empty-message').style.display = 'none';
    document.getElementById('habits-empty-message').style.display = 'none';


    // 1. Category Distribution (Pie Chart)
    const categoryData = processor.getCategoryDistributionData(recipes);
    if (categoryData) {
        renderCategoryPieChart(categoryData);
    } else {
        document.getElementById('category-empty-message').style.display = 'block';
    }

    // 2. Nutritional Breakdown (Bar Chart)
    const nutritionData = processor.getNutritionalBreakdownData(recipes);
    if (nutritionData) {
        renderNutritionBarChart(nutritionData);
    } else {
        document.getElementById('nutrition-empty-message').style.display = 'block';
    }

    // 3. Cooking Habits (Line Chart)
    const habitsData = processor.getCookingHabitsData(recipes);
    if (habitsData) {
        renderHabitsLineChart(habitsData);
    } else {
        document.getElementById('habits-empty-message').style.display = 'block';
    }
}

// Run the initialization when the page is fully loaded
document.addEventListener('DOMContentLoaded', initializeDashboard);