# Calculator
Keyboard Controls:
- Backspace => Removes last digit on the display
- Esc => AC - Clears display
- c or C => AC - Clears display
- Everything else typed will match with what is on each button if applicable

FINISHED: 
1) Basic structure using DOM manipulation or HTML, + CSS:
  - Main container, with the first element being a large text area
  - Buttons and their unique colors
  - Correct layout and text content

2) Button logic - Basics: 
  - Highlight w/ new color on mouse down
  - Number buttons - event listeners to detect a click, update main text content
  - Add operations (+, -, *, /, =) - event listeners to handle logic and set bool flags
  - AC event handler to clear text content and flags
  - +/- and % event handlers for altering the text
  - . to utilize decimals
  - Handle overflows

TODO:
3) Keyboard - Basics:
  - Let you type out numbers with the keyboard with event listeners for keys 0 - 9
  - Utilize main operators with keyboard, event listeners for /, *, -, +, = and checking shift key 

4) Floating point and Extra fixes - (optional):
  - Actually make decimal numbers work correctly
  - Fix the way the = button works, and pressing multiple operations in a row (should only handle one at a time)
