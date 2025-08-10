import React, { useState, useEffect, useRef } from "react";

const BACKEND_URL = "https://your-backend-url.com"; // Replace with your deployed backend URL

const avatars = [
  // Hot anime/cartoon styled female avatars placeholders (replace URLs with your actual images)
  "https://i.imgur.com/6YW6FBo.png",
  "https://i.imgur.com/ZshYnNP.png",
  "https://i.imgur.com/fuBrmYR.png",
  "https://i.imgur.com/XBTSkGe.png",
  "https://i.imgur.com/yoXwdJl.png",
  "https://i.imgur.com/7WZ3pxk.png",
  "https://i.imgur.com/wk0uYt0.png",
  "https://i.imgur.com/GxNljFq.png",
  "https://i.imgur.com/O1p8nN5.png",
  "https://i.imgur.com/eqDcY4p.png",
];

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [gfName, setGfName] = useState("");
  const [userName, setUserName] = useState("");
  const [hobbies, setHobbies] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Create or load session on start
  useEffect(() => {
    async function createSession() {
      try {
        const res = await fetch(`${BACKEND_URL}/session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setSessionId(data.sessionId);
        localStorage.setItem("sessionId", data.sessionId);
      } catch {
        alert("Failed to create session");
      }
    }
    const savedSession = localStorage.getItem("sessionId");
    if (savedSession) setSessionId(savedSession);
    else createSession();
  }, []);

  const allHobbies = [
    "Reading", "Gaming", "Cooking", "Traveling", "Music",
    "Sports", "Movies", "Fitness", "Art", "Dancing",
  ];

  function toggleHobby(hobby) {
    setHobbies((prev) =>
      prev.includes(hobby) ? prev.filter(h => h !== hobby) : [...prev, hobby]
    );
  }

  async function sendMessage() {
    if (!messageInput.trim() || !sessionId || isTrialExpired) return;

    setLoading(true);

    const payload = {
      sessionId,
      message: messageInput.trim(),
      userName: userName.trim() || null,
      gfName: gfName.trim() || null,
      hobbies,
    };

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.stop && data.reason === "trial_expired") {
        setIsTrialExpired(true);
        addChatMessage("system", data.reply);
      } else if (data.reply) {
        addChatMessage("user", messageInput.trim());
        addChatMessage("ai", data.reply);
      }

      setMessageInput("");
    } catch {
      alert("Chat failed");
    } finally {
      setLoading(false);
    }
  }

  function addChatMessage(role, text) {
    setChatMessages((prev) => [...prev, { role, text }]);
  }

  // UI Steps: 1=Avatar, 2=Name GF, 3=Your name, 4=Hobbies, 5=Chat

  if (!sessionId) return <div className="loading">Loading session...</div>;

  if (step === 1)
    return (
      <div className="container">
        <h2>Select Your AI Girlfriend Avatar</h2>
        <div className="avatar-grid">
          {avatars.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Avatar ${i + 1}`}
              className={`avatar ${selectedAvatar === url ? "selected" : ""}`}
              onClick={() => setSelectedAvatar(url)}
            />
          ))}
        </div>
        <button disabled={!selectedAvatar} onClick={() => setStep(2)} className="btn">
          Next
        </button>
      </div>
    );

  if (step === 2)
    return (
      <div className="container">
        <h2>Name Your AI Girlfriend</h2>
        <input
          type="text"
          placeholder="Her name..."
          value={gfName}
          onChange={e => setGfName(e.target.value)}
          className="input"
        />
        <button disabled={!gfName.trim()} onClick={() => setStep(3)} className="btn">
          Next
        </button>
      </div>
    );

  if (step === 3)
    return (
      <div className="container">
        <h2>What's Your Name?</h2>
        <input
          type="text"
          placeholder="Your name..."
          value={userName}
          onChange={e => setUserName(e.target.value)}
          className="input"
        />
        <button disabled={!userName.trim()} onClick={() => setStep(4)} className="btn">
          Next
        </button>
      </div>
    );

  if (step === 4)
    return (
      <div className="container">
        <h2>Choose Your Hobbies</h2>
        <div className="hobbies-grid">
          {allHobbies.map(hobby => (
            <button
              key={hobby}
              className={`hobby ${hobbies.includes(hobby) ? "selected" : ""}`}
              onClick={() => toggleHobby(hobby)}
            >
              {hobby}
            </button>
          ))}
        </div>
        <button onClick={() => setStep(5)} className="btn">
          Start Chatting
        </button>
      </div>
    );

  // Step 5: Chat UI

  return (
    <div className="chat-container">
      <header className="chat-header">
        <img src={selectedAvatar} alt="AI Girlfriend" className="chat-avatar" />
        <div className="chat-header-text">
          <h2>{gfName}</h2>
          <p>Your AI Girlfriend</p>
        </div>
      </header>

      <div className="chat-messages">
        {chatMessages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${msg.role === "user" ? "user" : msg.role === "ai" ? "ai" : "system"}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {isTrialExpired ? (
        <div className="paywall">
          <p>Trial over! Subscribe for $14.99/month to continue chatting 💔</p>
          <button className="btn btn-subscribe" disabled>
            Subscribe (Coming Soon)
          </button>
        </div>
      ) : (
        <footer className="chat-input-area">
          <input
            type="text"
            placeholder="Type your message..."
            value={messageInput}
            onChange={e => setMessageInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            disabled={loading}
            className="chat-input"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !messageInput.trim()}
            className="btn btn-send"
          >
            Send
          </button>
        </footer>
      )}
      <style>{`
        /* Reset & base */
        * {
          box-sizing: border-box;
        }
        body,html,#root {
          margin: 0; padding: 0; height: 100%;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #0f0f18;
          color: #eee;
          user-select: none;
        }
        .container {
          max-width: 480px;
          margin: 40px auto;
          padding: 20px;
          background: #12131a;
          border-radius: 12px;
          box-shadow: 0 0 20px #0ff;
          text-align: center;
        }
        h2 {
          margin-bottom: 20px;
          color: #0ff;
          text-shadow: 0 0 10px #0ff;
        }
        .avatar-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        .avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 3px solid transparent;
          cursor: pointer;
          transition: border-color 0.3s ease;
          filter: drop-shadow(0 0 3px #0ff);
          object-fit: cover;
        }
        .avatar.selected {
          border-color: #0ff;
          filter: drop-shadow(0 0 10px #0ff);
          transform: scale(1.1);
        }
        .btn {
          background: #0ff;
          border: none;
          padding: 12px 28px;
          border-radius: 25px;
          color: #000;
          font-weight: bold;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 0 12px #0ff;
          transition: background 0.3s ease, color 0.3s ease;
          user-select: none;
        }
        .btn:hover:not(:disabled) {
          background: #00ffffcc;
          color: #000;
          box-shadow: 0 0 20px #0ff;
        }
        .btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          box-shadow: none;
        }
        input.input {
          width: 100%;
          padding: 12px 16px;
          font-size: 1rem;
          border-radius: 25px;
          border: none;
          outline: none;
          background: #1b1c24;
          color: #0ff;
          box-shadow: 0 0 10px #0ff inset;
          margin-bottom: 20px;
          user-select: text;
        }
        .hobbies-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .hobby {
          padding: 10px 20px;
          background: #1b1c24;
          border-radius: 30px;
          color: #0ff;
          cursor: pointer;
          box-shadow: 0 0 8px #0ff inset;
          transition: background 0.3s ease;
          user-select: none;
          font-weight: 600;
        }
        .hobby.selected {
          background: #00ffffcc;
          color: #000;
          box-shadow: 0 0 15px #0ff;
          transform: scale(1.1);
        }
        /* Chat container */
        .chat-container {
          max-width: 480px;
          height: 90vh;
          margin: 20px auto;
          background: #12131a;
          border-radius: 12px;
          box-shadow: 0 0 20px #0ff;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          user-select: none;
        }
        .chat-header {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          background: #0ff;
          color: #000;
          box-shadow: 0 0 15px #0ff;
          user-select: none;
        }
        .chat-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 3px solid #000;
          object-fit: cover;
          margin-right: 15px;
          filter: drop-shadow(0 0 6px #00ffff);
        }
        .chat-header-text h2 {
          margin: 0;
          font-weight: 900;
          text-shadow: 0 0 6px #00ffff;
        }
        .chat-header-text p {
          margin: 0;
          font-weight: 600;
          font-style: italic;
          color: #004d4d;
          text-shadow: none;
        }
        .chat-messages {
          flex-grow: 1;
          padding: 15px 20px;
          overflow-y: auto;
          background: #0a0a12;
          display: flex;
          flex-direction: column;
          gap: 12px;
          user-select: text;
        }
        .chat-message {
          max-width: 70%;
          padding: 12px 18px;
          border-radius: 20px;
          font-size: 1rem;
          line-height: 1.3;
          word-wrap: break-word;
          box-shadow: 0 0 8px #0ff inset;
          user-select: text;
        }
        .chat-message.user {
          align-self: flex-end;
          background: linear-gradient(135deg, #00fff7, #00b3a6);
          color: #001818;
          font-weight: 600;
          box-shadow: 0 0 12px #00fff7;
          user-select: text;
        }
        .chat-message.ai {
          align-self: flex-start;
          background: linear-gradient(135deg, #004d4d, #007373);
          color: #b3ffff;
          font-weight: 500;
          box-shadow: 0 0 12px #00ffff;
          user-select: text;
        }
        .chat-message.system {
          align-self: center;
          background: #330000;
          color: #ff4d4d;
          font-weight: 700;
          font-style: italic;
          box-shadow: 0 0 10px #ff0000;
          user-select: none;
        }
        .chat-input-area {
          display: flex;
          padding: 10px 20px;
          background: #12131a;
          border-top: 2px solid #00ffffaa;
          user-select: none;
        }
        .chat-input {
          flex-grow: 1;
          border: none;
          border-radius: 25px;
          padding: 12px 20px;
          font-size: 1rem;
          background: #0a0a12;
          color: #0ff;
          box-shadow: 0 0 10px #00ffff inset;
          outline: none;
          user-select: text;
        }
        .btn-send {
          margin-left: 15px;
          background: #00ffff;
          color: #000;
          font-weight: 700;
          box-shadow: 0 0 15px #00ffff;
          transition: background 0.3s ease;
          user-select: none;
        }
        .btn-send:hover:not(:disabled) {
          background: #00e6e6;
        }
        .btn-subscribe {
          background: #ff0044;
          color: #fff;
          font-weight: 700;
          box-shadow: 0 0 20px #ff0044;
          user-select: none;
          cursor: not-allowed;
          opacity: 0.8;
        }
        .loading {
          color: #0ff;
          font-weight: 700;
          font-size: 1.3rem;
          text-align: center;
          margin-top: 100px;
          user-select: none;
        }

        @media (max-width: 500px) {
          .container, .chat-container {
            margin: 10px;
            max-width: 95vw;
            height: auto;
          }
          .avatar-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          .chat-message {
            max-width: 85%;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
