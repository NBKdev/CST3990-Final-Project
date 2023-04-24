<template>
  <section class="grid grid-cols-2 grid-rows-2 gap-2 bg-gray-700 p-2 rounded-md w-1/2 mx-auto shadow-gray-400 shadow-md">
    <img v-for="(url, index) in imageURLs" :key="index" class="object-cover w-full h-64" :src="url" />
  </section>
</template>

<script setup>
defineProps({
  imageURLs: {
    type: Array
  }
})
</script>