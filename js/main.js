let data = []; // data from json file

/***** DOM element's reference ************/
let cardsElement;
let navElement;
let flashCardElement;
let buttons;
let body;
let gradientBackgroundElement;

/****** FLASH CARDS variables **************/
let isAnswerVisible;
let selectedCategoryIndex;
let counter;
let correctAnswers;
let wrongAnswers;


$(document).ready(function () {
    // init reference to DOM elements
    cardsElement = $(".cards");
    navElement = $("nav");
    flashCardElement = $(".flash-card-wrapper");
    buttons = $(".buttons");
    body = $("body");
    gradientBackgroundElement = $(".gradient-background");

    // load json data
    data = window.dataJson.data;
    goToMainPage();
});

/**
 * Function with displaying cards on the main screen
 */
function displayCards() {
    let htmlCode = "";
    // foreach all data and for each category, create a card with image and title
    for (let i = 0; i < data.length; i++) {
        const {category, title, photo_url, cards} = data[i]
        htmlCode = htmlCode + `
        <div class="card" onclick="learnByCategory(${i})">
            <img class="card-up" src="${photo_url}" alt=${title}>
            <div class="card-down">
                <div class="card-title">
                    ${category} - ${title}
                </div>
                <div class="card-subtitle">
                    Number of cards: ${cards.length}
                </div>
            </div>
        </div>`
    }
    cardsElement.html(htmlCode); // add HTML content to the page
}

/**
 * Function initializes the main page and clear all unnecessary elements
 */
function goToMainPage() {
    buttons.html("")
    flashCardElement.html("")
    gradientBackgroundElement.hide();
    flashCardElement.hide();
    body.removeClass("practise")
    navElement.html(`
        <div>
            <i class="fa-solid fa-graduation-cap"></i>
            Learn by FlashCards
        </div>
        <div class="profile"></div>
    `)
    displayCards()
}

/**
 * Init all global variables for flash cards
 */
function initVariables() {
    isAnswerVisible = false;
    selectedCategoryIndex = 0;
    counter = 0;
    correctAnswers = [];
    wrongAnswers = [];
}

/**
 * Function with displaying flash cards and learning mode
 * @param index index of selected category
 */
function learnByCategory(index) {
    initVariables() // init all globals
    selectedCategoryIndex = index; // set index of learning category
    const {category, title, cards} = data[index]; // destruct data
    if (cards.length <= counter) {
        // prevent out of array
        goToMainPage();
        return;
    }
    cardsElement.html(""); // delete cards on the main screen as we don't need them
    navElement.html(`
         <div onclick="goToMainPage()">
            <i class="fa-solid fa-angle-left"></i>
            ${category} - ${title}
        </div>
    `);
    flashCardElement.show();
    gradientBackgroundElement.show();
    drawFlashCard();
    buttons.html(
        `
        <div class="button wrong" onclick="onWrong()">Wrong</div>
        <div class="button correct" onclick="onCorrect()">Correct</div>
        `
    );
    body.addClass("practise");
}

/**
 * Function takes care of displaying flash card
 * it takes into account isAnswerVisible var
 */
function drawFlashCard() {
    const {cards} = data[selectedCategoryIndex];
    const {question, answer} = cards[counter];
    const questionText = isAnswerVisible ? answer : question;
    const buttonText = isAnswerVisible ? "Hide answer" : "Show answer";
    flashCardElement.html(`
          <div class="flash-card">
            <div class="chip">${counter + 1}/${cards.length}</div>
            <div class="question-text">${questionText}</div>
            <div class="text-button" onclick="toggleAnswerVisibility()">${buttonText}</div>
        </div>
    `);
}

/**
 * Toggle card answer visibility
 */
function toggleAnswerVisibility() {
    isAnswerVisible = !isAnswerVisible;
    drawFlashCard();
}

/**
 * Increment counter and either goes to summary or displays next flash card
 */
function nextCard() {
    isAnswerVisible = false;
    const {cards} = data[selectedCategoryIndex];
    if (counter >= cards.length - 1) {
        goToSummary();
    } else {
        counter = counter + 1; // lets go to next question
        drawFlashCard();
    }
}

/**
 * Save correct answer and call nextCard
 */
function onCorrect() {
    correctAnswers.push(counter);
    nextCard();
}

/**
 * Save wrong answer and call nextCard
 */
function onWrong() {
    wrongAnswers.push(counter);
    nextCard();
}

/**
 * Creates summary content with num of wrong and correct answers
 */
function goToSummary() {
    flashCardElement.html(
        `<div class="flash-card">
            <h2>Summary</h2>
            <div>
                <div class="correct-text">Correct answers: ${correctAnswers.length}</div>
                <br/>
                <div class="wrong-text">Wrong answers: ${wrongAnswers.length}</div>
            </div>
        </div>`
    );
    buttons.html(`
        <div class="button primary-button" onclick="learnByCategory(selectedCategoryIndex)">Repeat cards</div>
    `);
}
