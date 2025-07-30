// fetch definition by feeding word into dictionary api
export const fetchDefinition = (word) =>
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`).then((res) => res.json()) // convert to json
// fetch random quote from quotes.json
export async function fetchQuote() {
  const res = await fetch("quotes.json")
  const data = await res.json() // parse
  return data[Math.floor(Math.random() * data.length)] //return random quote
}
// fetch random word from all categories in words.json
export async function fetchWord() {
  const res = await fetch("words.json")
  const data = await res.json()
  const allWords = Object.values(data).flat()
  return allWords[Math.floor(Math.random() * allWords.length)]
}
// send a POST request to simulate saving the game result to a server -- not really server in this build all localstorage hmm.
export const postResult = (result) =>
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result),
  })
// Sends a PUT request to simulate updating leaderboard data -- not actually a leaderboard data
// didnt feel comfortable actually hooking up a backend to save.... not confident/experienced enough?
export const putLeaderboard = (data) =>
  fetch("https://jsonplaceholder.typicode.com/posts/1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
