const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const express = require("express");
// app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.use(express.static("public"));

http.listen(3001, () => {
  console.log("listening on 3001");
});

let users = [];

io.on("connection", (socket) => {
  console.log("user connected");
  // console.log("ip: " + socket.request.connection.remoteAddress);
  // console.log("user-agent: " + socket.request.headers["user-agent"]);
  // socket.on("disconnect", () => {
  //   console.log("disconnected");
  // });

  socket.on("setUsername", (data) => {
    if (users.indexOf(data) > -1) {
      users.push(data);
      socket.emit("userSet", { username: data });
    } else {
      socket.emit(
        "userExists",
        data + " username is taken. Please try another."
      );
    }
  });

  socket.on("typing", (data) => {
    // console.log("typing registered");
    io.emit("typing", data);
  });

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
  });

  // io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
  // });
});
