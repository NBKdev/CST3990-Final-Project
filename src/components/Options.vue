<template>
  <section class="grid grid-cols-9 grid-rows-2 text-gray-600 font-bold text-2xl gap-4">
    <button v-for="(alphabet, index) in alphabets" :key="index" @click="handleClick(alphabet, index)" class="bg-white hover:bg-gray-600 hover:text-white p-2 text-center cursor-pointer uppercase rounded-md disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-600" :disabled="alphabet.isSelected"
    >{{ alphabet.value }}</button>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  word: {
    type: String
  },
  guess: {
    type: Array
  }
})
const emit = defineEmits(['selected'])

const alphabets = ref([])

const randomIndex = (end) => {
  return Math.floor(Math.random() * (end))
}

const getRandomAlphabets = () => {
  const alphabets = 'abcdefghijklmnopqrstuvwxyz'
  let result = []
  let noOfRandomAlphabets = 18

  // fill all the boxes with random alphabets
  for (let i = 0; i < noOfRandomAlphabets; i++) {
    let index = randomIndex(alphabets.length)
    const randomAlphabet = alphabets[index]
    result.push(randomAlphabet)
  }

  // randomly add alphabets from target word so that user can have correct alphabets too
  for (let i = 0; i < props.word.length; i++) {
    let index = randomIndex(result.length)
    result[index] = props.word[i]
  }

  return result
}

const handleClick = (alphabet, index ) => {
  alphabets.value[index].isSelected = true
  emit('selected', alphabet.value)
}

onMounted(() => {
  alphabets.value = getRandomAlphabets()

  // convert alphabets array into an array of objects to keep track of which alphabets have been selected
  alphabets.value = alphabets.value.map((item) => {
    return {
      isSelected: false,
      value: item
    }
  })
})
</script>