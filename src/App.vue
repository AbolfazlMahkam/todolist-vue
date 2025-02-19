<!-- <script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const todos = ref([]);
const inputContent = ref("");
const inputCategory = ref(null);

// Add a new todo
const addTodo = async () => {
  if (inputContent.value.trim() === "" || inputCategory.value === null) {
    alert("Please fill in all fields!");
    return;
  }
  try {
    await axios.post("http://localhost:3000/todos", {
      content: inputContent.value,
      category: inputCategory.value,
      done: false,
    });
    inputContent.value = "";
    inputCategory.value = null;
    await fetchTodos();
  } catch (error) {
    console.error("Failed to add todo:", error);
    alert("An error occurred while adding the todo.");
  }
};

// Update an existing todo
const updateTodo = async (todo) => {
  try {
    await axios.put(`http://localhost:3000/todos/${todo.id}`, {
      content: todo.content,
      category: todo.category,
      done: todo.done,
    });
    await fetchTodos();
  } catch (error) {
    console.error("Failed to update todo:", error);
    alert("An error occurred while updating the todo.");
  }
};

// Remove a todo
const removeTodo = async (todo) => {
  if (!confirm("Are you sure you want to delete this todo?")) {
    return;
  }
  try {
    await axios.delete(`http://localhost:3000/todos/${todo.id}`);
    await fetchTodos();
  } catch (error) {
    console.error("Failed to delete todo:", error);
    alert("An error occurred while deleting the todo.");
  }
};

// Fetch todos from the server
const fetchTodos = async () => {
  try {
    const response = await axios.get("http://localhost:3000/todos");
    todos.value = response.data;
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    alert("An error occurred while loading the todos.");
  }
};

// Load todos on mount
onMounted(() => {
  fetchTodos();
});
</script>

