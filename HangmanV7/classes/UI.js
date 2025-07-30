export class UI {
  constructor() {
    this.wordDisplay = document.getElementById("word-display") // guessed word
    this.message = document.getElementById("message") // win/loss message
    this.keyboard = document.getElementById("keyboard") // letter buttons
    this.hangmanDisplay = document.getElementById("hangman-display") // hangman graphic
    this.gameInfo = document.getElementById("game-info") // remaining guesses, difficulty, time
  }
// updates the displayed word based on user guesses
  drawWord(displayed) {
    this.wordDisplay.textContent = displayed
  }

  showMessage(msg, type = "info") {
    this.message.textContent = msg
    this.message.className = type
  }

  clearMessage() {
    this.message.textContent = ""
    this.message.className = ""
  }
//updates the remaining guesses, difficulty, and time using a template literal
  updateGameInfo(remaining, difficulty, time) {
    this.gameInfo.innerHTML = `
      <span>Remaining: ${remaining}</span> | 
      <span>Difficulty: ${difficulty.toUpperCase()}</span> | 
      <span>Time: ${time}s</span>
    `
  }
// ascii hangman drawing based on number of incorrect guesses
  drawHangman(incorrectGuesses) {
    const hangmanParts = [
      "",
      "  +---+\n      |\n      |\n      |\n      |\n      |\n=========",
      "  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========",
      "  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========",
      "  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========",
      "  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========",
      "  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========",
      "  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========",
      "  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========",
    ]

    this.hangmanDisplay.textContent = hangmanParts[incorrectGuesses] || "" // fallback if index out of range
  }
//dynamically create buttons A–Z and attaches event listeners
  createKeyboard(callback) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    this.keyboard.innerHTML = "" // clearing previous
    letters.split("").forEach((letter) => { //iterates through each letter and creates a button
      const btn = document.createElement("button") // DOM method — creates a new button element
      btn.textContent = letter
      btn.classList.add("key")
      btn.setAttribute("data-letter", letter) // custom attribute for tracking
      btn.addEventListener("click", () => callback(letter)) //sends clicked letter to callback (handleGuess)
      this.keyboard.appendChild(btn) // adds button to keyboard div
    })
  }
// updates the keyboard buttons to indicate correct or incorrect guesses
  updateKeyboard(correctGuesses, incorrectGuesses) {
    // disables and styles correct guesses cant click twice
    correctGuesses.forEach((letter) => {
      const btn = this.keyboard.querySelector(`[data-letter="${letter}"]`)
      if (btn) {
        btn.disabled = true
        btn.classList.add("correct")
      }
    })
// disables and styles incorrect guesses
    incorrectGuesses.forEach((letter) => {
      const btn = this.keyboard.querySelector(`[data-letter="${letter}"]`)
      if (btn) {
        btn.disabled = true
        btn.classList.add("incorrect")
      }
    })
  }
//briefly highlights a hint letter on the keyboard!! - like a flash on keyboard letter on page
  showHint(letter) {
    if (letter) {
      const btn = this.keyboard.querySelector(`[data-letter="${letter}"]`)
      if (btn && !btn.disabled) {
        btn.classList.add("hint")
        setTimeout(() => btn.classList.remove("hint"), 2000)
      }
    }
  }
}
