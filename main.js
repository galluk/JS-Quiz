var txtQuestions = document.querySelector("#questionText");
var listAnswers = document.querySelector("#answerList");
var txtResult = document.querySelector("#answerResult");
var txtScore = document.querySelector("#score");
var btnSubmitScore = document.querySelector("#submitScore");
var txtInitials = document.querySelector("#initialsText");
var btnStartQuiz = document.querySelector("#startQuiz");
var questionsEl = document.querySelector("#questionsDiv");
var welcomeEl = document.querySelector("#welcome");
var frmResults = document.querySelector("#resultsForm");
var txtFinalScore = document.querySelector("#finalScore");

const STARTING_SCORE = 100;
const WRONG_ANSWER_PTS = 10;

var currentAnswer; // the id of the answer to the current question
var currentQuestionIndex = 0;
var score = STARTING_SCORE;
var interval; // the quiz timer

function initialise() {
    questionsEl.style.display = "none";
    frmResults.style.display = "none";
}

// the timing function that fires every second
function updateTimer() {
    score--;

    if (score === 0) {
        finishQuiz();
    }
    else {
        updateScore(true);
    }
} //updateTimer

function startTimer() {
    interval = setInterval(updateTimer, 1000);
}

// display the question to the user
function renderQuestion(questionIndex) {
    // only render if there are questions left
    if (questionIndex < questionsArray.length) {
        // clear the previous question
        listAnswers.innerHTML = "";

        // get the current question
        question = questionsArray[questionIndex];

        currentAnswer = question.answerId;
        txtQuestions.textContent = question.questionText;

        // Render a new li for each answer
        for (var i = 0; i < question.answers.length; i++) {

            var li = document.createElement("li");
            //li.textContent = question.answers[i];
            li.setAttribute("answerIndex", i);

            var button = document.createElement("button");
            button.textContent = question.answers[i];

            li.appendChild(button);
            listAnswers.appendChild(li);
        }

    }
    else {
        // at end of array so finish the quiz
        finishQuiz();
    }
} // renderQuestion

// update the score
function updateScore(answerResult) {
    if (answerResult === false) {
        score = score - WRONG_ANSWER_PTS;
    }
    // display the new score
    txtScore.textContent = score;
} // updateScore

// process the user's answer to the given question
function answerQuestion(event) {
    // get which row was clicked
    var element = event.target;

    // check a button was clicked
    if (element.matches("button") === true) {

        // handle the user's answer  
        var answer = element.parentElement.getAttribute("answerIndex");

        if (answer == currentAnswer) {
            answerResult.textContent = "Correct!!";
        }
        else {
            answerResult.textContent = "Wrong!!";
        }
    } // if

    // update score
    updateScore(answer == currentAnswer);

    // move on to next question
    currentQuestionIndex++;
    renderQuestion(currentQuestionIndex);
} // answerQuestion

function startQuiz() {
    // hide welcome and show the questions
    welcomeEl.style.display = "none";
    questionsEl.style.display = "block";

    // reset the score and questions
    score = STARTING_SCORE;
    currentQuestionIndex = 0;

    updateScore(true);
    startTimer();
    renderQuestion(currentQuestionIndex);
} // startQuiz

// finish off the quiz
function finishQuiz() {
    // hide questions and show score submit
    questionsEl.style.display = "none";
    frmResults.style.display = "block";

    txtFinalScore.textContent = score;
    // stop the timer
    clearInterval(interval);
} // finishQuiz

function saveScore() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function submitScore(event) {
    var highScore = {
        initials: txtInitials.value.trim(),
        score: score
    }

    //highScore.initials = txtInitials.value.trim();
    // Return from function early if submitted initials are blank
    if (highScore.initials === "") {
        return;
    }

    // get the highscores from storage
    var highScores = [];
    var storedHighScores = localStorage.getItem("highscores");

    if (storedHighScores) {
        highScores = JSON.parse(storedHighScores);
    }

    // add the submitted initials and score of current quiz to high scores
    //highScore.score = score;
    highScores.push(highScore);

    // save the new highscores
    localStorage.setItem("highscores", JSON.stringify(highScores));

    window.open("highscores.html", "_blank");
    // window.location.href = "highscores.html";
    // window.location.reload(true);
}

initialise();

// when an Answer button is clicked
listAnswers.addEventListener("click", answerQuestion);
//btnSubmitScore.addEventListener("click", submitScore);
//btnSubmitScore.addEventListener("click", function (event) {window.open("highscores.html", "_self");});
btnStartQuiz.addEventListener("click", startQuiz);