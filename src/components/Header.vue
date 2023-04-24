<template>
  <header class="flex justify-between bg-gray-600 text-white px-32 py-5">
    <section class="flex gap-2 bg-gray-800 px-2 py-1 rounded-md">
      <CircleStackIcon class="h-5 w-5 text-yellow-500" />
      <p>{{ score }}</p>
    </section>
    <section class="flex gap-2">
      <HeartIcon v-for="i in life" :key="i" class="h-8 w-8 text-yellow-500 bg-gray-800 p-0.5 rounded-md" />
    </section>
  </header>
</template>

<script setup>
import {CircleStackIcon, HeartIcon} from '@heroicons/vue/24/outline'

defineProps({
  score: {
    type: Number
  },
  life: {
    type: Number
  }
})
</script>