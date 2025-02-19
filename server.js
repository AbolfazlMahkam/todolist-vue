import http from "http";
import { Server } from "socket.io";
import axios from "axios";

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const JSON_SERVER_URL = "http://localhost:3001/todos";

io.on("connection", (socket) => {
  socket.on("fetchTodos", async () => {
    try {
      const response = await axios.get(JSON_SERVER_URL);
      socket.emit("todos", response.data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  });

  socket.on("addTodo", async (newTodo) => {
    try {
      const response = await axios.post(JSON_SERVER_URL, newTodo);
      io.emit("newTodo", response.data);
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  });

  socket.on("updateTodo", async (updatedTodo) => {
    try {
      await axios.put(`${JSON_SERVER_URL}/${updatedTodo.id}`, updatedTodo);
      io.emit("updateTodo", updatedTodo);
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  });

  socket.on("deleteTodo", async (id) => {
    try {
      await axios.delete(`${JSON_SERVER_URL}/${id}`);
      io.emit("deleteTodo", id);
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Socket.IO server is running on port 3000");
});
