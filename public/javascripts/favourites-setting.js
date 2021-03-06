let favourites = document.querySelectorAll('[id^="favouritesButton_"]'); // just those elements!

function splitElementId(elementId) {
    return elementId.split('_')[1];
}

function colorHeartAsFavourite(element) {
    element.classList = [];
    element.classList.add('fas', 'fa-heart');
    element.style.color = "red";
}

function uncolourHeart(element) {
    element.classList = [];
    element.classList.add('far', 'fa-heart');
    element.style.color = "";
}

function setFavourite(e, userId) {
    let heart = document.getElementById(e.target.id);
    let recipeId = splitElementId(heart.id);
    if (heart.classList.contains('far')) {
        colorHeartAsFavourite(heart);
        $.post("/api/favourites/", {
            userId: userId,
            recipeId: recipeId,
            addedToFavouritesDate: Date.now()
        });
    } else {
        $.ajax({
            url: '/api/favourites/',
            type: 'DELETE',
            data: {
                userId: userId,
                recipeId: recipeId
            }
        });
        uncolourHeart(heart);
    }
}

const currentUserEmail = document.getElementById('userProfileDropdown').textContent.trim();
let recipesOnPage = [];
Object.values(favourites).forEach(favourite => {
    recipesOnPage.push(parseInt(splitElementId(favourite.id)));

    $.getJSON(`/api/categories/recipe/${splitElementId(favourite.id)}`, (jsonData) => {
        let categoryBox = document.getElementById(`categoryBox_${splitElementId(favourite.id)}`);
        jsonData.forEach(element => {
            // <span class="badge badge-pill badge-secondary">Secondary</span>
            let pill = document.createElement('span');
            pill.classList.add('badge', 'badge-pill', 'badge-secondary');
            pill.textContent = element["category_name"];
            categoryBox.appendChild(pill);
        });
    });
});

$.getJSON(`/api/favourites/user_email/${currentUserEmail}`, (jsonData) => {
    let currentUserFavouriteRecipes = [];

    jsonData.forEach(element => {
        currentUserFavouriteRecipes.push(element["recipe_id"]);
    });
    let commonBetweenFavouritesAndOnPage = recipesOnPage.filter(value => currentUserFavouriteRecipes.includes(value));
    commonBetweenFavouritesAndOnPage.forEach(recipe => {
        let favouriteIcon = document.getElementById(`favouritesButton_${recipe}`);
        colorHeartAsFavourite(favouriteIcon);
    });
});
