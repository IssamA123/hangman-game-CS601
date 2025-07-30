import { Game } from "./classes/Game.js"
import { UI } from "./classes/UI.js"
import { Stats } from "./classes/Stats.js"
import * as Ajax from "./modules/ajax.js"

let game, ui, stats
let gameTimer
let currentDifficulty = "medium"
let currentCategory = "random"

document.addEventListener("DOMContentLoaded", () => { // game runs once DOM is loaded 
  const quoteBox = document.getElementById("quote") 
  const themeRoot = document.documentElement

  const showQuote = async () => { 
    const quote = await Ajax.fetchQuote() // get quote
    quoteBox.textContent = quote // display in quote box
  }
  // render stats with innerHTML
  const showStats = () => {
    const summary = stats.getSummary() // pull stat summary object
    const el = document.getElementById("stats") // element to update
    el.innerHTML = `
      <div><strong>Games:</strong> ${summary.gamesPlayed} | <strong>Won:</strong> ${summary.gamesWon} | <strong>Lost:</strong> ${summary.gamesLost}</div>
      <div><strong>Win Rate:</strong> ${summary.winRate}% | <strong>Current Streak:</strong> ${summary.currentStreak} | <strong>Best Streak:</strong> ${summary.bestStreak}</div>
      <div><strong>Average Time:</strong> ${summary.averageTime}s</div>
      ${summary.recentWords.length > 0 ? `<div><strong>Recent Words:</strong> ${summary.recentWords.join(", ")}</div>` : ""}
    `
  }
// using api for definition and display it
  const showDefinition = async (word) => { 
    const el = document.getElementById("definition") // target area to show definition
    try {
      const data = await Ajax.fetchDefinition(word) // fetch definition from dictionary api
      const meaning = data[0]?.meanings[0]?.definitions[0]?.definition || "No definition found."
      // chaining to access nested data
      el.textContent = `Definition: ${meaning}` // display definiton in DOM
    } catch {
      el.textContent = "Definition not available." // error if api fails
    }
  }
// select random word from words.json
  const getRandomWord = async (category) => {
    const res = await fetch("./words.json") // load word categories
    const wordData = await res.json() // parse

    let words
    if (category === "random") {
      const allWords = Object.values(wordData).flat() // combining category arrays to one
      words = allWords
    } else {
      words = wordData[category] || wordData.animals // default fallback to animals if category error/missing
    }
// filter words based on difficulty setting
    const filteredWords = words.filter((word) => {
      if (currentDifficulty === "easy") return word.length <= 6
      if (currentDifficulty === "medium") return word.length >= 5 && word.length <= 8
      if (currentDifficulty === "hard") return word.length >= 7
      return true
    })
// pick random word from list(java style math.random), fallback if empty list
    return filteredWords[Math.floor(Math.random() * filteredWords.length)] || words[0]
  }

  const updateTimer = () => {
    if (game && !game.isWon() && !game.isLost()) {
      ui.updateGameInfo(game.remainingGuesses, game.difficulty, game.getGameTime())
    }
  }
// reset state for starting new game 
  const startNewGame = async () => {
    clearInterval(gameTimer) 
    const word = await getRandomWord(currentCategory) // pick new word based on current category

    game = new Game(word, currentDifficulty) // new instance
    ui.drawWord(game.displayWord)
    ui.drawHangman(0) // reset hangman figure
    ui.clearMessage()
    ui.createKeyboard(handleGuess) // new leter buttons
    ui.updateGameInfo(game.remainingGuesses, game.difficulty, 0) // defaults
    showDefinition(word)

    gameTimer = setInterval(updateTimer, 1000) // 1 second interval timer
  }
// handles when letter guessed
  const handleGuess = (letter) => {
    if (game.isWon() || game.isLost()) return
  // class method calls
    game.guess(letter)
    ui.drawWord(game.displayWord) //redraws word with revealed letters
    ui.drawHangman(game.incorrectGuesses) // update hangeman with incorrect letters
    ui.updateKeyboard(game.correctGuesses, game.incorrectGuessedLetters) // disabling incorrect letter guesses on keyboard
    ui.updateGameInfo(game.remainingGuesses, game.difficulty, game.getGameTime())

    if (game.isWon()) {
      clearInterval(gameTimer) // if game is won, stop timer
      ui.showMessage(`You won in ${game.getGameTime()}s!`, "success")
      stats.recordWin(game.getGameTime()) // record win and time taken
      stats.addRecentWord(game.word) // recent word list
      //sends a post request with game result to placeholder API
      Ajax.postResult({ word: game.word, result: "win", time: game.getGameTime() })
      // update leaderboard with new stats
      Ajax.putLeaderboard(stats.getSummary())
    } else if (game.isLost()) {
      clearInterval(gameTimer)
      ui.showMessage(`You lost! Word was ${game.word}`, "error")
      stats.recordLoss(game.word)
      Ajax.postResult({ word: game.word, result: "loss", time: game.getGameTime() })
      Ajax.putLeaderboard(stats.getSummary())
    }

    showStats()
  }
// display hint 
  const showHint = () => {
    if (game && !game.isWon() && !game.isLost()) {
      const hint = game.getHint()
      ui.showHint(hint)
    }
  }
// instance setups
  ui = new UI()
  stats = new Stats()
  showQuote()
  showStats()
// UI interaction event listeners
  document.getElementById("resetBtn").addEventListener("click", startNewGame)
  document.getElementById("resetBtn").addEventListener("dblclick", () => location.reload())

  document.getElementById("hintBtn").addEventListener("click", showHint)

  document.getElementById("difficultySelect").addEventListener("change", (e) => {
    currentDifficulty = e.target.value
  })

  document.getElementById("categorySelect").addEventListener("change", (e) => {
    currentCategory = e.target.value
  })

  document.getElementById("definition").addEventListener("mouseover", () => {
    document.getElementById("definition").style.fontWeight = "bold"
  })

  document.getElementById("message").addEventListener("mouseenter", () => {
    document.getElementById("message").style.transform = "scale(1.1)"
  })

  document.getElementById("message").addEventListener("mouseleave", () => {
    document.getElementById("message").style.transform = "scale(1)"
  })

  document.addEventListener("keyup", (e) => {
    const letter = e.key.toUpperCase()
    if (letter.match(/[A-Z]/) && letter.length === 1) {
      handleGuess(letter)
    }
  })

  const toggleBtn = document.getElementById("toggleStats")
  toggleBtn.addEventListener("click", () => {
    const statsEl = document.getElementById("stats")
    statsEl.style.display = statsEl.style.display === "none" ? "block" : "none"
  })

  let isDark = false
  document.getElementById("toggleThemeBtn").addEventListener("click", () => {
    if (isDark) {
      themeRoot.style.setProperty("--bg-color", "#fff")
      themeRoot.style.setProperty("--text-color", "#000")
    } else {
      themeRoot.style.setProperty("--bg-color", "#000")
      themeRoot.style.setProperty("--text-color", "#fff")
    }
    isDark = !isDark
  })

  startNewGame()
})
