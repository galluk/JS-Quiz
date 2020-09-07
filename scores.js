var listScores = document.querySelector("#scoresList");
var btnClearScores = document.querySelector("#clearScores");
var btnBack = document.querySelector("#goBack");

function showHighScores() {
    // get high scores from storage
    var highScores = [];
    var storedHighScores = localStorage.getItem("highscores");

    if (storedHighScores) {
        highScores = JSON.parse(storedHighScores);
    }
    
    // sort the scores from highest to lowest
    highScores.sort(function(a, b){return b.score - a.score});

    // add the scores to the page
    listScores.innerHTML = "";   
    for (var i = 0; i < highScores.length; i++) {
        // add item to the list
        var li = document.createElement("li");
        li.textContent = i+1 + "   " + highScores[i].initials + " : " + highScores[i].score;
        listScores.appendChild(li);
    }
}

function clearHighScores(event) {
    localStorage.removeItem("highscores");
    // refresh display
    showHighScores();
}

// show the scores on the load of page
showHighScores();

btnClearScores.addEventListener("click", clearHighScores);
btnBack.addEventListener("click", function (event) {
    window.open("index.html", "_self"); });