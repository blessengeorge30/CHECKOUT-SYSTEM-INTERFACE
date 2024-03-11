const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const port = 3001;

app.use(cors());
const arduinoPort = new SerialPort({ path: "COM8", baudRate: 9600 });
const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: "\r\n" }));

parser.on("data", (data) => {
  const weight = data;
  console.log(weight);
  io.emit("weightUpdate", weight);
});

io.on("connection", (socket) => {
  console.log("A client connected");

  socket.on("fetchWeight", () => {
    try {
      console.log("msg received from client");
      arduinoPort.write("W", (err) => {
        if (err) {
          console.error("Error sending message:", err);
        } else {
          console.log("Message sent successfully:");
        }
      });
    } catch (error) {
      console.error("Error reading value:", error);
      io.emit("weightError", { error: "Error reading value" });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
