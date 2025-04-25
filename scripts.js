const QUOTES = {
    easy: [
        "The quick brown fox jumps over the lazy dog.",
        "All that glitters is not gold.",
        "The early bird catches the worm.",
        "Practice makes perfect.",
        "Actions speak louder than words."
    ],
    medium: [
        "Life is what happens when you're busy making other plans.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "Success is not final, failure is not fatal: It is the courage to continue that counts.",
        "The only limit to our realization of tomorrow will be our doubts of today.",
        "The journey of a thousand miles begins with one step."
    ],
    hard: [
        "The greatest glory in living lies not in never falling, but in rising every time we fall. Nelson Mandela believed that perseverance is key to achieving greatness.",
        "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma – which is living with the results of other people's thinking.",
        "If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough. Gratitude changes everything.",
        "The pessimist complains about the wind; the optimist expects it to change; the realist adjusts the sails. Which one are you going to be today?",
        "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do. So throw off the bowlines, sail away from safe harbor."
    ]
};

const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');
const timer = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const results = document.getElementById('results');
const resultWpm = document.getElementById('result-wpm');
const resultAccuracy = document.getElementById('result-accuracy');
const resultTime = document.getElementById('result-time');
const closeResults = document.getElementById('close-results');

let currentQuote = '';
let quoteCharArray = [];
let currentIndex = 0;
let startTime = null;
let timerInterval = null;
let mistakeCount = 0;
let totalTypedChars = 0;
let difficulty = 'easy';
let isGameActive = false;

function init() {
    loadNewQuote();

    textInput.addEventListener('input', handleInput);
    restartBtn.addEventListener('click', loadNewQuote);
    closeResults.addEventListener('click', hideResults);
    
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            difficulty = btn.dataset.level;
            difficultyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadNewQuote();
        });
    });
}

function loadNewQuote() {
    resetGame();
    
    const quotes = QUOTES[difficulty];
    currentQuote = quotes[Math.floor(Math.random() * quotes.length)];

    quoteCharArray = currentQuote.split('').map(char => {
        const span = document.createElement('span');
        span.innerText = char;
        return span;
    });

    textDisplay.innerHTML = '';
    quoteCharArray.forEach(span => textDisplay.appendChild(span));

    if (quoteCharArray.length > 0) {
        quoteCharArray[0].classList.add('current');
    }
    
    textInput.value = '';
    textInput.focus();
}

function handleInput(e) {
    const inputValue = textInput.value;
    const currentChar = inputValue.length - 1;
    
    if (!isGameActive && inputValue.length === 1) {
        startGame();
    }
    
    if (isGameActive) {
        updateStats(inputValue);

        if (inputValue.length >= currentQuote.length) {
            finishGame();
        }
    }
}

function startGame() {
    isGameActive = true;
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = new Date();
    const timeElapsed = Math.floor((currentTime - startTime) / 1000);
    timer.innerText = `${timeElapsed}s`;
}

function updateStats(inputValue) {

    for (let i = 0; i < quoteCharArray.length; i++) {
        quoteCharArray[i].classList.remove('current');
        
        if (i < inputValue.length) {
            if (inputValue[i] === currentQuote[i]) {
                quoteCharArray[i].classList.add('correct');
                quoteCharArray[i].classList.remove('incorrect');
            } else {
                quoteCharArray[i].classList.add('incorrect');
                quoteCharArray[i].classList.remove('correct');
            }
        } else {
            quoteCharArray[i].classList.remove('correct', 'incorrect');
        }
    }

    if (inputValue.length < quoteCharArray.length) {
        quoteCharArray[inputValue.length].classList.add('current');
    }

    mistakeCount = 0;
    for (let i = 0; i < inputValue.length; i++) {
        if (inputValue[i] !== currentQuote[i]) {
            mistakeCount++;
        }
    }

    if (startTime) {
        const currentTime = new Date();
        const timeElapsed = (currentTime - startTime) / 60000; 
        const wordsTyped = inputValue.length / 5; 
        const wpm = Math.round(wordsTyped / timeElapsed);
        wpmDisplay.innerText = wpm;

        const accuracy = Math.max(0, Math.round(((inputValue.length - mistakeCount) / inputValue.length) * 100));
        accuracyDisplay.innerText = `${accuracy}%`;
    }
}

function finishGame() {
    clearInterval(timerInterval);
    isGameActive = false;
    const endTime = new Date();
    const timeElapsed = (endTime - startTime) / 60000; 
    const wordsTyped = currentQuote.length / 5;
    const finalWpm = Math.round(wordsTyped / timeElapsed);
    const accuracy = Math.max(0, Math.round(((currentQuote.length - mistakeCount) / currentQuote.length) * 100));
    const totalTime = Math.floor((endTime - startTime) / 1000);

    resultWpm.innerText = finalWpm;
    resultAccuracy.innerText = `${accuracy}%`;
    resultTime.innerText = `${totalTime}s`;
    
    showResults();
}

function resetGame() {
    clearInterval(timerInterval);
    isGameActive = false;
    startTime = null;
    mistakeCount = 0;
    totalTypedChars = 0;
    timer.innerText = '0s';
    wpmDisplay.innerText = '0';
    accuracyDisplay.innerText = '100%';
}

function showResults() {
    results.classList.add('show');
}

function hideResults() {
    results.classList.remove('show');
    loadNewQuote();
}

document.addEventListener('DOMContentLoaded', init);