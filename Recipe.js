document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elements (updated for wireframe)
    const recipesNavLink = document.getElementById('recipes-nav-link'); 
    const addMyRecipeButton = document.getElementById('add-my-recipe-button'); 
    const addRecipeOverlay = document.getElementById('add-recipe-overlay');
    const closeAddButton = document.getElementById('close-add-button');
    const addRecipeForm = document.getElementById('add-recipe-form');
    const recipeGridContainer = document.getElementById('recipe-grid-container');
    const submitRecipeButton = document.getElementById('submit-recipe-button');
    const mainContentTitle = document.querySelector('.main-content-wireframe h2'); 
    const searchInput = document.getElementById('recipe-search');
    const searchButton = document.getElementById('search-button');

    // Filter buttons and dropdown
    const lutongBahayFilter = document.querySelector('.filter-button-wireframe[data-filter="lutongbahay"]');
    const weatherFoodieDropdownLinks = document.querySelectorAll('.dropdown-content-wireframe a');
    const allFilterButtons = document.querySelectorAll('.filter-action-bar-wireframe button, .dropdown-content-wireframe a');


    // Load recipes from local storage or initialize
    let recipes = JSON.parse(localStorage.getItem('userRecipes')) || [];
    let nextRecipeId = recipes.length > 0 ? Math.max(...recipes.map(r => r.id)) + 1 : 1;

    // --- Helper Functions ---

    // Function to render the list of ALL recipes (user-added and default)
    function renderRecipesInGrid(filter = 'all', searchTerm = '') {
        recipeGridContainer.innerHTML = ''; // Clear existing grid

        // Add some dummy recipes for demonstration if the list is empty upon page load
        if (recipes.length === 0 && !localStorage.getItem('hasDefaultRecipes')) {
            const defaultRecipes = [
                { id: 101, name: "Adobo Classic", ingredients: "Pork, Soy Sauce, Vinegar\nBay Leaf, Pepper", instructions: "1. Marinate the pork.\n2. Boil until tender.\n3. Simmer until sauce thickens.", category: "lutongbahay", weather: "comfort", isUserRecipe: false },
                { id: 102, name: "Sinigang na Hipon", ingredients: "Shrimp, Kangkong, Radish\nTamarind powder, Water", instructions: "1. Boil water and tamarind.\n2. Add shrimp and vegetables.\n3. Simmer until cooked.", category: "lutongbahay", weather: "cold", isUserRecipe: false },
                { id: 103, name: "Iced Coffee Blend", ingredients: "Brewed coffee, Milk\nIce, Sweetener", instructions: "1. Brew strong coffee.\n2. Pour over ice.\n3. Add milk and sweetener.", category: "dessert", weather: "sunny", isUserRecipe: false },
                { id: 104, name: "Pancit Canton", ingredients: "Noodles, Vegetables\nSoy Sauce, Oyster Sauce", instructions: "1. Cook noodles.\n2. Stir-fry vegetables.\n3. Combine and season.", category: "lutongbahay", weather: "all", isUserRecipe: false },
                { id: 105, name: "Halo-Halo", ingredients: "Shaved Ice, Milk, Sweet Beans\nLeche Flan, Ube", instructions: "1. Layer ingredients.\n2. Top with ice and milk.", category: "dessert", weather: "sunny", isUserRecipe: false },
            ];
            recipes.push(...defaultRecipes);
            localStorage.setItem('userRecipes', JSON.stringify(recipes)); 
            localStorage.setItem('hasDefaultRecipes', 'true'); 
        }

        let filteredRecipes = recipes;

        // Apply filters
        if (filter !== 'all') {
            filteredRecipes = filteredRecipes.filter(recipe => {
                // If filter is one of the weather categories OR lutongbahay category
                return recipe.category === filter || recipe.weather === filter;
            });
        }

        // Apply search term
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            filteredRecipes = filteredRecipes.filter(recipe => 
                recipe.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                recipe.ingredients.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }

        if (filteredRecipes.length === 0) {
            recipeGridContainer.innerHTML = '<p class="title-desktop" style="text-align:center;">No recipes found matching your criteria.</p>';
            return;
        }

        filteredRecipes.forEach(recipe => {
            const box = document.createElement('div');
            box.classList.add('recipe-box');
            if (recipe.isUserRecipe) {
                box.classList.add('user-recipe');
            }
            box.setAttribute('data-id', recipe.id);
            const imageUrl = recipe.imageUrl || `https://via.placeholder.com/150x120?text=${encodeURIComponent(recipe.name.substring(0, 10))}`;
            box.innerHTML = `
                <img src="${imageUrl}" alt="${recipe.name}" class="recipe-image">
                <h3>${recipe.name}</h3>
                ${recipe.isUserRecipe ? '<p style="font-size:0.9em; margin-top:5px; color:#555;">(Your Recipe)</p>' : ''}
            `;
            recipeGridContainer.appendChild(box);
            box.addEventListener('click', () => showRecipeDetail(recipe));
        });
    }

    // Function to show/hide the "Add Recipe" overlay
    function toggleAddRecipeOverlay(show = true) {
        if (show) {
            addRecipeOverlay.classList.remove('hidden');
            addRecipeForm.reset();
            document.getElementById('recipe-id').value = '';
            submitRecipeButton.textContent = 'Save Recipe to My List';
        } else {
            addRecipeOverlay.classList.add('hidden');
        }
    }

    // Function to show recipe details in the modal
    function showRecipeDetail(recipe) {
        const detailOverlay = document.getElementById('recipe-detail-overlay');
        document.getElementById('detail-title').textContent = recipe.name;
        document.getElementById('detail-description').textContent = recipe.description || 'A delicious recipe.';
        
        const ingredientsUl = document.querySelector('#detail-ingredients ul');
        const instructionsOl = document.querySelector('#detail-instructions ol');
        
        // Convert multiline text into list items, handling empty lines
        ingredientsUl.innerHTML = recipe.ingredients.split('\n').map(item => item.trim()).filter(item => item !== '').map(item => `<li>${item}</li>`).join('');
        instructionsOl.innerHTML = recipe.instructions.split('\n').map(item => item.trim()).filter(item => item !== '').map(item => `<li>${item}</li>`).join('');
        
        detailOverlay.classList.remove('hidden');
    }

    // --- Event Listeners ---

    // 1. Open the "Add Recipe" overlay when 'Add My Recipe' button is clicked
    addMyRecipeButton.addEventListener('click', () => {
        toggleAddRecipeOverlay(true);
    });

    // 2. Close the "Add Recipe" overlay
    closeAddButton.addEventListener('click', () => {
        toggleAddRecipeOverlay(false);
    });
    
    // 3. Close the Recipe Detail overlay
    const closeDetailButton = document.getElementById('close-detail-button');
    closeDetailButton.addEventListener('click', () => {
        document.getElementById('recipe-detail-overlay').classList.add('hidden');
    });

    // 4. Handle recipe submission/editing
    addRecipeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = document.getElementById('recipe-id').value;
        const name = document.getElementById('new-recipe-name').value;
        const ingredients = document.getElementById('new-recipe-ingredients').value;
        const instructions = document.getElementById('new-recipe-instructions').value;

        const newRecipe = {
            id: id ? parseInt(id) : nextRecipeId,
            name,
            ingredients,
            instructions,
            isUserRecipe: true,
            // Default categories for user-added recipes
            category: "user-added", 
            weather: "all" 
        };

        if (id) {
            // Edit existing recipe
            const index = recipes.findIndex(r => r.id === parseInt(id));
            if (index !== -1) {
                recipes[index] = newRecipe;
            }
        } else {
            // Add new recipe
            recipes.push(newRecipe);
            nextRecipeId++; 
        }

        localStorage.setItem('userRecipes', JSON.stringify(recipes));
        renderRecipesInGrid(); // Re-render grid to show new/edited recipe
        toggleAddRecipeOverlay(false); // Close the form
        alert(id ? 'Recipe updated successfully!' : 'Recipe added successfully!');
    });

    // 5. Handle Search
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        renderRecipesInGrid('all', searchTerm);
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchButton.click();
        }
    });


    // 6. Handle Filtering (Lutong Bahay and Weather Foodie)
    allFilterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const filterValue = e.target.getAttribute('data-filter');
            
            // Highlight the active filter (optional, but good UX)
            allFilterButtons.forEach(btn => btn.classList.remove('active-filter'));
            e.target.classList.add('active-filter');

            // Set the main title to reflect the filter
            if (filterValue === 'lutongbahay') {
                mainContentTitle.textContent = "Filipino Home Cooked Favorites";
            } else if (filterValue === 'sunny') {
                mainContentTitle.textContent = "☀️ Hot & Sunny Day Treats";
            } else if (filterValue === 'cold') {
                mainContentTitle.textContent = "❄️ Comfort Foods for Rainy Days";
            } else if (filterValue === 'comfort') {
                mainContentTitle.textContent = "☁️ Cozy & Mild Weather Meals";
            } else {
                mainContentTitle.textContent = "Nourish. Sustain. Achieve.";
            }

            renderRecipesInGrid(filterValue);
        });
    });

    // 7. Handle "Recipes" nav link click (show all recipes)
    recipesNavLink.addEventListener('click', (e) => {
        e.preventDefault();
        mainContentTitle.textContent = "Nourish. Sustain. Achieve.";
        searchInput.value = ''; // Clear search
        renderRecipesInGrid('all');
    });

    // 8. Initial Load
    renderRecipesInGrid('all');
});