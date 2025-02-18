<script setup>
import { ref, onMounted, computed, watch } from "vue";

const todos = ref([]);
const name = ref("");

const inputContent = ref("");
const inputCategory = ref(null);

const todos_asc = computed(() => {
  todos.value.sort((a, b) => {
    return (b.createdAt = a.createdAt);
  });
});

const addTodo = () => {};
watch(name, (newVal) => {
  localStorage.setItem("name", newVal);
});

onMounted(() => {
  name.value = localStorage.getItem("name") || "";
});
</script>

<template>
  <main>
    <section>
      <h2>
        wats'up, <input type="text" placeholder="Name here" v-model="name" />
      </h2>
    </section>
    <section>
      <h3>Create a ToDo</h3>
      <form @submit.prevent="addTodo">
        <h4>What's on your todo list?</h4>
        <input
          type="text"
          placeholder="e.g. make a video"
          v-model="inputContent"
        />
        <h4>Pick a category</h4>
        {{ inputContent }}
      </form>
    </section>
  </main>
</template>

<style scoped></style>
