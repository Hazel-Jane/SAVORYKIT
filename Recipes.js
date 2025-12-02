document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const modal = document.getElementById('recipe-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImg = document.getElementById('modal-img');
    const modalIngredients = document.getElementById('modal-ingredients');
    const modalInstructions = document.getElementById('modal-instructions');
    const closeBtn = document.getElementById('close-btn');
    
    // Main UI Elements
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const recipeContainer = document.getElementById('recipe-container');
    const noResultsMsg = document.getElementById('no-results');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuIcon = document.getElementById('menu-icon');
    const navList = document.getElementById('nav-list');
    const sectionTitle = document.getElementById('section-title');

    // My Recipe Form Elements
    const addRecipeModal = document.getElementById('add-recipe-modal');
    const closeFormBtn = document.getElementById('close-form-btn');
    const recipeForm = document.getElementById('recipe-input-form');
    const openFormBtn = document.getElementById('open-form-btn'); // You had this defined but the container was removed in HTML. 
    // We will use the Dynamic Add Card instead.

    // --- 1. LOCAL STORAGE SETUP ---
    let userRecipes = JSON.parse(localStorage.getItem('myFoodieRecipes')) || [];

    // --- 2. UNIFIED FILTER & SEARCH FUNCTION ---
    // This function handles BOTH Category Buttons AND Search Input at the same time
    function updateDisplay() {
        const query = searchInput.value.toLowerCase().trim();
        const activeBtn = document.querySelector('.filter-btn.active');
        // Default to 'lutong-bahay' if no button is active (though one usually is)
        const category = activeBtn ? activeBtn.getAttribute('data-filter') : 'lutong-bahay'; 
        
        const staticCards = document.querySelectorAll('.static-recipe');
        const dynamicCards = document.querySelectorAll('.dynamic-recipe');
        const addCard = document.querySelector('.add-card');

        let visibleCount = 0;

        if (category === 'my-recipes') {
            // --- MY RECIPE MODE ---
            sectionTitle.innerText = "My Personal Recipes";
            
            // Hide all static cards
            staticCards.forEach(card => card.style.display = 'none');

            // Handle Dynamic Cards (Search them)
            dynamicCards.forEach(card => {
                const title = card.querySelector('h3').innerText.toLowerCase();
                if (title.includes(query)) {
                    card.style.display = 'flex'; // Use Flex to keep layout
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Handle "Add Recipe" Card
            // Only show it if there is NO search query (cleaner UI), or always show it.
            // Let's show it always unless it specifically doesn't match a strict search concept, 
            // but usually, you want the add button available.
            if (addCard) {
                // Optional: Hide add button if user is searching for something specific? 
                // For now, let's keep it visible so they can add.
                addCard.style.display = 'flex';
            }

        } else {
            // --- STANDARD MODES ---
            sectionTitle.innerText = "Recipe Selection";
            
            // Hide Dynamic Cards & Add Card
            if(addCard) addCard.style.display = 'none';
            dynamicCards.forEach(card => card.style.display = 'none');

            // Filter Static Cards
            staticCards.forEach(card => {
                const cardCategories = card.getAttribute('data-category');
                const title = card.querySelector('h3').innerText.toLowerCase();

                // Condition 1: Must match Category
                const matchesCategory = cardCategories.includes(category);
                // Condition 2: Must match Search Text
                const matchesSearch = title.includes(query);

                if (matchesCategory && matchesSearch) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // Toggle No Results Message
        noResultsMsg.style.display = (visibleCount === 0 && category !== 'my-recipes') ? 'block' : 'none';
        
        // Special case: If My Recipes is empty and not searching
        if (category === 'my-recipes' && userRecipes.length === 0) {
            noResultsMsg.style.display = 'block';
            noResultsMsg.innerText = "You haven't added any recipes yet.";
        } else if (category === 'my-recipes' && visibleCount === 0 && userRecipes.length > 0) {
             noResultsMsg.style.display = 'block';
             noResultsMsg.innerText = "No recipes found matching your search.";
        }
    }

    // --- 3. EVENT LISTENERS FOR FILTER & SEARCH ---

    // Filter Buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Set Active Class
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Clear Search on category change (optional, but good UX)
            searchInput.value = '';

            // If switching to My Recipes, we must render them first
            if (btn.getAttribute('data-filter') === 'my-recipes') {
                renderUserRecipes();
            } else {
                // Remove dynamic cards from DOM to keep it clean
                const dynamicElements = document.querySelectorAll('.dynamic-recipe, .add-card');
                dynamicElements.forEach(el => el.remove());
            }

            updateDisplay(); // Trigger the display update
        });
    });

    // Search Input Listener
    if(searchInput) {
        searchInput.addEventListener('input', updateDisplay);
    }
    
    // Search Form Submit (Prevent reload)
    if(searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateDisplay();
        });
    }

    // Initialize Default View (Lutong Bahay is usually first)
    // Find the button that has 'active' class in HTML, or default to first
    const defaultActive = document.querySelector('.filter-btn.active') || filterButtons[0];
    if(defaultActive) {
        defaultActive.click();
    }


    // --- 4. RENDER USER RECIPES ---
    function renderUserRecipes() {
        // Clear existing dynamic content
        const dynamicElements = document.querySelectorAll('.dynamic-recipe, .add-card');
        dynamicElements.forEach(el => el.remove());

        // Create "Add Recipe" CARD
        const addBtnCard = document.createElement('div');
        addBtnCard.classList.add('recipe-card', 'add-card');
        addBtnCard.innerHTML = `
            <div class="add-card-icon">+</div>
            <div class="add-card-text">Add Recipe</div>
        `;
        addBtnCard.addEventListener('click', () => {
            document.getElementById('form-title').innerText = "Add New Recipe";
            document.getElementById('edit-id').value = '';
            recipeForm.reset();
            addRecipeModal.classList.add('active');
        });
        recipeContainer.appendChild(addBtnCard);

        // Render Cards
        userRecipes.forEach(recipe => {
            const card = document.createElement('div');
            card.classList.add('recipe-card', 'dynamic-recipe');
            card.setAttribute('data-id', recipe.id); 

            const imgSrc = recipe.img.trim() ? recipe.img : ''; 

            card.innerHTML = `
                <img src="${imgSrc}" alt="${recipe.title}">
                <div class="card-content">
                    <h3>${recipe.title}</h3>
                    <p>${recipe.desc}</p>
                    <button class="view-btn">View Recipe</button>
                    <div class="card-actions">
                        <button class="edit-btn" onclick="editRecipe(${recipe.id})">Edit</button>
                        <button class="delete-btn" onclick="deleteRecipe(${recipe.id})">Delete</button>
                    </div>
                </div>
                <div class="recipe-hidden-data" style="display: none;">
                    <div class="raw-ingredients">${recipe.ingredients}</div>
                    <div class="raw-instructions">${recipe.instructions}</div>
                </div>
            `;
            recipeContainer.appendChild(card);
            
            const viewBtn = card.querySelector('.view-btn');
            viewBtn.addEventListener('click', () => openViewModal(recipe));
        });
        
        // Ensure display is correct after rendering
        updateDisplay();
    }

    // --- 5. ADD / EDIT FORM LOGIC ---
    closeFormBtn.addEventListener('click', () => {
        addRecipeModal.classList.remove('active');
    });

    recipeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-id').value;
        const title = document.getElementById('inp-title').value;
        const category = document.getElementById('inp-category').value;
        const img = document.getElementById('inp-img').value;
        const desc = document.getElementById('inp-desc').value;
        const ingredients = document.getElementById('inp-ingredients').value;
        const instructions = document.getElementById('inp-instructions').value;

        if (id) {
            const index = userRecipes.findIndex(r => r.id == id);
            if (index > -1) {
                userRecipes[index] = { id: parseInt(id), title, category, img, desc, ingredients, instructions };
            }
        } else {
            const newRecipe = {
                id: Date.now(),
                title, category, img, desc, ingredients, instructions
            };
            userRecipes.push(newRecipe);
        }
        localStorage.setItem('myFoodieRecipes', JSON.stringify(userRecipes));
        addRecipeModal.classList.remove('active');
        renderUserRecipes(); // Re-render to show new card
    });

    // --- 6. GLOBAL FUNCTIONS (Edit/Delete) ---
    window.deleteRecipe = function(id) {
        if(confirm("Are you sure you want to delete this recipe?")) {
            userRecipes = userRecipes.filter(r => r.id !== id);
            localStorage.setItem('myFoodieRecipes', JSON.stringify(userRecipes));
            renderUserRecipes();
        }
    };

    window.editRecipe = function(id) {
        const recipe = userRecipes.find(r => r.id === id);
        if(recipe) {
            document.getElementById('form-title').innerText = "Edit Recipe";
            document.getElementById('edit-id').value = recipe.id;
            document.getElementById('inp-title').value = recipe.title;
            document.getElementById('inp-category').value = recipe.category;
            document.getElementById('inp-img').value = recipe.img;
            document.getElementById('inp-desc').value = recipe.desc;
            document.getElementById('inp-ingredients').value = recipe.ingredients;
            document.getElementById('inp-instructions').value = recipe.instructions;
            addRecipeModal.classList.add('active');
        }
    };

    // --- 7. VIEW MODAL LOGIC ---
    function openViewModal(recipeData) {
        modalTitle.innerText = recipeData.title;
        modalImg.src = recipeData.img.trim() ? recipeData.img : 'https://placehold.co/500x200?text=No+Image';
        
        modalIngredients.innerHTML = '';
        const ingArray = recipeData.ingredients.split(',');
        ingArray.forEach(ing => {
            const li = document.createElement('li');
            li.innerText = ing.trim();
            modalIngredients.appendChild(li);
        });
        modalInstructions.innerText = recipeData.instructions;
        modal.classList.add('active');
    }

    // Attach listener to static cards (Initial load)
    document.querySelectorAll('.static-recipe .view-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = button.closest('.recipe-card');
            const title = card.querySelector('h3').innerText;
            const imgSrc = card.querySelector('img').src;
            const rawIng = card.querySelector('.data-ingredients').innerHTML;
            const rawInst = card.querySelector('.data-instructions').innerHTML;
            modalTitle.innerText = title;
            modalImg.src = imgSrc;
            modalIngredients.innerHTML = rawIng;
            modalInstructions.innerHTML = rawInst;
            modal.classList.add('active');
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    // --- 8. MOBILE MENU ---
    if(menuIcon){
        menuIcon.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }
});