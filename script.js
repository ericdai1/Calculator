// Global constants 
const MAX_DISPLAY_DIGITS = 8;
const NUMERICAL = '0123456789';
const buttonContainer = document.querySelector('.button-container');
const resultDisplay = document.querySelector('.result-display');

// Global variables
let prevValue = 0;
let activeOperator = '';
let currValue = 0;

// Boolean flags
/* TODO later */
let prevNegative = false;
let negative = false;
let decimal = false; 

// Helper functions
/* Handles any numerical addition to the display, such as 0-9 or . */
function handleNumberPressed(target) {
  let textContent = target.textContent;

  if (textContent === '.') {
    handleDecimal();
  }
  else if (NUMERICAL.includes(textContent)) {
    currValue *= 10;
    currValue += parseInt(textContent);

    let displayedValue = currValue.toString().slice(0, MAX_DISPLAY_DIGITS);
    resultDisplay.textContent = displayedValue;
  }
  else {
    throw new Error("Numerical button pressed but text content is not numerical.")
  }
}

function handleDecimal() {
  /* TODO */
}

function handleOperatorPressed(target) {

}

function handleMiscPressed(target) {
  
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