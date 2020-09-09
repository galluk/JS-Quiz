var welcomeEl = document.querySelector("#welcome");
var btnStartQuiz = document.querySelector("#startQuiz");
var txtQuestions = document.querySelector("#questionText");
var questionsEl = document.querySelector("#questionsDiv");
var listAnswers = document.querySelector("#answerList");
var txtResult = document.querySelector("#answerResult");
var txtScore = document.querySelector("#score");
var resultsEl = document.querySelector("#resultsDiv");
var txtInitials = document.querySelector("#initialsText");
var btnSubmitScore = document.querySelector("#submitScore");
var frmResults = document.querySelector("#resultsForm");
var txtFinalScore = document.querySelector("#finalScore");

const STARTING_SCORE = 100;
const WRONG_ANSWER_PTS = 10;

var currentAnswer; // the id of the answer to the current question
var currentQuestionIndex = 0;
var score = STARTING_SCORE;
var interval; // the quiz timer
var resultInterval; // timer for showing the result (for one sec)

function initialise() {
    welcomeEl.style.display = "block";
    questionsEl.style.display = "none";
    resultsEl.style.display = "none";
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

// timing function to show the result of the previous question for 1 sec
function updateResultTimer() {
    resultsEl.style.display = "none";
    clearInterval(resultInterval);
} //updateResultTimer

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

        // get the correct answer id for this question
        currentAnswer = question.answerId;
        // update question text
        txtQuestions.textContent = (questionIndex + 1) + ": " + question.questionText;

        // Render a new li for each answer
        for (var i = 0; i < question.answers.length; i++) {

            var li = document.createElement("li");
            // set the answerIndex attribute to check for correct answer
            li.setAttribute("answerIndex", i);

            // create button and add it to the list
            var button = document.createElement("btn");
            button.textContent = question.answers[i];
            button.setAttribute("class", "btn btn-primary");
            li.appendChild(button);

            // and add list item to the list
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
    // deduct 10 sec penalty if the user gave the wrong answer
    if (answerResult === false) {
        score -= WRONG_ANSWER_PTS;
    }
    // display the new score
    txtScore.textContent = score;
} // updateScore

// process the user's answer to the given question
function answerQuestion(event) {
    // get which row was clicked
    var element = event.target;

    // check a button was clicked
    if (element.matches("btn") === true) {

        // handle the user's answer  
        var answer = element.parentElement.getAttribute("answerIndex");

        if (answer == currentAnswer) {
            txtResult.textContent = "Correct!!";
        }
        else {
            txtResult.textContent = "Wrong!!";
        }
        // show the result for one second
        resultsEl.style.display = "block";
        resultInterval = setInterval(updateResultTimer, 1000);

        // update score
        updateScore(answer == currentAnswer);

        // move on to next question
        currentQuestionIndex++;
        renderQuestion(currentQuestionIndex);
    } // if
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
    // stop the timer
    clearInterval(interval);
    
    // hide questions and show score submit form
    questionsEl.style.display = "none";
    frmResults.style.display = "block";

    txtFinalScore.textContent = score;
} // finishQuiz

// add uer's score to the high scores lit, then show the page containing the list
function submitScore(event) {
    // we want to go to the highscores page so need to preventDefault
    event.preventDefault();

    // set properties of the high score
    var highScore = {
        initials: txtInitials.value.trim(),
        score: score
    }

    // Return from function early if submitted initials are blank
    if (highScore.initials === "") {
        alert("Please enter valid initials to save your score.");

        // put cursor back in the input box so the user can re-enter
        txtInitials.focus();

        return;
    }

    // get the highscores from storage
    var highScores = [];
    var storedHighScores = localStorage.getItem(SCORES_STORAGE_NAME);
    if (storedHighScores) {
        highScores = JSON.parse(storedHighScores);
    }

    // add the new score to high scores
    highScores.push(highScore);

    // save the new highscores
    localStorage.setItem(SCORES_STORAGE_NAME, JSON.stringify(highScores));

    // and go to the highscores page
    window.location.href = "highscores.html";
}

// initialise page/quiz on show
initialise();

// hook up required listeners
btnStartQuiz.addEventListener("click", startQuiz);
listAnswers.addEventListener("click", answerQuestion);
frmResults.addEventListener("submit", submitScore);