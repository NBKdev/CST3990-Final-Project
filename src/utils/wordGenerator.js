import { EASY, MEDIUM, HARD, ENGLISH, GEOGRAPHY, MATHEMATICS, PE, } from "../data/words";

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
  if (level === 'ENGLISH') {
    let index = randomIndex(ENGLISH.length)
    word = ENGLISH[index]
  }
  if (level === 'GEOGRAPHY') {
    let index = randomIndex(GEOGRAPHY.length)
    word = GEOGRAPHY[index]
  }
  if (level === 'MATHEMATICS') {
    let index = randomIndex(MATHEMATICS.length)
    word = MATHEMATICS[index]
  }
  if (level === 'PE') {
    let index = randomIndex(PE.length)
    word = PE[index]
  }


  return word.toLocaleLowerCase()
}