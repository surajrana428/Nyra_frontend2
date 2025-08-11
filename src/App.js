import React, { useState, useEffect, useRef } from "react";

// Sample avatars URLs — replace with your own images or URLs
const avatars = [
  "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=15",
  "https://i.pravatar.cc/150?img=18",
  "https://i.pravatar.cc/150?img=22",
  "https://i.pravatar.cc/150?img=25",
];

export default function App() {
  const [step, setStep] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [aiName, setAiName] = useState("");
  const [userName, setUserName] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll chat to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fake AI reply with delay
  const sendMessage = (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateReply(text);
      setMessages((prev) => [...prev, { from: "ai", text: reply }]);
      setIsTyping(false);
    }, 1400);
  };

  // Simple AI reply generator (you can replace with real AI later)
  const generateReply = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("hi") || lower.includes("hello")) return `Hey ${userName}! How are you? 💖`;
    if (lower.includes("how are you")) return "I'm feeling great chatting with you! 😊";
    if (lower.includes("hobby") || lower.includes("hobbies"))
      return `I love talking about hobbies too! You mentioned: ${hobbies}`;
    return "That's interesting! Tell me more 💬";
  };

  // Styles (simple CSS-in-JS)
  const styles = {
    app: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: "radial-gradient(circle at top left, #0f0f15, #121217)",
      minHeight: "100vh",
      color: "#eee",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: 20,
      userSelect: "none",
    },
    fadeIn: {
      animation: "fadeIn 0.4s ease forwards",
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: "700",
      color: "#9c88ff",
      textShadow: "0 0 8px #9c88ff",
    },
    avatarGrid: {
      display: "flex",
      gap: 15,
      justifyContent: "center",
      flexWrap: "wrap",
      maxWidth: 400,
    },
    avatar: (selected) => ({
      width: 80,
      height: 80,
      borderRadius: "50%",
      border: selected ? "3px solid #9c88ff" : "3px solid transparent",
      boxShadow: selected ? "0 0 12px #9c88ff" : "0 0 6px #222",
      cursor: "pointer",
      transition: "all 0.3s ease",
    }),
    input: {
      width: "100%",
      maxWidth: 350,
      padding: "10px 15px",
      fontSize: 16,
      borderRadius: 8,
      border: "none",
      outline: "none",
      marginBottom: 20,
      background: "#1e1e2f",
      color: "#eee",
      boxShadow: "0 0 10px #5a4aff44",
      transition: "box-shadow 0.3s ease",
    },
    button: {
      background: "#9c88ff",
      color: "#111",
      border: "none",
      padding: "12px 30px",
      borderRadius: 30,
      fontWeight: "700",
      cursor: "pointer",
      boxShadow: "0 0 12px #9c88ff",
      transition: "background 0.3s ease",
      userSelect: "none",
    },
    buttonDisabled: {
      background: "#5a4aff88",
      cursor: "not-allowed",
    },
    chatContainer: {
      background: "#121217",
      width: "100%",
      maxWidth: 480,
      height: "70vh",
      borderRadius: 15,
      boxShadow: "0 0 20px #9c88ff33",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    chatHeader: {
      padding: 15,
      background: "#1e1e2f",
      display: "flex",
      alignItems: "center",
      gap: 15,
      borderBottom: "1px solid #333",
      userSelect: "none",
    },
    avatarSmall: {
      width: 50,
      height: 50,
      borderRadius: "50%",
      boxShadow: "0 0 10px #9c88ff",
    },
    headerNames: {
      color: "#eee",
      fontWeight: "700",
      fontSize: 18,
      textShadow: "0 0 5px #9c88ff",
    },
    messagesContainer: {
      flex: 1,
      padding: "15px 20px",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      background:
        "linear-gradient(135deg, #0d0d1a 0%, #121217 100%)",
    },
    messageBubble: (from) => ({
      maxWidth: "75%",
      padding: "12px 18px",
      borderRadius: 25,
      color: from === "user" ? "#111" : "#eee",
      background: from === "user" ? "#9c88ff" : "#5a4affbb",
      alignSelf: from === "user" ? "flex-end" : "flex-start",
      boxShadow:
        from === "user"
          ? "0 0 10px #9c88ffbb"
          : "0 0 12px #5a4affbb",
      fontSize: 16,
      lineHeight: 1.3,
      userSelect: "text",
    }),
    typingIndicator: {
      display: "flex",
      gap: 6,
      marginLeft: 8,
      alignItems: "center",
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "#9c88ff",
      animation: "typingDot 1.4s infinite",
    },
    dot2: {
      animationDelay: "0.2s",
    },
    dot3: {
      animationDelay: "0.4s",
    },
    chatInputContainer: {
      padding: 15,
      borderTop: "1px solid #333",
      display: "flex",
      gap: 12,
      background: "#1e1e2f",
    },
    chatInput: {
      flex: 1,
      borderRadius: 25,
      padding: "10px 20px",
      border: "none",
      outline: "none",
      fontSize: 16,
      background: "#121217",
      color: "#eee",
      boxShadow: "0 0 10px #5a4aff55 inset",
    },
  };

  // For smooth fade animations
  // Add keyframes CSS in your global stylesheet or inline style tag:
  // @keyframes fadeIn { from {opacity: 0;} to {opacity: 1;} }
  // @keyframes typingDot {
  //   0%, 20% {opacity: 0.3;}
  //   50% {opacity: 1;}
  //   100% {opacity: 0.3;}
  // }

  // Component rendering by step
  if (step === 1) {
    return (
      <div style={styles.app}>
        <h1 style={styles.title}>Choose Your AI Companion's Avatar</h1>
        <div style={styles.avatarGrid}>
          {avatars.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Avatar ${i + 1}`}
              style={styles.avatar(selectedAvatar === i)}
              onClick={() => setSelectedAvatar(i)}
            />
          ))}
        </div>
        <button
          style={{
            ...styles.button,
            ...(selectedAvatar === null ? styles.buttonDisabled : {}),
            marginTop: 30,
          }}
          disabled={selectedAvatar === null}
          onClick={() => setStep(2)}
        >
          Next
        </button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div style={styles.app}>
        <h1 style={styles.title}>Name Your AI Companion & Yourself</h1>
        <input
          style={styles.input}
          placeholder="AI Companion's Name"
          value={aiName}
          onChange={(e) => setAiName(e.target.value)}
          autoFocus
        />
        <input
          style={styles.input}
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button
          style={{
            ...styles.button,
            ...(aiName.trim() === "" || userName.trim() === ""
              ? styles.buttonDisabled
              : {}),
          }}
          disabled={aiName.trim() === "" || userName.trim() === ""}
          onClick={() => setStep(3)}
        >
          Next
        </button>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div style={styles.app}>
        <h1 style={styles.title}>Tell me your hobbies</h1>
        <input
          style={styles.input}
          placeholder="Your hobbies or interests"
          value={hobbies}
          onChange={(e) => setHobbies(e.target.value)}
          autoFocus
        />
        <button
          style={{
            ...styles.button,
            ...(hobbies.trim() === "" ? styles.buttonDisabled : {}),
          }}
          disabled={hobbies.trim() === ""}
          onClick={() => setStep(4)}
        >
          Start Chatting
        </button>
      </div>
    );
  }

  // Step 4 = Chat interface
  return (
    <div style={styles.app}>
      <div style={styles.chatContainer}>
        <div style={styles.chatHeader}>
          <img
            src={avatars[selectedAvatar]}
            alt="Avatar"
            style={styles.avatarSmall}
          />
          <div style={styles.headerNames}>
            <div>{aiName || "Nyra"}</div>
            <div style={{ fontWeight: "400", fontSize: 13, opacity: 0.7 }}>
              Your AI companion
            </div>
          </div>
        </div>

        <div style={styles.messagesContainer}>
          {messages.map((m, i) => (
            <div key={i} style={styles.messageBubble(m.from)}>
              {m.text}
            </div>
          ))}
          {isTyping && (
            <div style={{ ...styles.messageBubble("ai"), display: "flex", alignItems: "center" }}>
              Typing
              <span style={styles.typingIndicator}>
                <span style={styles.dot}></span>
                <span style={{ ...styles.dot, ...styles.dot2 }}></span>
                <span style={{ ...styles.dot, ...styles.dot3 }}></span>
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.chatInputContainer}>
          <input
            type="text"
            style={styles.chatInput}
            placeholder={`Chat with ${aiName || "Nyra"}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage(input);
            }}
          />
          <button
            style={{
              ...styles.button,
              padding: "10px 18px",
              fontWeight: "600",
              userSelect: "none",
            }}
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
          >
            Send
          </button>
        </div>
      </div>

      {/* Add simple footer or branding if you want */}
    </div>
  );
}