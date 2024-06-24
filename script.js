// Global constants 
const MAX_DISPLAY_DIGITS = 10;
const NUMERICAL = '0123456789';
const OPERATORS = '/*+-=';
const NEGATIVE = '-';
const MODULO_FACTOR = 100;
const buttonContainer = document.querySelector('.button-container');
const resultDisplay = document.querySelector('.result-display');

// Global variables
let prevValue = 0;
let currValue = 0;
let activeOperator = '';

// Boolean flags
/* TODO later */
let isPrevNegative = false;
let isCurrNegative = false;
let decimal = false; 
let didOperatorJustGetPressed = false;

// Helper functions
/* Handles string manipulation to display up to an 8 digit value as the result */
function displayNewValue() {
  let valueWithSign = (isCurrNegative && currValue !== 0) ? NEGATIVE + currValue.toString() : currValue.toString();
  let displayedValue = valueWithSign.slice(0, MAX_DISPLAY_DIGITS);
  resultDisplay.textContent = displayedValue;
}

/* Handles any numerical addition to the display, such as 0-9 or . */
function handleNumberPressed(number) {
  if (didOperatorJustGetPressed) {
    didOperatorJustGetPressed = false;
  }

  currValue *= 10;
  currValue += parseInt(number);
  displayNewValue();
}

function handleDecimalPressed() {
  /* TODO */
}

/* Handles what happens to the result display when an operator button is pressed, including if there's an active operator */
function handleOperatorPressed(operator) {
  // In the case an operator like * or + get pressed multiple times in a row, both sides of the operator become the previous value
  if (didOperatorJustGetPressed) {
      currValue = prevValue;
  }

  // Go through operators for the existing active operator (not the targetId)
  switch(activeOperator) {
    case '/':
      currValue = currValue === 0 ? NaN : prevValue / currValue;
      break;
    case '*':
      currValue = prevValue * currValue;
      break;
    case '+':
      currValue = prevValue + currValue;
      break;
    case '-':
      currValue = prevValue - currValue;
      break;
    default:
      break;
  }

  // Display new currValue only if there was an active operator before the current one was pressed
  if (activeOperator !== '') {
    displayNewValue();
  }

  // Now set new active operator and change the currValue to be 0 so future numerical button presses start from scratch
  if (operator !== '=') {
    didOperatorJustGetPressed = true;
    activeOperator = operator;
    prevValue = currValue;
    currValue = 0;
  }
  else {
    activeOperator = '';
    didOperatorJustGetPressed = false;
  }
}

/* Handle all three types of miscellaneous buttons, like AC, +/-, and % */
function handleMiscPressed(miscValue) {
  if (didOperatorJustGetPressed) {
    didOperatorJustGetPressed = false;
  }
  
  switch (miscValue) {
    case 'AC':
      clearAll();
      break;
    case '+/-':
      isCurrNegative = isCurrNegative ? false : true;
      break;
    case '%':
      currValue /= MODULO_FACTOR;
      break;
    default:
      throw new Error('Invalid id for miscellaneous button');
  }

  displayNewValue();
}

function handleBackspace() {
  if (currValue) {
    let currValueAsStr = currValue.toString();
    currValue = currValueAsStr.length === 1 ? 0 : parseFloat(currValueAsStr.slice(0, currValueAsStr.length - 1));

    displayNewValue();  
  }
}

/* Resets all global variables to default values */
function clearAll() {
  prevValue = 0;
  currValue = 0;
  activeOperator = '';
  isPrevNegative = false;
  isCurrNegative = false;
}

// Event handlers
/* The following event listener handles any clicks that occur, using a switch statement to determine which helper function to
call depending on if the clicked button is a number, operator, or others */
buttonContainer.addEventListener('click', (event) => {
  const target = event.target;
  if (event.target) {
    const targetClass = target.className;
    const buttonContent = target.textContent;

    if (targetClass) {
      switch (targetClass) {
        case 'num':
          target.id ? handleDecimal() : handleNumberPressed(buttonContent);
          break;
        case 'op':
          handleOperatorPressed(buttonContent);
          break;
        case 'misc':
          handleMiscPressed(buttonContent);
          break;
        default:
          break;
      }
    }
  }
});

/* Handles highlighting button that is clicked using mousedown, mouseup, and mouseleave events */
buttonContainer.addEventListener('mousedown', (event) => {
  const target = event.target;
  target.classList.add('clicked');
})

buttonContainer.addEventListener('mouseup', (event) => {
  const target = event.target;
  if (target.classList.contains('clicked')) {
    target.classList.remove('clicked');
  }
});

buttonContainer.addEventListener('mouseout', (event) => {
  const target = event.target;
  if (target.classList.contains('clicked')) {
    target.classList.remove('clicked');
  }
});

/* Handles Keyboard events globally, for numbers and operators */
window.addEventListener('keydown', (event) => {
  const key = event.key;
  if (NUMERICAL.includes(key)) {
    handleNumberPressed(key);
  }
  else if (key === '.') {
    handleDecimalPressed();
  }
  else if (OPERATORS.includes(key)) {
    handleOperatorPressed(key);
  }
  else if (key === 'Enter') {
    handleOperatorPressed('=');
  }
  else if (key === 'C' || key === 'c' || key === 'Esc') {
    handleMiscPressed('AC');
  }
  else if (key === '%') {
    handleMiscPressed('%');
  }
  else if (key === 'Backspace') {
    handleBackspace();
  }
});