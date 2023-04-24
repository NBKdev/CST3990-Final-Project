<!-- <template>
  <div class="fixed z-10 inset-0 overflow-y-auto">
    <div
      class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center"
    >
      <div
        class="fixed inset-0 transition-opacity bg-gray-200/20"
      ></div>

      <div
        class="inline-block max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 shadow-xl rounded-lg"
      >
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left text-gray-200">
          <slot />
        </div>

        <div class="mt-5 sm:mt-6">
          <span class="flex w-full rounded-md shadow-sm">
            <button
              @click="emit('cancel')"
              type="button"
              class="inline-flex justify-center w-1/2 px-4 py-2 text-base font-medium text-gray-200 transition duration-150 ease-in-out border border-gray-300 rounded-l-md hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-50 active:text-gray-800"
            >
              Cancel
            </button>
            <button
              @click="emit('ok')"
              type="button"
              class="inline-flex justify-center w-1/2 px-4 py-2 text-base font-medium text-white transition duration-150 ease-in-out bg-yellow-600 border border-transparent rounded-r-md hover:bg-yellow-500 focus:outline-none focus:shadow-outline-blue focus:border-yellow-700 active:bg-yellow-700"
            >
              OK
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template> -->

<template>
  <div class="fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
      <div class="fixed inset-0 bg-gray-900/50"></div>
      <div
        class="z-50 inline-block max-w-md p-6 overflow-hidden text-center bg-gray-200 rounded-lg shadow-md"
      >
        <slot />

        <div class="mt-5">
          <button
            v-if="showCancel"
            @click="emit('cancel')"
            class="inline-block w-24 py-2 mr-4 text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            @click="emit('ok')"
            class="inline-block w-24 py-2 text-white bg-gray-600 rounded-lg shadow-md hover:bg-gray-500"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  showCancel: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(["ok", "cancel"]);
</script>

<style>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
