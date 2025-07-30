export class Game {
  constructor(word, difficulty = "medium") {
    this.word = word.toUpperCase()
    this.guessedLetters = []
    this.incorrectGuesses = 0
    this.difficulty = difficulty
    this.maxGuesses = this.getMaxGuesses(difficulty)
    this.startTime = Date.now()
  }
// max allowed incorrect guesses based on difficulty
//  kind of makes hangman visual incomplete when doing hard/medium but wanted to showcase diffic
  getMaxGuesses(difficulty) {
    switch (difficulty) {
      case "easy":
        return 8
      case "medium":
        return 6
      case "hard":
        return 4
      default:
        return 6
    }
  }
// processing a guessed letter 
  guess(letter) {
    letter = letter.toUpperCase()
    if (!this.guessedLetters.includes(letter)) {
      this.guessedLetters.push(letter)
      if (!this.word.includes(letter)) {
        this.incorrectGuesses++
      }
    }
  }

  get displayWord() {
    return this.word
      .split("")
      .map((l) => (this.guessedLetters.includes(l) ? l : "_"))
      .join(" ")
  }

  get remainingGuesses() {
    return this.maxGuesses - this.incorrectGuesses
  }

  get correctGuesses() {
    return this.guessedLetters.filter((letter) => this.word.includes(letter))
  }

  get incorrectGuessedLetters() {
    return this.guessedLetters.filter((letter) => !this.word.includes(letter))
  }

  getHint() {
    const unguessedLetters = this.word.split("").filter((letter) => !this.guessedLetters.includes(letter))
    if (unguessedLetters.length > 0) {
      return unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)]
    }
    return null
  }

  getGameTime() {
    return Math.floor((Date.now() - this.startTime) / 1000)
  }
// method — returns true if all letters have been guessed
  isWon() {
    return this.word.split("").every((l) => this.guessedLetters.includes(l))
  }
// method — returns true if max incorrect guesses has been reached
  isLost() {
    return this.incorrectGuesses >= this.maxGuesses
  }
  // method — resets the game state with a new word and difficulty
  reset(word, difficulty = "medium") {
    this.word = word.toUpperCase()
    this.guessedLetters = []
    this.incorrectGuesses = 0
    this.difficulty = difficulty
    this.maxGuesses = this.getMaxGuesses(difficulty)
    this.startTime = Date.now()
  }
}
