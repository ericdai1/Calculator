// Global constants 
const MAX_DISPLAY_DIGITS = 8;
const NUMERICAL = '0123456789';
const OPERATORS = '/*+-';
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

// Helper functions
/* Handles string manipulation to display up to an 8 digit value as the result */
function displayNewValue() {
  let valueWithSign = (isCurrNegative && currValue !== 0) ? NEGATIVE + currValue.toString() : currValue.toString();
  let displayedValue = valueWithSign.slice(0, MAX_DISPLAY_DIGITS);
  resultDisplay.textContent = displayedValue;
}

/* Handles any numerical addition to the display, such as 0-9 or . */
function handleNumberPressed(target) {
  let textContent = target.textContent;

  if (textContent === '.') {
    handleDecimal();
  }
  else if (NUMERICAL.includes(textContent)) {
    currValue *= 10;
    currValue += parseInt(textContent);
  }
  else {
    throw new Error("Numerical button pressed but text content is not numerical")
  }

  displayNewValue();
}

function handleDecimal() {
  /* TODO */
}

/* Handles what happens to the result display when an operator button is pressed, including if there's an active operator */
function handleOperatorPressed(target) {
  let targetId = target.id;

  if (OPERATORS.includes(targetId)) {
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
    if (targetId !== '=') {
      activeOperator = targetId;
      prevValue = currValue;
      currValue = 0;
    }
    else {
      activeOperator = '';
    }
  }
  else {
    throw new Error('Invalid id for operator button');
  }
}

/* Handle all three types of miscellaneous buttons, like AC, +/-, and % */
function handleMiscPressed(target) {
  let targetId = target.id;
  
  switch (targetId) {
    case 'ac':
      clearAll();
      break;
    case 'plus-minus':
      isCurrNegative = isCurrNegative ? false : true;
      break;
    case 'modulo':
      currValue /= MODULO_FACTOR;
      break;
    default:
      throw new Error('Invalid id for miscellaneous button');
  }

  displayNewValue();
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

    if (targetClass) {
      switch (targetClass) {
        case 'num':
          handleNumberPressed(target);
          break;
        case 'op':
          handleOperatorPressed(target);
          break;
        case 'misc':
          handleMiscPressed(target);
          break;
        default:
          throw new Error('Invalid target class for a button click event.');
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