<script setup lang="ts">
import { computed } from 'vue'

const colorMode = useColorMode()

const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
</script>

<template>
  <ClientOnly>
    <UButton
      :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
      color="gray"
      variant="ghost"
      aria-label="Theme"
      @click="isDark = !isDark"
      class="text-xl hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
    />
    <template #fallback>
      <div class="w-8 h-8 flex items-center justify-center">
        <div class="w-5 h-5 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
      </div>
    </template>
  </ClientOnly>
</template>