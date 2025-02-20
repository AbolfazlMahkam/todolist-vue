<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#imports";
import type { Todo } from "~/types/todo";

declare module "#imports" {
  interface NuxtApp {
    $socket: {
      emit: (event: string, ...args: any[]) => void;
      on: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

const todos = ref<Todo[]>([]);
const inputContent = ref<string>("");
const inputCategory = ref<string | undefined>(undefined);

// Access the Socket.IO instance
const { $socket } = useNuxtApp();

// Add a new todo using Socket.IO
const addTodo = (): void => {
  if (inputContent.value.trim() === "" || !inputCategory.value) {
    alert("Please fill in all fields!");
    return;
  }

  const newTodo = {
    content: inputContent.value,
    category: inputCategory.value,
    done: false,
  };

  $socket.emit("addTodo", newTodo);
  inputContent.value = "";
  inputCategory.value = undefined;
};

// Update an existing todo using Socket.IO
const updateTodo = (todo: Todo): void => {
  $socket.emit("updateTodo", todo);
};

// Remove a todo using Socket.IO
const removeTodo = (todo: Todo): void => {
  if (!confirm("Are you sure you want to delete this todo?")) {
    return;
  }
  $socket.emit("deleteTodo", todo.id);
};

// Listen for real-time updates from Socket.IO
onMounted(() => {
  $socket.emit("fetchTodos");

  $socket.on("todos", (fetchedTodos: Todo[]) => {
    todos.value = fetchedTodos;
  });

  $socket.on("newTodo", (newTodo: Todo) => {
    todos.value.push(newTodo);
  });

  $socket.on("updateTodo", (updatedTodo: Todo) => {
    const index = todos.value.findIndex((t) => t.id === updatedTodo.id);
    if (index !== -1) {
      todos.value[index] = updatedTodo;
    }
  });

  $socket.on("deleteTodo", (deletedTodoId: number) => {
    todos.value = todos.value.filter((t) => t.id !== deletedTodoId);
  });
});
</script>

<template>
  <main
    class="w-full h-dvh bg-slate-300 flex flex-col items-center overflow-y-scroll"
  >
    <section class="mt-5">
      <h3 class="text-2xl font-bold text-center text-black">Create a ToDo</h3>
      <form @submit.prevent="addTodo" class="my-3 w-80">
        <h4 class="text-black">What's on your todo list?</h4>
        <UInput
          color="gray"
          class="text-black mt-1"
          variant="outline"
          type="text"
          size="lg"
          placeholder="e.g. make a video"
          v-model="inputContent"
        />
        <h4 class="text-black mt-5">Pick a category</h4>
        <div class="flex justify-around gap-5 mt-2">
          <URadio
            class="bg-white p-5 rounded-md shadow-md shadow-gray-400 cursor-pointer hover:shadow-gray-500 duration-300"
            name="category"
            value="business"
            v-model="inputCategory"
          >
            <template #label>
              <span class="italic text-red-500 cursor-pointer">Business</span>
            </template>
          </URadio>

          <URadio
            class="bg-white p-5 rounded-md shadow-md shadow-gray-400 cursor-pointer hover:shadow-gray-500 duration-300"
            name="category"
            value="personal"
            v-model="inputCategory"
          >
            <template #label>
              <span class="italic text-green-500 cursor-pointer">Personal</span>
            </template>
          </URadio>
        </div>
        <UButton
          block
          color="blue"
          variant="solid"
          class="text-white py-3 rounded-lg my-5 shadow-md shadow-gray-400 hover:shadow-gray-500 duration-300"
          type="submit"
          value="Add todo"
        >
          <span class="text-white text-[15px]">Add todo</span>
        </UButton>
      </form>
    </section>
    <section class="w-80">
      <h3 class="text-2xl font-bold text-center text-black mb-5 mt-8">
        Todo List
      </h3>
      <div v-for="todo in todos" :key="todo.id">
        <Todo :todo="todo" @updateTodo="updateTodo" @removeTodo="removeTodo" />
      </div>
    </section>
  </main>
</template>

<style scoped></style>