<template>
  <main
    class="w-full h-dvh bg-slate-200 flex flex-col items-center overflow-y-scroll"
  >
    <section class="mt-5">
      <h3 class="text-2xl font-bold text-center">Create a ToDo</h3>
      <form @submit.prevent="addTodo" class="my-3 w-80">
        <h4>What's on your todo list?</h4>
        <input
          class="w-full border border-gray-300 px-2 py-1 rounded-lg mb-3"
          type="text"
          placeholder="e.g. make a video"
          v-model="inputContent"
        />
        <h4>Pick a category</h4>
        <div class="flex justify-around gap-5 mt-2">
          <label
            class="bg-white p-5 flex flex-col items-center justify-center rounded-md shadow-md shadow-gray-400 cursor-pointer"
          >
            <input
              type="radio"
              name="category"
              value="business"
              v-model="inputCategory"
            />
            <span>Business</span>
          </label>
          <label
            class="bg-white p-5 flex flex-col items-center justify-center rounded-md shadow-md shadow-gray-400 cursor-pointer"
          >
            <input
              type="radio"
              name="category"
              value="personal"
              v-model="inputCategory"
            />
            <span>Personal</span>
          </label>
        </div>
        <input
          class="w-full bg-blue-500 text-white py-2 rounded-lg my-5 shadow-md shadow-gray-400 cursor-pointer"
          type="submit"
          value="Add todo"
        />
      </form>
    </section>
    <section class="w-80">
      <h3 class="text-2xl font-bold text-center">Todo List</h3>
      <div
        v-for="todo in todos"
        :key="todo.id"
        :class="`bg-white p-4 rounded-md shadow-md shadow-gray-400 my-2 flex justify-between items-center ${
          todo.done ? 'opacity-50' : ''
        }`"
      >
        <div class="pt-1">
          <input
            type="checkbox"
            v-model="todo.done"
            @change="updateTodo(todo)"
          />
        </div>
        <div>
          <input
            type="text"
            :class="`${
              todo.category === 'business' ? 'text-red-500' : 'text-green-500'
            } px-2 py-1 rounded-md`"
            v-model="todo.content"
          />
        </div>
        <div>
          <button @click="removeTodo(todo)">Delete</button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped></style> -->

<script setup lang="ts">
import { ref, onMounted } from "vue";
import io from "socket.io-client";

interface Todo {
  id: number;
  content: string;
  category: string;
  done: boolean;
}

const todos = ref<Todo[]>([]);
const inputContent = ref<string>("");
const inputCategory = ref<string | null>(null);

const socket = io("http://localhost:3000");

// Add a new todo using Socket.IO
const addTodo = (): void => {
  if (inputContent.value.trim() === "" || inputCategory.value === null) {
    alert("Please fill in all fields!");
    return;
  }

  const newTodo = {
    content: inputContent.value,
    category: inputCategory.value,
    done: false,
  };
  socket.emit("addTodo", newTodo);

  inputContent.value = "";
  inputCategory.value = null;
};

// Update an existing todo using Socket.IO
const updateTodo = (todo: Todo): void => {
  socket.emit("updateTodo", todo);
};

// Remove a todo using Socket.IO
const removeTodo = (todo: Todo): void => {
  if (!confirm("Are you sure you want to delete this todo?")) {
    return;
  }
  socket.emit("deleteTodo", todo.id);
};

// Listen for real-time updates from Socket.IO
onMounted(() => {
  socket.emit("fetchTodos");

  socket.on("todos", (fetchedTodos: Todo[]) => {
    todos.value = fetchedTodos;
  });

  socket.on("newTodo", (newTodo: Todo) => {
    todos.value.push(newTodo);
  });

  socket.on("updateTodo", (updatedTodo: Todo) => {
    const index = todos.value.findIndex((t) => t.id === updatedTodo.id);
    if (index !== -1) {
      todos.value[index] = updatedTodo;
    }
  });

  socket.on("deleteTodo", (deletedTodoId: number) => {
    todos.value = todos.value.filter((t) => t.id !== deletedTodoId);
  });
});
</script>

<template>
  <main
    class="w-full h-dvh bg-slate-200 flex flex-col items-center overflow-y-scroll"
  >
    <section class="mt-5">
      <h3 class="text-2xl font-bold text-center">Create a ToDo</h3>
      <form @submit.prevent="addTodo" class="my-3 w-80">
        <h4>What's on your todo list?</h4>
        <input
          class="w-full border border-gray-300 px-2 py-1 rounded-lg mb-3"
          type="text"
          placeholder="e.g. make a video"
          v-model="inputContent"
        />
        <h4>Pick a category</h4>
        <div class="flex justify-around gap-5 mt-2">
          <label
            class="bg-white p-5 flex flex-col items-center justify-center rounded-md shadow-md shadow-gray-400 cursor-pointer"
          >
            <input
              type="radio"
              name="category"
              value="business"
              v-model="inputCategory"
            />
            <span>Business</span>
          </label>
          <label
            class="bg-white p-5 flex flex-col items-center justify-center rounded-md shadow-md shadow-gray-400 cursor-pointer"
          >
            <input
              type="radio"
              name="category"
              value="personal"
              v-model="inputCategory"
            />
            <span>Personal</span>
          </label>
        </div>
        <input
          class="w-full bg-blue-500 text-white py-2 rounded-lg my-5 shadow-md shadow-gray-400 cursor-pointer"
          type="submit"
          value="Add todo"
        />
      </form>
    </section>
    <section class="w-80">
      <h3 class="text-2xl font-bold text-center">Todo List</h3>
      <div
        v-for="todo in todos"
        :key="todo.id"
        :class="`bg-white p-4 rounded-md shadow-md shadow-gray-400 my-2 flex justify-between items-center ${
          todo.done ? 'opacity-50' : ''
        }`"
      >
        <div class="pt-1">
          <input
            type="checkbox"
            v-model="todo.done"
            @change="updateTodo(todo)"
          />
        </div>
        <div>
          <input
            type="text"
            :class="`${
              todo.category === 'business' ? 'text-red-500' : 'text-green-500'
            } px-2 py-1 rounded-md`"
            v-model="todo.content"
          />
        </div>
        <div>
          <button @click="removeTodo(todo)">Delete</button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
