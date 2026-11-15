const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;
const mongoURL = process.env.MONGO_URL || "mongodb://mongodb-service:27017/chatdb";

mongoose.connect(mongoURL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

const messageSchema = new mongoose.Schema({
  username: String,
  text: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model("Message", messageSchema);

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", async (socket) => {
  console.log("A user connected");

  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    socket.emit("load messages", messages);
  } catch (err) {
    console.log("Error loading messages:", err);
  }

  socket.on("chat message", async (msg) => {
    try {
      const newMessage = new Message({
        username: msg.username,
        text: msg.text
      });

      const savedMessage = await newMessage.save();
      io.emit("chat message", savedMessage);
    } catch (err) {
      console.log("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});