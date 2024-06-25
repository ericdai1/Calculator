// Global constants 
const MAX_DISPLAY_DIGITS = 10;
const NUMERICAL = '0123456789';
const OPERATORS = '/*+-=';
const NEGATIVE = '-';
const MODULO_FACTOR = 100;
const buttonContainer = document.querySelector('.button-container');
const resultDisplay = document.querySelector('.result-display');

const keyboardToButtonIdMap = {
  '0': 'zero',
  '1': 'one',
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
  '7': 'seven',
  '8': 'eight',
  '9': 'nine',
  '.': 'decimal',
  '/': 'divide',
  '*': 'multiply',
  '+': 'add',
  '-': 'subtract',
  '=': 'equal',
  'Enter': 'equal',
  'c': 'ac',
  'C': 'ac',
  'Escape': 'ac',
  '%': 'modulo'
}

const shiftButtonIds = ['add', 'multiply', 'modulo'];
const pressedButtons = new Set();

// Global variables
let prevValue = 0;
let currValue = 0;
let activeOperator = '';

// Boolean flags
let isPrevNegative = false;
let isCurrNegative = false;
let didOperatorJustGetPressed = false;
let hasTrailingDecimal = false; 
let digitsPastDecimal = 0;

// Helper functions
/* Handles string manipulation to display up to an 8 digit value as the result */
function displayNewValue() {
  let floatValue = digitsPastDecimal > 1 ? currValue.toFixed(digitsPastDecimal - 1) : currValue;
  let valueWithSign = (isCurrNegative && floatValue !== 0) ? NEGATIVE + floatValue.toString() : floatValue.toString();
  let valueWithDecimal = hasTrailingDecimal ? valueWithSign + '.' : valueWithSign;
  let displayedValue = valueWithDecimal.slice(0, MAX_DISPLAY_DIGITS);
  
  resultDisplay.textContent = displayedValue;
}

/* Handles any numerical addition to the display, such as 0-9 or . */
function handleNumberPressed(target) {
  if (didOperatorJustGetPressed) {
    didOperatorJustGetPressed = false;
  } 

  if (hasTrailingDecimal) {
    hasTrailingDecimal = false;
  }

  let number = target.textContent;
  if (NUMERICAL.includes(number)) {
    if (digitsPastDecimal > 0) {
      // Floating point logic
      hasTrailingDecimal = false;
      let decimalValue = parseInt(number) / Math.pow(10, digitsPastDecimal);
      currValue += decimalValue;
      digitsPastDecimal += 1;
    }
    else {
      currValue *= 10;
      currValue += parseInt(number);
    }

    displayNewValue();  
  }
  else {
    throw new Error('Invalid id for numerical button');
  }
}

/* Add a decimal */
function handleDecimalPressed() {
  if (digitsPastDecimal === 0) {
    hasTrailingDecimal = true;
    digitsPastDecimal += 1;

    displayNewValue();
  }
}

/* Handles what happens to the result display when an operator button is pressed, including if there's an active operator */
function handleOperatorPressed(target) {
  // In the case an operator like * or + get pressed multiple times in a row, both sides of the operator become the previous value
  if (didOperatorJustGetPressed) {
      currValue = prevValue;
  }

  let operator = target.textContent;
  if (OPERATORS.includes(operator)) {
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
      hasTrailingDecimal = false;
      digitsPastDecimal = 0;
      currValue = 0;
    }
    else {
      activeOperator = '';
      didOperatorJustGetPressed = false;
    }
  }
  else {
    throw new Error('Invalid id for operator button');
  }
}

/* Handle all three types of miscellaneous buttons, like AC, +/-, and % */
function handleMiscPressed(target) {
  if (didOperatorJustGetPressed) {
    didOperatorJustGetPressed = false;
  }

  let miscValue = target.textContent;
  
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

/* Removes the last digit of the result, including a decimal if applicable */
function handleBackspace() {
  if (hasTrailingDecimal) {
    hasTrailingDecimal = false;
    digitsPastDecimal = 0;
  }
  else if (currValue) {
    if (digitsPastDecimal > 1) {
      // Since we remove from the end, in the case we remove back to where there's just a decimal point and nothing after, we set the trailing flag
      digitsPastDecimal -= 1;
      if (digitsPastDecimal === 1) {
        hasTrailingDecimal = true;
      }
    }

    let currValueAsStr = currValue.toString();
    currValue = currValueAsStr.length === 1 ? 0 : parseFloat(currValueAsStr.slice(0, currValueAsStr.length - 1));

    if (digitsPastDecimal > 1) {
      currValue = parseFloat(currValue.toFixed(digitsPastDecimal - 1));
    }
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
  didOperatorJustGetPressed = false;
  hasTrailingDecimal = false;
  digitsPastDecimal = 0;
}

/* Main function that handles all cases for each type of button, entering from a click or a keyboard key press */
function performButtonOperationForTarget(target) {
  const targetClass = target.classList[0];

  if (targetClass) {
    switch (targetClass) {
      case 'num':
        target.id === 'decimal' ? handleDecimalPressed() : handleNumberPressed(target);
        break;
      case 'op':
        handleOperatorPressed(target);
        break;
      case 'misc':
        handleMiscPressed(target);
        break;
      default:
        break;
    }
  }
}

// Event handlers
/* The following event listener handles any clicks that occur, using a switch statement to determine which helper function to
call depending on if the clicked button is a number, operator, or others */
buttonContainer.addEventListener('click', (event) => {
  const target = event.target;
  if (event.target) {
    performButtonOperationForTarget(target);
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

  if (key in keyboardToButtonIdMap) {
    let buttonId = keyboardToButtonIdMap[key];
    const targetButton = document.querySelector(`#${buttonId}`);

    // Prevent Enter key from its default action of repeating any 'chosen' or 'highlighted' button, and just act as a = button
    if (key === 'Enter') {
      event.preventDefault();
    }

    if (targetButton) {
      // Remove highlight from all other pressed keys
      pressedButtons.forEach((pressedButton) => {
        pressedButton.classList.remove('pressed');
      })

      pressedButtons.clear();
      
      targetButton.classList.add('pressed'); 
      pressedButtons.add(targetButton);
      performButtonOperationForTarget(targetButton);
    }
  }
  else if (key === 'Backspace') {
    handleBackspace();
  }
});

/* Only used to handle the highlighting of the button that represents the pressed down key */
window.addEventListener('keyup', (event) => {
  const key = event.key;

  if (key in keyboardToButtonIdMap) {
    let buttonId = keyboardToButtonIdMap[key];
    const targetButton = document.querySelector(`#${buttonId}`);

    if (targetButton) {
      targetButton.classList.remove('pressed');
    }
  }
  else if (key === 'Shift') {
    shiftButtonIds.forEach((buttonId) => {
      const targetButton = document.querySelector(`#${buttonId}`);

      if (targetButton.classList.contains('pressed')) {
        targetButton.classList.remove('pressed')
        pressedButtons.clear();
      }
    })
  }
});