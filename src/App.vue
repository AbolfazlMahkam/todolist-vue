<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";

const todos = ref([]);
const name = ref("");

const inputContent = ref("");
const inputCategory = ref(null);

const addTodo = () => {
  if (inputContent.value.trim() === "" || inputCategory.value === null) {
    alert("Please fill in all fields!");
    return;
  }

  axios.post("http://localhost:3000/todos", {
    content: inputContent.value,
    category: inputCategory.value,
    done: false,
  });

  inputContent.value = "";
  inputCategory.value = null;
};

const updateTodo = (todo) => {
  axios.put(`http://localhost:3000/todos/${todo.id}`, {
    content: todo.content,
    category: todo.category,
    done: todo.done,
  });
};

const removeTodo = (todo) => {
  axios.delete(`http://localhost:3000/todos/${todo.id}`);
};

watch(name, (newVal) => {
  localStorage.setItem("name", newVal);
});

onMounted(() => {
  name.value = localStorage.getItem("name") || "";

  axios.get("http://localhost:3000/todos").then((response) => {
    todos.value = response.data;
  });
});

watch(todos, (newVal) => {
  axios.get("http://localhost:3000/todos").then((response) => {
    todos.value = response.data;
  });
});
</script>

<template>
  <main
    class="w-full h-dvh bg-slate-200 flex flex-col items-center overflow-y-scroll"
  >
    <section class="my-5">
      <h2>
        wats'up,<span class="font-bold">{{ ` ${name}` }}</span>
        <input
          class="w-full border border-gray-300 px-2 py-1 rounded-lg"
          type="text"
          placeholder="Name here"
          v-model="name"
        />
      </h2>
    </section>

    <section>
      <h3>Create a ToDo</h3>
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
          <span class="rounded-full"></span>
        </div>

        <div>
          <input
            type="text"
            :class="`${
              todo.category === 'business' ? 'text-red-500' : 'text-green-500'
            } text-white px-2 py-1 rounded-md`"
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
