
const apiKey = '9882d7cfa14b488481c6519178c18f20';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');


searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});


function getMealList() {
    const query = document.getElementById('search-input').value.trim();
    if (!query) {
        alert('Please enter an ingredient.');
        return;
    }

    fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=6&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data.results && data.results.length > 0) {
                data.results.forEach(recipe => {
                    html += `
                        <div class="meal-item" data-id="${recipe.id}">
                            <div class="meal-img">
                                <img src="${recipe.image}" alt="${recipe.title}">
                            </div>
                            <div class="meal-name">
                                <h3>${recipe.title}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                            </div>
                        </div>
                    `;
                });
            } else {
                html = "Sorry, no meals found!";
            }
            mealList.innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching recipe data:', error);
            alert('Error!. Please try again.');
        });
}


function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        const mealId = e.target.closest('.meal-item').getAttribute('data-id');
        fetch(`https://api.spoonacular.com/recipes/${mealId}/information?includeNutrition=true&apiKey=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                mealRecipeModal(data);
            })
            .catch(error => {
                console.error('Error fetching recipe details:', error);
                alert('Error!. Please try again.');
            });
    }
}


function mealRecipeModal(recipe) {
    const html = `
        <h2 class="recipe-title">${recipe.title}</h2>
        <p class="recipe-category">${recipe.dishTypes ? recipe.dishTypes.join(', ') : 'N/A'}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${recipe.instructions || 'No instructions available.'}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${recipe.image}" alt="${recipe.title}">
        </div>
        <div class="recipe-nutrition">
            <h3>Nutrition Information:</h3>
            <p>Calories: ${recipe.nutrition.nutrients[0]?.amount || 'N/A'} kcal</p>
            <p>Protein: ${recipe.nutrition.nutrients[1]?.amount || 'N/A'} g</p>
            <p>Fat: ${recipe.nutrition.nutrients[2]?.amount || 'N/A'} g</p>
            <p>Carbs: ${recipe.nutrition.nutrients[3]?.amount || 'N/A'} g</p>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}
