var listScores = document.querySelector("#scoresList");
var btnClearScores = document.querySelector("#clearScores");
var btnBack = document.querySelector("#goBack");

function showHighScores() {
    // get high scores from storage into local array
    var highScores = [];
    var storedHighScores = localStorage.getItem(SCORES_STORAGE_NAME);

    if (storedHighScores) {
        highScores = JSON.parse(storedHighScores);
    }

    // sort the scores from highest to lowest
    highScores.sort(function (a, b) {
        // if scores are level sort by alpabetical order
        if (a.score === b.score) {
            var aInitials = a.initials.toLowerCase();
            var bInitials = b.initials.toLowerCase();
            if (aInitials < bInitials) {return -1};
            if (aInitials > bInitials) {return 1};
            // if we get to here they are the same
            return 0;
        }
        else {
            return b.score - a.score;
        }
    });

    // add the scores to the list on the page
    listScores.innerHTML = "";
    for (var i = 0; i < highScores.length; i++) {
        // add item to the list
        var li = document.createElement("li");
        li.textContent = i + 1 + ". " + highScores[i].initials + " - " + highScores[i].score;
        listScores.appendChild(li);
    }
} // showHighScores

function clearHighScores(event) {
    localStorage.removeItem(SCORES_STORAGE_NAME);
    // remove focus from the button
    document.activeElement.blur();
    // refresh display
    showHighScores();
} // clearHighScores

// show the scores on the load of page
showHighScores();

// allow user to clear high scores
btnClearScores.addEventListener("click", clearHighScores);
// go back to main page on click of back button
btnBack.addEventListener("click", function (event) {
    window.open("index.html", "_self");
});