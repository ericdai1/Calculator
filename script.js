// Global constants 
const MAX_DISPLAY_DIGITS = 8;
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
function handleNumberPressed() {

}

function handleOperatorPressed() {

}

function handleMiscPressed() {
  
}

// Event handlers
/* The following event listener handles any clicks that occur, using a switch statement to determine which helper function to
call depending on if the clicked button is a number, operator, or others */
buttonContainer.addEventListener('click', (event) => {
  if (event.target) {
    let targetClass = event.target.className;

    if (targetClass) {
      switch (targetClass) {
        case 'num':
          handleNumberPressed();
          break;
        case 'op':
          handleOperatorPressed();
          break;
        case 'misc':
          handleMiscPressed();
          break;
        default:
          throw new Error('Invalid target class for a button click event.');
      }
    }
  }
});