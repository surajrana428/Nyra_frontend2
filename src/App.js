import React, { useState, useEffect, useRef } from "react";

// 🔧 CONFIG: Paste avatar URLs here later (empty for now)
const avatars = []; // ← ["https://i.imgur.com/abc.png", "https://i.imgur.com/xyz.png"]

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

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Mock session initialization
  useEffect(() => {
    const mockSessionId = "mock-session-" + Math.random().toString(36).slice(2, 8);
    setSessionId(mockSessionId);
    localStorage.setItem("sessionId", mockSessionId);
  }, []);

  const allHobbies = [
    "Reading", "Gaming", "Cooking", "Traveling", "Music",
    "Sports", "Movies", "Fitness", "Art", "Dancing"
  ];

  function toggleHobby(hobby) {
    setHobbies(prev => prev.includes(hobby) ? prev.filter(h => h !== hobby) : [...prev, hobby]);
  }

  // Mock backend call
  const mockBackend = async (payload) => {
    console.log("Mock payload:", payload);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      reply: gfName 
        ? `${gfName}: This is a mock response! (Backend connects later)`
        : "AI: Hello! Try sending a message!",
      stop: false
    };
  };

  async function sendMessage() {
    if (!messageInput.trim() || !sessionId || isTrialExpired) return;
    
    setLoading(true);
    const userMessage = { role: "user", text: messageInput.trim() };
    setChatMessages(prev => [...prev, userMessage]);
    setMessageInput("");

    try {
      const data = await mockBackend({
        sessionId,
        message: messageInput,
        gfName,
        hobbies
      });
      
      if (data.reply) {
        addChatMessage("ai", data.reply);
      }
    } catch {
      addChatMessage("system", "Error: Mock failed");
    } finally {
      setLoading(false);
    }
  }

  function addChatMessage(role, text) {
    setChatMessages(prev => [...prev, { role, text }]);
  }

  // UI Steps (unchanged)
  if (!sessionId) return <div className="loading">Loading session...</div>;

  if (step === 1) return (
    <div className="container">
      <h2>Select Your AI Girlfriend Avatar</h2>
      <div className="avatar-grid">
        {avatars.map((url, i) => (
          <div 
            key={i}
            className={`avatar ${selectedAvatar === url ? "selected" : ""}`}
            onClick={() => setSelectedAvatar(url)}
            style={url ? { 
              backgroundImage: `url(${url})`,
              backgroundSize: 'cover'
            } : {
              backgroundColor: '#333',
              border: '2px dashed #0ff'
            }}
          />
        ))}
      </div>
      <button 
        onClick={() => setStep(2)} 
        className="btn"
        style={!selectedAvatar ? { opacity: 0.5 } : {}}
      >
        Next
      </button>
    </div>
  );

  // Steps 2-4 remain exactly the same as your original
  if (step === 2) return (
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

  if (step === 3) return (
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

  if (step === 4) return (
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

  // Chat UI (unchanged except avatar fallback)
  return (
    <div className="chat-container">
      <header className="chat-header">
        <div 
          className="chat-avatar"
          style={selectedAvatar ? { 
            backgroundImage: `url(${selectedAvatar})`,
            backgroundSize: 'cover'
          } : {
            backgroundColor: '#333',
            border: '2px dashed #0ff'
          }}
        />
        <div className="chat-header-text">
          <h2>{gfName || "AI Girlfriend"}</h2>
          <p>Your AI Companion</p>
        </div>
      </header>

      <div className="chat-messages">
        {chatMessages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${msg.role === "user" ? "user" : "ai"}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {isTrialExpired ? (
        <div className="paywall">
          <p>Trial over! Subscribe to continue chatting 💔</p>
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

      {/* Keep all your original styles here */}
      <style>{`
        /* [PASTE YOUR ENTIRE ORIGINAL STYLE TAG HERE] */
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
        /* ... [REST OF YOUR CSS] ... */
      `}</style>
    </div>
  );
}

export default App;