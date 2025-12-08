document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const modal = document.getElementById('recipe-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImg = document.getElementById('modal-img'); // It's okay if this is null now
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
    const openFormBtn = document.getElementById('open-form-btn'); 
    const addRecipeContainer = document.getElementById('add-recipe-container');
    

    

    // --- 1. LOCAL STORAGE SETUP ---
    let userRecipes = JSON.parse(localStorage.getItem('myFoodieRecipes')) || [];

    // --- 2. ENABLE THE ADD RECIPE BUTTON ---
    if (openFormBtn) {
        openFormBtn.addEventListener('click', () => {
            document.getElementById('form-title').innerText = "Add New Recipe";
            document.getElementById('edit-id').value = '';
            recipeForm.reset();
            addRecipeModal.classList.add('active');
        });
    }

    // --- 3. CLOSE BUTTONS LOGIC (FIXED) ---
    // Close View Modal
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Close Add/Edit Form Modal
    if (closeFormBtn) {
        closeFormBtn.addEventListener('click', () => {
            addRecipeModal.classList.remove('active');
        });
    }

    // Close Modals when clicking outside (Background)
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
        if (e.target === addRecipeModal) {
            addRecipeModal.classList.remove('active');
        }
    });

    // --- 4. UNIFIED FILTER & SEARCH FUNCTION ---
    function updateDisplay() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const activeBtn = document.querySelector('.filter-btn.active');
        const category = activeBtn ? activeBtn.getAttribute('data-filter') : 'lutong-bahay'; 

        const staticCards = document.querySelectorAll('.static-recipe');
        const dynamicCards = document.querySelectorAll('.dynamic-recipe');

        let visibleCount = 0;

        if (category === 'my-recipes') {
            // --- MY RECIPE MODE ---
            if(sectionTitle) sectionTitle.innerText = "My Personal Recipes";
            
            // Hide all static cards
            staticCards.forEach(card => card.style.display = 'none');

            // SHOW THE ADD RECIPE BUTTON
            if (addRecipeContainer) addRecipeContainer.style.display = 'block';

            // Show/Filter User Recipes
            dynamicCards.forEach(card => {
                const title = card.querySelector('h3').innerText.toLowerCase();
                if (title.includes(query)) {
                    card.style.display = 'flex'; 
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

        } else {
            // --- STANDARD MODES ---
            if(sectionTitle) sectionTitle.innerText = "Recipe Selection";
            
            // HIDE THE ADD RECIPE BUTTON
            if (addRecipeContainer) addRecipeContainer.style.display = 'none';
            
            // Hide dynamic cards
            dynamicCards.forEach(card => card.style.display = 'none');

            // Filter Static Cards
            staticCards.forEach(card => {
                const cardCategories = card.getAttribute('data-category');
                const title = card.querySelector('h3').innerText.toLowerCase();

                if (cardCategories.includes(category) && title.includes(query)) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // Toggle No Results Message
        if (noResultsMsg) {
            if (category === 'my-recipes' && userRecipes.length === 0) {
                noResultsMsg.style.display = 'block';
                noResultsMsg.innerText = "You haven't added any recipes yet.";
            } else {
                noResultsMsg.style.display = (visibleCount === 0) ? 'block' : 'none';
                noResultsMsg.innerText = "No recipes found matching your search.";
            }
        }
    }

    // --- 5. EVENT LISTENERS FOR FILTER & SEARCH ---
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if(searchInput) searchInput.value = '';

            if (btn.getAttribute('data-filter') === 'my-recipes') {
                renderUserRecipes();
            } else {
                const dynamicElements = document.querySelectorAll('.dynamic-recipe');
                dynamicElements.forEach(el => el.remove());
            }
            updateDisplay();
        });
    });

    if(searchInput) searchInput.addEventListener('input', updateDisplay);
    
    if(searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateDisplay();
        });
    }

    // Initialize Default View
    const defaultActive = document.querySelector('.filter-btn.active') || filterButtons[0];
    if(defaultActive) defaultActive.click();


    // --- 6. RENDER USER RECIPES (NO IMAGE VERSION) ---
    function renderUserRecipes() {
        // Clear existing dynamic recipes
        const dynamicElements = document.querySelectorAll('.dynamic-recipe');
        dynamicElements.forEach(el => el.remove());

        userRecipes.forEach(recipe => {
            const card = document.createElement('div');
            card.classList.add('recipe-card', 'dynamic-recipe');
            card.setAttribute('data-id', recipe.id); 

            // NO IMAGE TAG GENERATED HERE
            card.innerHTML = `
                <div class="card-content" style="padding-top: 30px;">
                    <h3>${recipe.title || 'Untitled Recipe'}</h3>
                    <p>${recipe.desc || 'No description'}</p>
                    <button class="view-btn">View Recipe</button>
                    <div class="card-actions">
                        <button class="edit-btn" onclick="editRecipe(${recipe.id})">Edit</button>
                        <button class="delete-btn" onclick="deleteRecipe(${recipe.id})">Delete</button>
                    </div>
                </div>
                <div class="recipe-hidden-data" style="display: none;">
                    <div class="raw-ingredients">${recipe.ingredients || ''}</div>
                    <div class="raw-instructions">${recipe.instructions || ''}</div>
                </div>
            `;
            recipeContainer.appendChild(card);
            
            const viewBtn = card.querySelector('.view-btn');
            viewBtn.addEventListener('click', () => openViewModal(recipe));
        });
        
        updateDisplay();
    }

    // --- 7. SUBMIT FORM LOGIC (NO CATEGORY/IMG) ---
    recipeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-id').value;
        const title = document.getElementById('inp-title').value;
        const desc = document.getElementById('inp-desc').value;
        const ingredients = document.getElementById('inp-ingredients').value;
        const instructions = document.getElementById('inp-instructions').value;

        // Default values
        const category = 'my-recipes'; 
        const img = ''; 

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
        renderUserRecipes(); 
    });

    // --- 8. GLOBAL FUNCTIONS (Edit/Delete) ---
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
            document.getElementById('inp-desc').value = recipe.desc;
            document.getElementById('inp-ingredients').value = recipe.ingredients;
            document.getElementById('inp-instructions').value = recipe.instructions;
            addRecipeModal.classList.add('active');
        }
    };

    // --- 9. VIEW MODAL LOGIC (CRASH PROOF) ---
    function openViewModal(recipeData) {
        modalTitle.innerText = recipeData.title;
        
        // SAFETY CHECK: Only try to touch the image IF the HTML element actually exists
        if (modalImg) {
            modalImg.style.display = 'none'; // Ensure it's hidden since we aren't using images
        }
        
        modalIngredients.innerHTML = '';
        
        if (recipeData.ingredients) {
            // Split by newline or comma
            const separator = recipeData.ingredients.includes('\n') ? '\n' : ',';
            const ingArray = recipeData.ingredients.split(separator);
            
            ingArray.forEach(ing => {
                if(ing.trim()) {
                    const li = document.createElement('li');
                    li.innerText = ing.trim();
                    modalIngredients.appendChild(li);
                }
            });
        }

        modalInstructions.innerText = recipeData.instructions || '';
        modal.classList.add('active');
    }

    // Attach listener to static cards (Initial load)
    document.querySelectorAll('.static-recipe .view-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = button.closest('.recipe-card');
            const title = card.querySelector('h3').innerText;
            // Static cards still have images, but we can ignore them or hide them in modal
            const rawIng = card.querySelector('.data-ingredients').innerHTML;
            const rawInst = card.querySelector('.data-instructions').innerHTML;
            
            modalTitle.innerText = title;
            if(modalImg) modalImg.style.display = 'block'; // Show image for static recipes only if you want
            if(modalImg) modalImg.src = card.querySelector('img').src;

            modalIngredients.innerHTML = rawIng;
            modalInstructions.innerHTML = rawInst;
            modal.classList.add('active');
        });
    });

    // --- 10. MOBILE MENU ---
    if(menuIcon){
        menuIcon.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }
});