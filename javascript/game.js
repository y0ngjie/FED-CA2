const cards = document.querySelectorAll(".gamecard"), // All card elements
timeTag = document.querySelector(".time b"), // Display remaining time
flipsTag = document.querySelector(".flips b"), // Display flips
refreshBtn = document.querySelector(".details button"); // Restart button

// Variables
let maxTime = 30;
let timeLeft = maxTime;
let flips = 0;
let matchedCard = 0;
let disableDeck = false;
let isPlaying = false;
let cardOne, cardTwo, timer;

//Intialise and upadate timer
function initTimer() {
    if(timeLeft <= 0) {
        return clearInterval(timer);
    }
    timeLeft--;
    timeTag.innerText = timeLeft;
}

// Handle flip card
function flipCard({target: clickedCard}) {
    if(!isPlaying) {
        isPlaying = true;
        timer = setInterval(initTimer, 1000); // Starts timer when first card flipped
    }
    if(clickedCard !== cardOne && !disableDeck && timeLeft > 0) {
        flips++;
        flipsTag.innerText = flips;
        clickedCard.classList.add("flip"); // Gives the flipped card the class "flip"
        if(!cardOne) {
            return cardOne = clickedCard; // If the card is flipped it stores it in variable
        }
        cardTwo = clickedCard; // Stores card two when clicked
        disableDeck = true; // Prevents other cards from being clicked
        let cardOneImg = cardOne.querySelector(".back-view img").src,
        cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg); // Check if cards match
    }
}

// Function to check card match
function matchCards(img1, img2) {
    if(img1 === img2) {
        matchedCard++;
        if(matchedCard == 6 && timeLeft > 0) {
            return clearInterval(timer); // If all cards match timer stops
        }
        cardOne.removeEventListener("click", flipCard); // Remove the click event for matching cards
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = ""; // Reset the flipped card variables
        return disableDeck = false; // Allows other cards to be clicked again
    }

    setTimeout(() => {
        cardOne.classList.add("shake"); // Add "shake" class to cards that mismatch
        cardTwo.classList.add("shake");
    }, 400);

    setTimeout(() => {
        cardOne.classList.remove("shake", "flip"); // Remove "shake" and "flip" after awhile
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = ""; // Resets the variables
        disableDeck = false; // Enable card deck for flipping
    }, 1200);
}

// Function to shuffle card and restart game
function shuffleCard() {
    timeLeft = maxTime;
    flips = matchedCard = 0;
    cardOne = cardTwo = "";
    clearInterval(timer); // Clear game timer
    timeTag.innerText = timeLeft;
    flipsTag.innerText = flips;
    disableDeck = isPlaying = false; // Reset game flags

    let arr = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]; // Array representing the card pairs
    arr.sort(() => Math.random() > 0.5 ? 1 : -1); // Shuffle the array

    cards.forEach((gamecard, index) => {
        gamecard.classList.remove("flip");
        let imgTag = gamecard.querySelector(".back-view img"); // Assigns images to the cards
        setTimeout(() => {
            imgTag.src = `images/cardgameimg-${arr[index]}.png`;
        }, 500);
        gamecard.addEventListener("click", flipCard); // Add click event listners to each card for flipping
    });
}

// Initialise shuffle at start of game
shuffleCard();

// Event listener for restart button
refreshBtn.addEventListener("click", shuffleCard);

// Adds event listner to each card
cards.forEach(gamecard => {
    gamecard.addEventListener("click", flipCard);
}); 