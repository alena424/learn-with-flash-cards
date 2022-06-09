let data = []; // data from json file
let cardsElement;
let navElement;
let flashCardsElement;
let buttons;
let body;

$(document).ready(function () {
    // load json data
    $.getJSON("data.json", function (json) {
        data = json.data; // this will show the info it in firebug console
        goToMainPage()
    });
    cardsElement = $(".cards");
    navElement = $("nav");
    flashCardsElement = $(".flash-card-wrapper");
    buttons = $(".buttons");
    body = $("body")
});

/**
 * Function with displaying cards on the main screen
 */
function displayCards() {
    let htmlCode = "";
    for (let i = 0; i < data.length; i++) {
        const { category, title, photo_url, cards } = data[i]
        htmlCode = htmlCode + `
        <div class="card" onclick="learnByCategory(${i})">
            <img class="card-up" src="${photo_url} alt=${title}">
            <div class="card-down">
                <div class="card-title">
                    ${category} - ${title}
                </div>
                <div class="card-subtitle">
                    Number of cards: ${cards.length}
                </div>
            </div>
        </div>
            `
    }
    cardsElement.html(htmlCode);
}

/**
 * Function initialize the main page and clear all unnecessary elements
 */
function goToMainPage(){
    buttons.html("")
    flashCardsElement.html("")
    $(".gradient-background").remove();
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
 * Function with displaying flash cards and learning mode
 * @param index index of selected category
 */
function learnByCategory(index){
    const { category, title, cards } = data[index]
    console.log(cards, data[index], index, data)
    cardsElement.html("") // delete cards on the main screen as we don't need them
    navElement.html(`
         <div onclick="goToMainPage()">
            <i class="fa-solid fa-angle-left"></i>
            ${category} - ${title}
        </div>
    `)
    let counter = 0;
    const { question, answer, memorized } = cards[counter];
    navElement.after(`<div class="gradient-background"/>`);
    flashCardsElement.html(`
          <div class="flash-card">
            <div class="chip">${counter}/${cards.length}</div>
            <div>${question}</div>
            <div class="text-button">Show answer</div>
        </div>
    `)
    buttons.html(
        `
        <div class="button wrong">Wrong</div>
        <div class="button correct">Correct</div>
        `
    )
    body.addClass("practise")
}
