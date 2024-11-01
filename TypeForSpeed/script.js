const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');
const timeEl = document.getElementById('time');
const wpmEl = document.getElementById('wpm');
const gameoverEl = document.getElementById('gameover-container');

let randomParagraph;
let time = 60;
let interval;
let typedCharacters = 0;
let isGameRunning = false;

const paragraphs = [
    "This is a test paragraph for speed typing. Try to type it as fast as you can.",
    "Another sentence is here. Keep typing quickly and accurately to increase your WPM.",
    "Focus on typing without making mistakes, and improve your speed over time."
];

function getRandomParagraph() {
    return paragraphs[Math.floor(Math.random() * paragraphs.length)];
}

function displayParagraph() {
    randomParagraph = getRandomParagraph();
    textDisplay.innerHTML = ''; 

    randomParagraph.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        textDisplay.appendChild(span);
    });
}

function startGame() {
    isGameRunning = true;
    time = 60;
    typedCharacters = 0;
    textInput.value = '';
    displayParagraph(); 
    textInput.focus();
    
    interval = setInterval(updateTime, 1000);
}

function updateTime() {
    time--;
    timeEl.textContent = time;

    if (time === 0) {
        clearInterval(interval);
        gameOver();
    }
}

textInput.addEventListener('input', () => {
    const inputText = textInput.value;
    const characters = textDisplay.querySelectorAll('span');
    
    let correct = true;
    typedCharacters = 0; 

    characters.forEach((charSpan, index) => {
        const typedChar = inputText[index];

        if (typedChar == null) {
            charSpan.classList.remove('correct', 'incorrect');
        } else if (typedChar === charSpan.innerText) {
            charSpan.classList.add('correct');
            charSpan.classList.remove('incorrect');
            typedCharacters++;
        } else {
            charSpan.classList.add('incorrect');
            charSpan.classList.remove('correct');
            correct = false;
        }
    });


    if (inputText === randomParagraph) {
        clearInterval(interval);
        const wpm = calculateWPM();
        showGameOver(wpm);
    }
});

function calculateWPM() {
    const minutes = (60 - time) / 60;
    const wordCount = typedCharacters / 5; 
    return Math.round(wordCount / minutes);
}

function showGameOver(wpm) {
    isGameRunning = false;
    gameoverEl.innerHTML = `
        <h1 class="text-3xl font-bold">จบแล้ว!</h1>
        <p class="text-xl">ความเร็วพิมพ์ของคุณคือ ${wpm} คำ/นาที</p>
        <button onclick="startGame()" class="mt-4 p-2 bg-blue-500 rounded text-white">เล่นอีกครั้ง</button>
    `;
    gameoverEl.classList.remove('hidden');
}

function gameOver() {
    const wpm = calculateWPM();
    showGameOver(wpm); 
}

// เริ่มเกมเมื่อโหลดหน้าเว็บ
startGame();
