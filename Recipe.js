// Initial Recipe Data (All 20 recipes categorized by weather)
let recipes = [
//     // --- ☀️ SUNNY WEATHER FOOD (Light, Cold, Refreshing) ---
//     { id: 1, name: "Adobo ng Sitaw", weather: "sunny", 
//         ingredients: "Sitaw, Bawang, Toyo, Suka, Tubig", 
//         instructions: "Igisa ang bawang, sibuyas, at kamatis. Idagdag ang sitaw, toyo, at suka. Pakuluan hanggang lumambot ang sitaw." 
//     },
//     { id: 2, name: "Pancit Bihon", weather: "sunny", 
//         ingredients: "Bihon, Manok, Carrots, Repolyo, Toyo, Sabaw", 
//         instructions: "Igisa ang manok at gulay. Ibuhos ang sabaw at toyo. Ilagay ang bihon at haluin hanggang ma-absorb ang sabaw." 
//     },
//     { id: 3, name: "Halo-halo", weather: "sunny", 
//         ingredients: "Minatamis, Sago, Gulaman, Yelo, Gatas, Ice Cream", 
//         instructions: "Maglagay ng ingredients sa baso. Lagyan ng durog na yelo, buhusan ng gatas, at lagyan ng ice cream sa ibabaw." 
//     },
//     { id: 4, name: "Watermelon Shake", weather: "sunny", 
//         ingredients: "Pakwan (seedless), Yelo, Sugar, Tubig/Milk", 
//         instructions: "I-blend ang pakwan, yelo, at sugar. I-adjust ang tamis, ihain agad." 
//     },
//     { id: 5, name: "Fruit Salad", weather: "sunny", 
//         ingredients: "Fruit Cocktail, All-Purpose Cream, Condensed Milk, Cheese (optional)", 
//         instructions: "Paghaluin ang fruit cocktail, cream, at condensed milk. Palamigin bago ihain." 
//     },
//     { id: 6, name: "Mango Shake", weather: "sunny", 
//         ingredients: "Hinog na Mangga, Yelo, Milk, Sugar", 
//         instructions: "I-blend ang mangga, yelo, at milk. Timplahin ang tamis." 
//     },


//     // --- 🌧️ RAINY/STORMY WEATHER FOOD (Hot, Soupy, Comforting) ---
//     { id: 7, name: "Bicol Express", weather: "rainy", 
//         ingredients: "Baboy, Sibuyas, Bawang, Luya, Gata, Sili, Alamang", 
//         instructions: "Igisa ang bawang, sibuyas, at luya. Idagdag ang baboy at alamang. Ibuhos ang gata at sili. Pakuluin hanggang lumambot ang karne at kumapal ang sabaw." 
//     },
//     { id: 8, name: "Dinuguan", weather: "rainy", 
//         ingredients: "Baboy, Dugo ng Baboy, Sibuyas, Bawang, Suka, Tubig, Patis", 
//         instructions: "Igisa ang karne. Lagyan ng patis, ibuhos ang suka (huwag haluin). Idagdag ang tubig. Ibuhos ang dugo ng baboy habang hinahalo dahan-dahan." 
//     },
//     { id: 9, name: "Sinabawang Manok", weather: "rainy", 
//         ingredients: "Manok, Sibuyas, Bawang, Luya, Sayote/Papaya, Dahon ng Sili/Malunggay", 
//         instructions: "Igisa ang manok, luya, sibuyas, at bawang. Lagyan ng patis at tubig. Pakuluin hanggang lumambot ang manok. Idagdag ang gulay." 
//     },
//     { id: 10, name: "Adobong Manok", weather: "rainy", 
//         ingredients: "Manok, Toyo, Suka, Bawang, Laurel, Paminta, Tubig", 
//         instructions: "Ilagay ang manok at lahat ng pampalasa. Pakuluan muna nang walang halong suka. Haluin at idagdag ang tubig. Pakuluan hanggang lumambot." 
//     },
//     { id: 11, name: "Sisig", weather: "rainy", 
//         ingredients: "Pork Maskara/Liempo, Sibuyas, Siling Labuyo, Toyo, Calamansi", 
//         instructions: "Pakuluan, i-grill, at hiwain ang karne. Igisa ang sibuyas at karne. Timplahan ng toyo at calamansi. Ihain nang mainit." 
//     },
//     { id: 12, name: "Lomi", weather: "rainy", 
//         ingredients: "Lomi Noodles, Pork/Chicken, Fish Ball, Itlog, Sabaw, Cornstarch", 
//         instructions: "Igisa ang karne, idagdag ang toyo at sabaw. Ilagay ang noodles. Ibuhos ang cornstarch slurry para lumapot. Huling idagdag ang itlog." 
//     },
//     { id: 13, name: "Sinigang na Isda", weather: "rainy", 
//         ingredients: "Isda, Sibuyas, Kamatis, Kangkong, Okra, Sinigang Mix", 
//         instructions: "Pakuluan ang tubig kasama ang sibuyas at kamatis. Idagdag ang gulay. Ilagay ang isda at sinigang mix. Timplahan at ihain." 
//     },
//     { id: 14, name: "Sinigang na Baboy", weather: "rainy", 
//         ingredients: "Pork Ribs/Liempo, Sibuyas, Kamatis, Labanos, Okra, Sinigang Mix", 
//         instructions: "Pakuluan ang baboy hanggang lumambot. Ilagay ang sibuyas, kamatis, at gulay. Huling ilagay ang sinigang mix at kangkong." 
//     },
//     { id: 15, name: "Sopas", weather: "rainy", 
//         ingredients: "Macaroni, Chicken, Hotdog, Carrots, Evaporated Milk, Stock", 
//         instructions: "Igisa ang manok at gulay. Ibuhos ang sabaw at pakuluan. Ilagay ang macaroni. Pag luto, idagdag ang gatas at timplahan." 
//     },
//     { id: 16, name: "Batchoy", weather: "rainy", 
//         ingredients: "Miki Noodles, Pork Meat/Liver, Broth, Ginisang Garlic, Chicharon", 
//         instructions: "Igisa ang baboy at atay. Ibuhos ang pork broth at pakuluin. Idagdag ang miki noodles. Ihain na may chicharon at bawang." 
//     },
//     { id: 17, name: "Beef Stew (Filipino Style)", weather: "rainy", 
//         ingredients: "Beef, Sibuyas, Bawang, Patatas, Carrots, Tomato Sauce, Beef Cube", 
//         instructions: "Igisa ang baka hanggang mag-brown. Ibuhos ang tubig at ilagay ang beef cube. Kapag malambot na, ilagay ang gulay at tomato sauce." 
//     },
//     { id: 18, name: "Ramen (Pinoy Style)", weather: "rainy", 
//         ingredients: "Instant Noodles, Egg, Sliced Pork/Chicken, Sibuyas Dahon, Toyo", 
//         instructions: "Igisa ang bawang at karne. I-boil ang noodles sa sabaw. Lagyan ng toyo at sesame oil. Ilagay ang itlog at takpan." 
//     },
//     { id: 19, name: "Lasagna", weather: "rainy", 
//         ingredients: "Lasagna Pasta, Ground Beef, Red Sauce, White Sauce, Cheese", 
//         instructions: "I-layer ang pasta, red sauce, white sauce, and cheese. I-bake 20–30 mins hanggang mag-melt ang cheese." 
//     },
//     { id: 20, name: "Hot Cocoa (Tablea Style)", weather: "rainy", 
//         ingredients: "Tablea, Water/Milk, Sugar", 
//         instructions: "Pakuluan ang tubig o gatas. Ihalo ang tablea at haluin hanggang matunaw. Lagyan ng asukal." 
//     }
// ];

let nextId = recipes.length + 1; // To ensure unique IDs for new recipes

// DOM Elements
const recipeList = document.getElementById('recipe-list');
const weatherSelect = document.getElementById('weather-select');
const modal = document.getElementById('recipeModal');
const addRecipeBtn = document.getElementById('addRecipeBtn');
const closeBtn = document.querySelector('.close-btn');
const recipeForm = document.getElementById('recipeForm');
const modalTitle = document.getElementById('modalTitle');
const submitRecipeBtn = document.getElementById('submitRecipeBtn');
const recipeIdInput = document.getElementById('recipeId');

// --- R - Read (Display Recipes) ---
function renderRecipes(filter = 'all') {
    recipeList.innerHTML = ''; // Clear existing recipes
    
    // Convert 'stormy' filter to 'rainy' for consistency if needed, but we merged them.
    if (filter === 'stormy') filter = 'rainy';

    const filteredRecipes = recipes.filter(recipe => 
        filter === 'all' || recipe.weather === filter
    );

    if (filteredRecipes.length === 0) {
        recipeList.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">No recipes found for this weather category.</p>`;
        return;
    }

    filteredRecipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        const weatherText = recipe.weather === 'sunny' ? '☀️ Sunny' : '🌧️ Rainy/Stormy';

        card.innerHTML = `
            <div class="card-weather">${weatherText}</div>
            <h3>${recipe.name}</h3>
            <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
            <p><strong>Instructions:</strong> ${recipe.instructions.substring(0, 50)}...</p>
            <div class="card-actions">
                <button class="edit-btn" data-id="${recipe.id}">Edit</button>
                <button class="delete-btn" data-id="${recipe.id}">Delete</button>
            </div>
        `;
        recipeList.appendChild(card);
    });
}

