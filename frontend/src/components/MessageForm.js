import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import './MessageForm.css';
import io from 'socket.io-client';

const socket = io('http://localhost:5001'); // La URL debe coincidir con la del servidor

function MessageForm() {
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user);
  const { socket, currentRoom, setMessages, messages, privateMemberMsg } = useContext(AppContext);
  const messageEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${month}/${day}/${year}`;
  }

  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const todayDate = getFormattedDate();

  socket.off("room-messages").on("room-messages", (roomMessages) => {
    setMessages(roomMessages);
    scrollToBottom(); // Asegurar que el desplazamiento ocurra después de actualizar los mensajes

  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message) return;
    const today = new Date();
    const minutes = today.getMinutes().toString().padStart(2, "0");
    const time = `${today.getHours()}:${minutes}`;
    const roomId = currentRoom;

    if (roomId === 'MonkIA') {
      try {
        const gptResponse = await sendMessageToGpt(message);
        
        // Estructura del mensaje del usuario
        const userMessage = { content: message, time, from: user };
        // Estructura del mensaje de GPT-3.5
        const gptMessage = { content: gptResponse, time, from: { _id: "ChatBot" } };
        
        // Agregar ambos mensajes al estado
        setMessages(prevMessages => [
          ...prevMessages,
          { _id: todayDate, messagesByDate: [userMessage, gptMessage] },
        ]);
    
        // Emitir el mensaje del usuario al servidor
        socket.emit("message-room", roomId, message, user, time, todayDate);
        
        // Emitir también el mensaje del bot de chat GPT al servidor
        socket.emit("message-room", roomId, gptResponse, { _id: "ChatBot" }, time, todayDate);
        
        // Limpiar el campo de mensaje y desplazarse hacia abajo
        setMessage("");
        scrollToBottom();
      } catch (error) {
        console.error('Error al enviar el mensaje a GPT-3.5:', error);
      }
    } else {
      // Si no es la sala MonkIA, emitir el mensaje al servidor
      socket.emit("message-room", roomId, message, user, time, todayDate);
      setMessage("");
    }
    

  }

  async function sendMessageToGpt(message) {
    try {
      const response = await fetch('http://localhost:5001/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error al llamar a la API de GPT-3.5:', error);
      return 'Error en la solicitud a la API.';
    }
  }

  return (
    <>
      <div className="messages-output">
        {user && !privateMemberMsg?._id && <div className="alert alert-info">You are in the {currentRoom} room</div>}
        {user && privateMemberMsg?._id && (
          <>
            <div className="alert alert-info conversation-info">
              <div>
                Your conversation with {privateMemberMsg.name} <img src={privateMemberMsg.picture} className="conversation-profile-pic" alt={`${privateMemberMsg.name}'s avatar`} />
              </div>
            </div>
          </>
        )}
        {!user && <div className="alert alert-danger">Please login</div>}
        {user && messages.map(({ _id: date, messagesByDate }, idx) => (
          <div key={idx}>
            <p className="alert alert-info text-center message-date-indicator">{date}</p>
            {messagesByDate?.map(({ content, time, from: sender }, msgIdx) => (
              <div className={sender?._id === "MonkIA" ? "incoming-message" : sender?.email === user?.email ? "message" : "incoming-message"} key={msgIdx}>
                <div className="message-inner">
                  <div className="d-flex align-items-center mb-3">
                    <img src={sender?._id === "ChatBot" ? require("../assets/2.png") : sender?.picture || "/path/to/default-user-image.png"} style={{ width: 35, height: 35, objectFit: "cover", borderRadius: "50%", marginRight: 10 }} alt={`${sender?._id === "ChatBot" ? "Chatbot" : sender?.name}'s avatar`} />
                    <p className="message-sender">{sender?._id === "ChatBot" ? "Chatbot" : sender?.name}</p>
                  </div>
                  <p className="message-content">{content}</p>
                  <p className="message-timestamp-left">{time}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control type="text" placeholder="Your message" disabled={!user} value={message} onChange={(e) => setMessage(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button
              variant="primary"
              className="btn-sendmessage"
              type="submit"
              disabled={!user}
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default MessageForm;
