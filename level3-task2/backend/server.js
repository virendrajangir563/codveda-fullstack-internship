const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Socket.io Chat Server is running"
    });
});


/* Online Users */

const onlineUsers = [];


/* Socket.io Connection */

io.on("connection", (socket) => {

    console.log("User connected:", socket.id);


    /* Typing */

    socket.on("typing", ({ room, username }) => {

        socket.to(room).emit("userTyping", {
            username
        });

    });


    /* Stop Typing */

    socket.on("stopTyping", ({ room, username }) => {

        socket.to(room).emit("userStoppedTyping", {
            username
        });

    });


    /* Join Room */

    socket.on("joinRoom", ({ room, username }) => {

        socket.join(room);

        socket.username = username;
        socket.room = room;

        onlineUsers.push({
            socketId: socket.id,
            username,
            room
        });

        console.log(`${username} joined ${room}`);

        socket.to(room).emit("userJoined", {
            username
        });

        io.to(room).emit(
            "onlineUsers",
            onlineUsers.filter(
                user => user.room === room
            )
        );

    });


    /* Private Message */

    socket.on(
        "privateMessage",
        ({ toSocketId, username, message }) => {

            io.to(toSocketId).emit("privateMessage", {
                username,
                message,
                time: new Date().toLocaleTimeString()
            });

        }
    );


    /* Normal Message */

    socket.on(
        "sendMessage",
        ({ room, username, message }) => {

            console.log(`${username}: ${message}`);

            io.to(room).emit("receiveMessage", {
                username,
                message,
                time: new Date().toLocaleTimeString()
            });

        }
    );


    /* Disconnect */

    socket.on("disconnect", () => {

        if (socket.username && socket.room) {

            console.log(
                `${socket.username} left ${socket.room}`
            );

            socket.to(socket.room).emit("userLeft", {
                username: socket.username
            });


            const index = onlineUsers.findIndex(
                user => user.socketId === socket.id
            );


            if (index !== -1) {
                onlineUsers.splice(index, 1);
            }


            io.to(socket.room).emit(
                "onlineUsers",
                onlineUsers.filter(
                    user => user.room === socket.room
                )
            );

        }

        console.log(
            "User disconnected:",
            socket.id
        );

    });

});


const PORT = 5003;

server.listen(PORT, () => {

    console.log(
        `Server is running on port ${PORT}`
    );

});