<template>
  <button
    :class="[
      'px-4 py-2 rounded-md font-medium transition-colors duration-200',
      variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
      variant === 'secondary' && 'bg-gray-200 text-gray-800 hover:bg-gray-300',
      variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700',
      variant === 'success' && 'bg-green-600 text-white hover:bg-green-700',
      disabled && 'opacity-50 cursor-not-allowed'
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
}>();
</script> 