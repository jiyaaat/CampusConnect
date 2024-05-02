import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { backendUrl } from "../exports";
import Navbar from "../Components/Navbar";

const Chat = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState(""); // State for user image
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `${backendUrl}userprofile/profile?userId=${chatId}`
        );
        const data = await response.json();
        setUserName(data.userProfile.name);
        setUserImage(data.userProfile.image_url); // Set user image URL
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [chatId]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `${backendUrl}messaging?userId=${localStorage.getItem(
          "userId"
        )}&receiverId=${chatId}`
      );
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") {
      setEmpty(true);
    } else {
      try {
        const response = await fetch(`${backendUrl}messaging/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userId"),
            receiverId: chatId,
            content: newMessage,
          }),
        });
        if (response.ok) {
          setNewMessage("");
          fetchMessages();
        } else {
          console.error("Failed to send message:", response.statusText);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="chat-page">
        <div className="heading">
          {userImage && <img src={userImage} alt={userName} className="user-image"/>} {/* Display user image */}
          <h2>{userName}</h2>
        </div>
        <div className="maincontent">
          <div className="messages-container">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.sender_id.toString() ===
                  localStorage.getItem("userId").toString()
                    ? "sent"
                    : "received"
                }`}
              >
                <p>{message.content}</p>
              </div>
            ))}
          </div>

          <div className="input-container">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            {empty && <p className="error">Message cannot be empty</p>}
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
