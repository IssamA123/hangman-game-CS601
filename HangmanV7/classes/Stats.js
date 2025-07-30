export class Stats {
  constructor() {
    const stored = JSON.parse(localStorage.getItem("hangmanStats"))
    this.gamesPlayed = stored?.gamesPlayed || 0
    this.gamesWon = stored?.gamesWon || 0
    this.gamesLost = stored?.gamesLost || 0
    this.currentStreak = stored?.currentStreak || 0
    this.bestStreak = stored?.bestStreak || 0
    this.totalTime = stored?.totalTime || 0
    this.recentWords = stored?.recentWords || []
  }

  recordWin(gameTime) {
    this.gamesPlayed++
    this.gamesWon++
    this.currentStreak++
    this.totalTime += gameTime
    if (this.currentStreak > this.bestStreak) {
      this.bestStreak = this.currentStreak
    }
    this._save()
  }

  recordLoss(word) {
    this.gamesPlayed++
    this.gamesLost++
    this.currentStreak = 0
    this.addRecentWord(word)
    this._save()
  }

  addRecentWord(word) {
    this.recentWords.unshift(word)
    if (this.recentWords.length > 5) {
      this.recentWords.pop()
    }
  }

  getWinRate() {
    return this.gamesPlayed > 0 ? Math.round((this.gamesWon / this.gamesPlayed) * 100) : 0
  }

  getAverageTime() {
    return this.gamesWon > 0 ? Math.round(this.totalTime / this.gamesWon) : 0
  }

  getSummary() {
    return {
      gamesPlayed: this.gamesPlayed,
      gamesWon: this.gamesWon,
      gamesLost: this.gamesLost,
      currentStreak: this.currentStreak,
      bestStreak: this.bestStreak,
      winRate: this.getWinRate(),
      averageTime: this.getAverageTime(),
      recentWords: this.recentWords,
    }
  }

  _save() {
    localStorage.setItem(
      "hangmanStats",
      JSON.stringify({
        gamesPlayed: this.gamesPlayed,
        gamesWon: this.gamesWon,
        gamesLost: this.gamesLost,
        currentStreak: this.currentStreak,
        bestStreak: this.bestStreak,
        totalTime: this.totalTime,
        recentWords: this.recentWords,
      }),
    )
  }
}
