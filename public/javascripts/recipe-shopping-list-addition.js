function splitElementId(elementId) {
    return elementId.split('_')[1];
}

function addToShopList(e, userId) {
    let shopList = document.getElementById(e.target.id);
    let recipeId = splitElementId(shopList.id);
    $.getJSON(`/api/users/shopping_list/${recipeId}`, (jsonData) => {
        if (jsonData >= 1) {
            e.target.classList.add('error');
            let id = e.target.id || e.target.name;
            if (!id) return;

            if(!e.target.parentNode.parentNode.querySelector('[id^=error]')){
                let message = document.createElement('div');
                message.className = 'error-message';
                message.id = 'error-for-' + id;

                $(message).insertAfter(e.target.parentNode);

                e.target.setAttribute('aria-describedby', 'error-for-' + id);

                message.innerHTML = "Istnieje już lista zakupów stworzona dla tego przepisu.";

                message.style.display = 'block';
                message.style.visibility = 'visible';            }

        } else {
            $.post("/api/shoppingList/", {
                userId: userId,
                recipeId: recipeId,
            }).done(() =>{
                window.location.replace('/users/shopping_lists');
            });
        }
    });
}
