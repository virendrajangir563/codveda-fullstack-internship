import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5003");

function App() {

  // =========================
  // States
  // =========================

  const [onlineUsers, setOnlineUsers] = useState([]);

  const [connected, setConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connecting");

  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [privateMessage, setPrivateMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const [typingUser, setTypingUser] = useState("");
  const [error, setError] = useState("");

  // Typing timer
  const typingTimer = useRef(null);

  // Room
  const room = "room123";


  // =========================
  // Socket Events
  // =========================

  useEffect(() => {

    // Connected
   socket.on("connect", () => {

  console.log("Connected:", socket.id);

  setConnected(true);
  setConnectionStatus("connected");

});

    // Disconnected
    socket.on("disconnect", (reason) => {

  console.log("Disconnected:", reason);

  setConnected(false);
  setConnectionStatus("disconnected");

});

  //connecting

  socket.io.on("reconnect_attempt", () => {

  console.log("Trying to reconnect...");

  setConnectionStatus("connecting");

});

//reconnect
socket.io.on("reconnect", (attempt) => {

  console.log(
    "Reconnected after attempts:",
    attempt
  );

  setConnected(true);
  setConnectionStatus("connected");

});

// reconnect failed

socket.io.on("reconnect_failed", () => {

  console.log("Reconnection failed");

  setConnectionStatus("disconnected");

});

    // Receive normal message
    socket.on("receiveMessage", (data) => {

      setMessages((previousMessages) => [
        ...previousMessages,
        data
      ]);

    });


    // User joined
    socket.on("userJoined", (data) => {

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          type: "system",
          message: `${data.username} joined the chat`
        }
      ]);

    });


    // User left
    socket.on("userLeft", (data) => {

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          type: "system",
          message: `${data.username} left the chat`
        }
      ]);

    });


    // Online users
    socket.on("onlineUsers", (users) => {

      setOnlineUsers(users);

    });


    // Private message
    socket.on("privateMessage", (data) => {

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          type: "private",
          username: data.username,
          message: data.message,
          time: data.time
        }
      ]);

    });


    // User typing
    socket.on("userTyping", (data) => {

      setTypingUser(data.username);

    });


    // User stopped typing
    socket.on("userStoppedTyping", () => {

      setTypingUser("");

    });


    // Cleanup
    return () => {

      socket.off("connect");

      socket.off("disconnect");

      socket.off("receiveMessage");

      socket.off("userJoined");

      socket.off("userLeft");

      socket.off("onlineUsers");

      socket.off("privateMessage");

      socket.off("userTyping");

      socket.off("userStoppedTyping");
      socket.io.off("reconnect_attempt");
      socket.io.off("reconnect");
      socket.io.off("reconnect_failed");
      clearTimeout(typingTimer.current);

    };

  }, []);


  // =========================
  // Join Chat
  // =========================

  const joinChat = (e) => {

    e.preventDefault();

    if (!username.trim()) {
      return;
    }

    socket.emit("joinRoom", {
      room,
      username
    });

    setJoined(true);

  };


  // =========================
  // Send Normal Message
  // =========================

  const sendMessage = (e) => {

  e.preventDefault();

  if (!connected) {
    setError("Server se connection nahi hai.");
    return;
  }

  if (!message.trim()) {
    setError("Message empty nahi ho sakta.");
    return;
  }

  socket.emit("sendMessage", {
    room,
    username,
    message: message.trim()
  });

  clearTimeout(typingTimer.current);

  socket.emit("stopTyping", {
    room,
    username
  });

  setMessage("");
  setError("");

};


  // =========================
  // Send Private Message
  // =========================
