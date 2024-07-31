import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, getAllMessagesRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, currentUser, socket }) {
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();
    const [arrivalMessage, setArrivalMessage] = useState(null);
  
    // Check if currentUser and currentChat are defined before making requests
    useEffect(() => {
      const fetchMessages = async () => {
        if (currentChat && currentUser && currentUser._id && currentChat._id) {
          try {
            const response = await axios.post(getAllMessagesRoute, {
              from: currentUser._id,
              to: currentChat._id,
            });
            setMessages(response.data);
          } catch (error) {
            console.error("Failed to fetch messages", error);
          }
        }
      };
  
      fetchMessages();
    }, [currentChat, currentUser]);
  
    const handleSendMsg = async (msg) => {
      if (currentChat && currentUser && currentUser._id && currentChat._id) {
        socket.current.emit("send-msg", {
          to: currentChat._id,
          from: currentUser._id,
          msg,
        });
  
        await axios.post(sendMessageRoute, {
          from: currentUser._id,
          to: currentChat._id,
          message: msg,
        });
  
        setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
      } else {
        console.error("Error: currentChat or currentUser is not defined.");
      }
    };
  
    useEffect(() => {
      if (socket.current) {
        socket.current.on("msg-recieve", (msg) => {
          setArrivalMessage({ fromSelf: false, message: msg });
        });
  
        return () => {
          socket.current.off("msg-recieve"); // Cleanup listener for socket
        };
      }
    }, [socket]);
  
    useEffect(() => {
      arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);
  
    useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
  
    return (
      <>
        {currentChat && currentUser ? (
          <Container>
            <div className="chat-header">
              <div className="user-details">
                <div className="avatar">
                  <img
                    src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                    alt=""
                  />
                </div>
                <div className="username">
                  <h3>{currentChat.username}</h3>
                </div>
              </div>
              <Logout />
            </div>
            <div className="chat-messages">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div ref={scrollRef} key={uuidv4()}>
                    <div
                      className={`message ${
                        message.fromSelf ? "sended" : "recieved"
                      }`}
                    >
                      <div className="content">
                        <p>{message.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No messages yet</p>
              )}
            </div>
            <ChatInput handleSendMsg={handleSendMsg} />
          </Container>
        ) : (
          <Container>
            <p>Select a chat to start messaging</p>
          </Container>
        )}
      </>
    );
  }

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
