// script.js

// Get references to the display and buttons
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.calculator-button button');
const clearBtn = document.getElementById('clear-btn');

const calculate = {
    "/": (firstNumber, secondNumber) => secondNumber !== 0 ? firstNumber / secondNumber : "Error",
    "*": (firstNumber, secondNumber) => firstNumber * secondNumber,
    "+": (firstNumber, secondNumber) => firstNumber + secondNumber,
    "-": (firstNumber, secondNumber) => firstNumber - secondNumber,
};

let firstValue = 0; 
let operatorValue = '';
let waitForNext = false; 

function updateDisplay(value) {
    display.textContent = value;
}

function setNumberValue(number) {
    if (waitForNext) {
        updateDisplay(number);
        waitForNext = false;
    } else {
        const displayValue = display.textContent;
        updateDisplay(displayValue === '0' ? number : displayValue + number);
    }
}

function callOperator(operator) {
    const currentValue = parseFloat(display.textContent);
    if (operatorValue && waitForNext) {
        operatorValue = operator;
        return;
    }
    if (!firstValue) {
        firstValue = currentValue; 
    } else {
        const result = calculate[operatorValue](firstValue, currentValue);
        updateDisplay(result);
        firstValue = result;
        if (firstValue === "Error") {
            resetAll();
        }
    }
    operatorValue = operator;
    waitForNext = true;
}

function addDecimal() {
    if (waitForNext) return;
    if (!display.textContent.includes(".")) {
        updateDisplay(`${display.textContent}.`);
    }
}

buttons.forEach((button) => {
    if (button.classList.length === 0) {
        button.addEventListener('click', () => setNumberValue(button.value));
    } else if (button.classList.contains("operator")) {
        button.addEventListener('click', () => callOperator(button.value));
    }
});

function resetAll() {
    firstValue = 0;
    operatorValue = '';
    waitForNext = false;
    updateDisplay('0');
}

clearBtn.addEventListener('click', () => resetAll());