const sendPrivateMessage = (e) => {

  e.preventDefault();

  if (!connected) {
    setError("Server se connection nahi hai.");
    return;
  }

  if (!selectedUser) {
    setError("Pehle user select karo.");
    return;
  }

  if (!privateMessage.trim()) {
    setError("Private message empty nahi ho sakta.");
    return;
  }

  socket.emit("privateMessage", {
    toSocketId: selectedUser.socketId,
    username,
    message: privateMessage.trim()
  });

  setPrivateMessage("");
  setError("");

};


  // =========================
  // Message Typing
  // =========================

  const handleMessageChange = (e) => {

    const value = e.target.value;

    setMessage(value);

    // Empty message
    if (!value.trim()) {

      clearTimeout(typingTimer.current);

      socket.emit("stopTyping", {
        room,
        username
      });

      return;
    }


    // User is typing
    socket.emit("typing", {
      room,
      username
    });


    // Clear previous timer
    clearTimeout(typingTimer.current);


    // Stop typing after 1 second
    typingTimer.current = setTimeout(() => {

      socket.emit("stopTyping", {
        room,
        username
      });

    }, 1000);

  };


  // =========================
  // Join Screen
  // =========================

  if (!joined) {

    return (

      <div className="chat-container">

        <div className="join-box">

          <h1>Real-Time Chat</h1>

          <p>
  Status:{" "}

  {connectionStatus === "connected" &&
    "Connected 🟢"}

  {connectionStatus === "connecting" &&
    "Connecting... 🟡"}

  {connectionStatus === "disconnected" &&
    "Disconnected 🔴"}

</p>


          <form onSubmit={joinChat}>

            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />


            <button type="submit">
              Join Chat
            </button>

          </form>

        </div>

      </div>

    );

  }


  // =========================
  // Chat Screen
  // =========================

  return (

    <div className="chat-container">

      <div className="chat-box">


        {/* Header */}

        <div className="chat-header">

          <div>

            <h2>
              Real-Time Chat
            </h2>

            <p>
              Welcome, {username}
            </p>

          </div>


          <span>

  {connectionStatus === "connected" && (
    "🟢 Online"
  )}

  {connectionStatus === "connecting" && (
    "🟡 Connecting..."
  )}

  {connectionStatus === "disconnected" && (
    "🔴 Offline"
  )}

</span>

        </div>


        {/* Online Users */}

        <div className="online-users">

          <h3>
            Online Users ({onlineUsers.length})
          </h3>


          {onlineUsers.map((user) => (

            <p
              key={user.socketId}
              onClick={() =>
                setSelectedUser(user)
              }
              className="online-user"
            >

              🟢 {user.username}

            </p>

          ))}

        </div>


        {/* Messages */}

        <div className="messages">

          {error && (
  <p className="error-message">
    ⚠️ {error}
  </p>
)}

          {messages.length === 0 ? (

            <p className="no-message">
              No messages yet...
            </p>

          ) : (

            messages.map((item, index) => (

              <div
                key={index}
                className={
                  item.type === "system"
                    ? "system-message"
                    : item.type === "private"
                      ? "private-message"
                      : "message"
                }
              >

                {item.type === "system" ? (

                  <p>
                    {item.message}
                  </p>

                ) : (

                  <>

                    <strong>
                      {item.username}
                    </strong>

                    <p>
                      {item.message}
                    </p>

                    <small>
                      {item.time}
                    </small>

                  </>

                )}

              </div>

            ))

          )}

        </div>


        {/* Typing Indicator */}

        {typingUser && (

          <p className="typing-indicator">

            {typingUser} is typing...

          </p>

        )}


        {/* Private Message */}

        {selectedUser && (

          <form
            className="private-message-form"
            onSubmit={sendPrivateMessage}
          >

            <p>

              Private message to:

              <strong>
                {" "}
                {selectedUser.username}
              </strong>

            </p>


            <div className="private-input">

              <input
                type="text"
                placeholder="Private message..."
                value={privateMessage}
                onChange={(e) =>
                  setPrivateMessage(e.target.value)
                }
              />


              <button type="submit">
                Send Private
              </button>

            </div>

          </form>

        )}


        {/* Normal Message Form */}

        <form
          className="message-form"
          onSubmit={sendMessage}
        >

          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={handleMessageChange}
          />


         <button
  type="submit"
  disabled={!connected}
>
  Send
</button>

        </form>

      </div>

    </div>

  );

}

export default App;