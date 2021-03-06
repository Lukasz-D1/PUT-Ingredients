let heart = document.querySelectorAll('[id^="favouritesButton_"]')[0];
let recipeId = splitElementId(heart.id);
const currentUserEmail = document.getElementById('userProfileDropdown').textContent.trim();

function splitNumber(elementId) {
    return elementId.split('_')[1];
}

function hasVoted() {
    let starBox = document.getElementById('starBox');
    let voteValue = 0;
    for (let i = 0; i < 5; i++) {
        if (starBox.childNodes[i].classList.contains('fas')) {
            voteValue++;
        }
    }
    if (voteValue !== 0) {
        return false;
    } else {
        return true;
    }
}


$.getJSON(`/api/votes/${recipeId}/${currentUserEmail}`, (jsonData) => {
    let starBox = document.getElementById('starBox');
    for (let i = 0; i < 5; i++) {
        let star = document.createElement('i');
        star.classList.add('far', 'fa-star');
        star.id = `scoreStar_${i}`;
        star.onclick = (e) => {
            let star = document.getElementById(e.target.id);
            let scoreValue = parseInt(splitNumber(star.id)) + 1;
            if (!hasVoted()) {
                return alert('Nie możesz zagłosować na przepis, na który już zagłosowałeś!');
            } else {
                $.post("/api/votes/", {
                    userEmail: currentUserEmail, 
                    recipeId: recipeId,
                    vote: scoreValue,
                    voteDate: Date.now()
                }).done(function () {
                    location.reload(true);
                }).catch(er => console.log(er));
            }
        };
        starBox.appendChild(star);
    }
    if (jsonData.length !== 0) {
        for (let i = 0; i < jsonData[0]["score"]; i++) {
            starBox.childNodes[i].classList = [];
            starBox.childNodes[i].classList.add('fas');
            starBox.childNodes[i].classList.add('fa-star');
        }
    }
});