// Event listener for weather filter
weatherSelect.addEventListener('change', (e) => {
    renderRecipes(e.target.value);
});

// --- C - Create & U - Update (Handle Form Submission) ---
recipeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = recipeIdInput.value ? parseInt(recipeIdInput.value) : null;
    const name = document.getElementById('recipeName').value;
    const weather = document.getElementById('recipeWeather').value;
    const ingredients = document.getElementById('recipeIngredients').value;
    const instructions = document.getElementById('recipeInstructions').value;

    const newRecipe = {
        name,
        weather,
        ingredients,
        instructions
    };

    if (id) {
        // UPDATE existing recipe
        const index = recipes.findIndex(r => r.id === id);
        if (index > -1) {
            recipes[index] = { id: id, ...newRecipe };
        }
        alert(`Recipe "${name}" updated successfully!`);
    } else {
        // CREATE new recipe
        newRecipe.id = nextId++;
        recipes.push(newRecipe);
        alert(`New recipe "${name}" added successfully!`);
    }

    modal.style.display = 'none';
    recipeForm.reset();
    renderRecipes(weatherSelect.value); // Refresh list
});

// --- Modal Controls for Create/Update ---

// Show Modal for Create
addRecipeBtn.addEventListener('click', () => {
    modalTitle.textContent = 'Add New Recipe';
    submitRecipeBtn.textContent = 'Save Recipe';
    recipeIdInput.value = '';
    recipeForm.reset();
    modal.style.display = 'block';
});

// Close Modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

// --- D - Delete & U - Update (Card Actions) ---
recipeList.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    if (!id) return;
    const recipeId = parseInt(id);

    if (e.target.classList.contains('delete-btn')) {
        // DELETE operation
        if (confirm('Are you sure you want to delete this recipe?')) {
            recipes = recipes.filter(r => r.id !== recipeId);
            alert('Recipe deleted.');
            renderRecipes(weatherSelect.value);
        }
    } else if (e.target.classList.contains('edit-btn')) {
        // UPDATE operation (Load data into modal)
        const recipe = recipes.find(r => r.id === recipeId);
        if (recipe) {
            modalTitle.textContent = 'Edit Recipe';
            submitRecipeBtn.textContent = 'Update Recipe';
            
            recipeIdInput.value = recipe.id;
            document.getElementById('recipeName').value = recipe.name;
            document.getElementById('recipeWeather').value = recipe.weather;
            document.getElementById('recipeIngredients').value = recipe.ingredients;
            document.getElementById('recipeInstructions').value = recipe.instructions;

            modal.style.display = 'block';
        }
    }
});

// Initial load
renderRecipes('all');