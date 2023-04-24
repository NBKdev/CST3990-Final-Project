<template>
  <section class="flex text-gray-200 font-bold text-2xl gap-4">
    <p v-for="(alphabet, index) in guess" :key="alphabet" @click="selected(index)" class="bg-gray-700 h-10 w-10 cursor-pointer rounded-md uppercase flex justify-center items-center" :class="currentAlphabetIndex === index ? 'border-gray-600 border-2 shadow-gray-400 shadow-md' : ''">{{ alphabet }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  wordLength: {
    type: Number
  },
  currentAlphabetIndex: {
    type: Number
  },
  guess: {
    type: Array
  }
})
const emit = defineEmits(['updateCurrentAlphabetIndex'])

const selected = (index) => {
  emit('updateCurrentAlphabetIndex', index)
}
</script>