<template>
  <div
    :class="`bg-white p-4 rounded-md shadow-md shadow-gray-400 my-2 flex justify-between items-center cursor-pointer duration-300 ${
      todo.done ? 'opacity-50' : ''
    }`"
  >
    <div class="pt-1">
      <UCheckbox
        v-model="todo.done"
        name="notifications"
        label=""
        @change="updateTodo(todo)"
      />
    </div>
    <div>
      <input
        type="text"
        :class="`bg-transparent ${
          todo.category === 'business' ? 'text-red-500' : 'text-green-500'
        } px-2 py-1 rounded-md`"
        v-model="todo.content"
        @change="updateTodo(todo)"
      />
    </div>
    <div>
      <UButton
        icon="i-heroicons-trash"
        class="duration-300 cursor-pointer"
        size="sm"
        color="red"
        square
        variant="solid"
        @click="removeTodo(todo)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Todo } from "~/types/todo";

const props = defineProps<{
  todo: Todo;
}>();

const emit = defineEmits<{
  (e: "updateTodo", todo: Todo): void;
  (e: "removeTodo", todo: Todo): void;
}>();

const updateTodo = (todo: Todo) => {
  emit("updateTodo", todo);
};

const removeTodo = (todo: Todo) => {
  emit("removeTodo", todo);
};
</script>
