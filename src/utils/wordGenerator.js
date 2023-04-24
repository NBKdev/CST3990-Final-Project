import { EASY, MEDIUM, HARD } from "../data/words";

const randomIndex = (end) => {
  return Math.floor(Math.random() * (end))
}

export const generate = (level) => {
  let word = ""
  if (level === 'EASY') {
    let index = randomIndex(EASY.length)
    word = EASY[index]
  }
  if (level === 'MEDIUM') {
    let index = randomIndex(MEDIUM.length)
    word = MEDIUM[index]
  }
  if (level === 'HARD') {
    let index = randomIndex(HARD.length)
    word = HARD[index]
  }

  return word.toLocaleLowerCase()
}