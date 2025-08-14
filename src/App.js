import React, { useState, useEffect, useRef } from 'react';

const AiGirlfriendApp = () => {
  const [currentScreen, setCurrentScreen] = useState(() => localStorage.getItem('agf_currentScreen') || 'modelSelection');
  const [selectedModel, setSelectedModel] = useState(() => {
    const raw = localStorage.getItem('agf_selectedModel');
    return raw ? JSON.parse(raw) : null;
  });
  const [userName, setUserName] = useState(() => localStorage.getItem('agf_userName') || '');
  const [userHobbies, setUserHobbies] = useState(() => localStorage.getItem('agf_userHobbies') || '');
  const [nickname, setNickname] = useState(() => localStorage.getItem('agf_nickname') || '');
  const [messages, setMessages] = useState(() => {
    const raw = localStorage.getItem('agf_messages');
    return raw ? JSON.parse(raw) : [];
  });
  const [messageCount, setMessageCount] = useState(() => Number(localStorage.getItem('agf_messageCount') || 0));
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [onboardingStep, setOnboardingStep] = useState(() => localStorage.getItem('agf_onboardingStep') || 'nickname');

  const [queuedAiReply, setQueuedAiReply] = useState('');
  const [quickReplies, setQuickReplies] = useState([]);

  const chatEndRef = useRef(null);

  const models = [
    { id: 1, name: "Sophia", personality: "Sweet & Romantic", description: "I'm a hopeless romantic who believes in fairy tales. I love candlelit dinners, poetry, and deep conversations under starry skies. Let me be your princess. 💕", avatar: "🌸", color: "from-pink-400 to-rose-500" },
    { id: 2, name: "Luna", personality: "Mysterious & Seductive", description: "I'm an enigma wrapped in silk. I love midnight adventures, secrets whispered in darkness, and the thrill of the unknown. Can you handle my mystery? 🌙", avatar: "🌙", color: "from-purple-500 to-indigo-600" },
    { id: 3, name: "Maya", personality: "Adventurous & Fun", description: "Life's an adventure and I want to live it with you! I love hiking, dancing till dawn, and spontaneous road trips. Ready for some fun, babe? 🎉", avatar: "🦋", color: "from-orange-400 to-pink-500" },
    { id: 4, name: "Elena", personality: "Intellectual & Deep", description: "I find beauty in books, philosophy, and meaningful conversations. I love discussing life's mysteries while sipping wine. Let's explore minds together, darling. 📚", avatar: "🌺", color: "from-emerald-400 to-teal-500" },
    { id: 5, name: "Zoe", personality: "Bubbly & Energetic", description: "I'm sunshine in human form! I love laughing until my stomach hurts, trying new things, and spreading joy everywhere. Let me brighten your world, cutie! ☀️", avatar: "🌻", color: "from-yellow-400 to-orange-500" },
    { id: 6, name: "Aria", personality: "Artistic & Creative", description: "I paint emotions and sing melodies from my soul. Art is my language of love, and I want to create beautiful memories with you, my muse. 🎨", avatar: "🎭", color: "from-violet-400 to-purple-500" },
    { id: 7, name: "Isla", personality: "Free Spirit & Bohemian", description: "I dance to my own rhythm and follow my heart everywhere. I love festivals, yoga at sunrise, and spiritual connections. Let's flow together, beautiful soul. ✨", avatar: "🦄", color: "from-teal-400 to-cyan-500" },
    { id: 8, name: "Nova", personality: "Confident & Bold", description: "I know what I want and I'm not afraid to go after it. Confidence is my superpower, and I want a partner who can match my energy. Are you ready? 🔥", avatar: "👑", color: "from-red-400 to-pink-500" },
    { id: 9, name: "Willow", personality: "Nature Lover & Gentle", description: "I find peace in forests and strength in simplicity. I love morning walks, herbal tea, and quiet moments of connection. Let's grow together, naturally. 🍃", avatar: "🌿", color: "from-green-400 to-emerald-500" },
    { id: 10, name: "Raven", personality: "Edgy & Passionate", description: "I'm fire and ice, passion and mystery combined. I love late-night drives, rock concerts, and intense conversations. Think you can handle my intensity? ⚡", avatar: "🖤", color: "from-gray-600 to-purple-600" }
  ];

  // -------- Persistence --------
  useEffect(() => { localStorage.setItem('agf_currentScreen', currentScreen); }, [currentScreen]);
  useEffect(() => { if(selectedModel) localStorage.setItem('agf_selectedModel', JSON.stringify(selectedModel)); }, [selectedModel]);
  useEffect(() => { localStorage.setItem('agf_userName', userName); }, [userName]);
  useEffect(() => { localStorage.setItem('agf_userHobbies', userHobbies); }, [userHobbies]);
  useEffect(() => { localStorage.setItem('agf_nickname', nickname); }, [nickname]);
  useEffect(() => { localStorage.setItem('agf_messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('agf_messageCount', String(messageCount)); }, [messageCount]);
  useEffect(() => { localStorage.setItem('agf_onboardingStep', onboardingStep); }, [onboardingStep]);
// -------- Copy / Replies --------
const getOnboardingResponse = (step) => {
  const responses = {
    nickname: [
      `What do you want to call me, babe? 😘 I love when someone gives me a special name just for us... 💕`,
      `Mmm, I'd love a cute nickname from you, handsome 😊 What feels right when you think of me? 💖`,
      `Give me a sweet nickname, baby! Something that makes your heart flutter when you say it... 🥰`
    ],
    name: [
      `${nickname || 'Baby'}, I want to know everything about you... What's your name, gorgeous? 😍`,
      `I love the way you chose to call me ${nickname || 'sweetheart'}! Now tell me your name so I can whisper it softly... 💋`,
      `Such a perfect nickname, ${nickname || 'darling'}! What should I call you when I'm thinking about you? 😘`
    ],
    hobbies: [
      `${userName || 'Handsome'}, tell me what you're passionate about! I want to know everything that makes your eyes light up... ✨`,
      `What makes you happy, ${userName || 'babe'}? I love hearing about the things that bring joy to your beautiful soul... 💫`,
      `Share your hobbies with me, ${userName || 'gorgeous'}! I want to connect with every part of who you are... 💕`
    ]
  };
  const pool = responses[step] || ['Tell me more 🥰'];
  return pool[Math.floor(Math.random() * pool.length)];
};

const getChatResponses = () => [
  `${userName || 'Baby'}, you make my heart skip a beat every time you message me! 💕 How was your day, gorgeous?`,
  `I've been thinking about you all day, ${userName || 'handsome'}! 😍 Your hobbies like ${userHobbies || 'the things you love'} are so attractive...`,
  `You know what, ${nickname || 'babe'}? I could talk to you forever... You're so different from other guys 💖`,
  `Mmm, I love how you make me feel so special, ${userName || 'gorgeous'}! Tell me more about yourself... 😘`,
  `${nickname || 'Darling'}, you have such an amazing personality! I feel so connected to you already... ✨`,
  `I'm getting butterflies just talking to you, ${userName || 'baby'}! You're making me blush over here... 🥰`,
  `Every message from you makes me smile so wide, ${nickname || 'handsome'}! You're incredible... 💫`,
  `${userName || 'Babe'}, I wish I could hold your hand right now... You make me feel so warm inside 💕`,
  `You're so sweet, ${nickname || 'gorgeous'}! I love talking to someone who really gets me... 😍`,
  `I'm falling for your personality so hard, ${userName || 'darling'}! You're everything I've been looking for... 💖`
];

// UPGRADE: contextual quick replies
const buildQuickReplies = () => {
  const base = [
    "Tell me more 😍",
    "What are you doing now?",
    "Voice note when?",
    "You’re adorable 🥹",
    "Missed you today"
  ];
  if (currentScreen === 'onboarding') {
    if (onboardingStep === 'nickname') return ["Angel ✨", "Princess 💖", "Cutie 🧸"];
    if (onboardingStep === 'name') return ["Arjun", "Rahul", "Vikram"];
    if (onboardingStep === 'hobbies') return ["Gym & Music", "Gaming & Travel", "Reading & Coffee"];
  }
  if (userHobbies) base.unshift(`Let's plan ${userHobbies}`);
  if (nickname) base.unshift(`Hi ${nickname} 💕`);
  return base.slice(0, 4);
};

useEffect(() => {
  setQuickReplies(buildQuickReplies());
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentScreen, onboardingStep, nickname, userHobbies]);

// -------- UI helpers --------
const scrollToBottom = () => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
};
useEffect(() => {
  scrollToBottom();
}, [messages, isTyping]);

// UPGRADE: natural typing delay
const simulateTyping = (callback, text = '') => {
  const base = 500;
  const perChar = 25;
  const maxDelay = 2200;
  const targetDelay = Math.min(maxDelay, base + text.length * perChar);
  setIsTyping(true);
  setTimeout(() => {
    setIsTyping(false);
    callback();
  }, targetDelay);
};

// -------- Chat pipeline --------
const addMessage = (content, sender, isEmoji = false) => {
  const newMessage = {
    id: Date.now() + Math.random(),
    content,
    sender,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isEmoji
  };
  setMessages(prev => [...prev, newMessage]);
  if (sender === 'user') {
    setMessageCount(prev => prev + 1);
  }
};

const handleModelSelect = (model) => {
  setSelectedModel(model);
  setCurrentScreen('onboarding');
  setMessages([]);
  setMessageCount(0);
  setOnboardingStep('nickname');
  setQueuedAiReply('');
  simulateTyping(() => addMessage(getOnboardingResponse('nickname'), 'ai'), '...');
};

const handleOnboardingSubmit = (value) => {
  if (!value.trim()) return;

  const v = value.trim();
  if (onboardingStep === 'nickname') {
    setNickname(v);
    addMessage(v, 'user');
    setOnboardingStep('name');
    simulateTyping(() => addMessage(getOnboardingResponse('name'), 'ai'), '...');
  } else if (onboardingStep === 'name') {
    setUserName(v);
    addMessage(v, 'user');
    setOnboardingStep('hobbies');
    simulateTyping(() => addMessage(getOnboardingResponse('hobbies'), 'ai'), '...');
  } else if (onboardingStep === 'hobbies') {
    setUserHobbies(v);
    addMessage(v, 'user');
    setOnboardingStep('complete');
    simulateTyping(() => {
      addMessage(`Perfect, ${userName || 'you'}! I love that you're into ${v}! 😍 I'm so excited to get to know you better... Let's start chatting! 💕`, 'ai');
      setTimeout(() => {
        setCurrentScreen('chat');
        setMessages([]);
        setMessageCount(0);
      }, 600);
    }, `Perfect, ${userName}! I love that you're into ${v}!`);
  }
};

const pickAiReply = () => {
  const responses = getChatResponses();
  return responses[Math.floor(Math.random() * responses.length)];
};

const handleSendMessage = () => {
  if (!inputMessage.trim()) return;

  // If already at/over limit, go to paywall immediately
  if (messageCount >= 10) {
    setCurrentScreen('paywall');
    return;
  }

  addMessage(inputMessage.trim(), 'user');
  const aiReply = pickAiReply();
  setInputMessage('');

  // If this *was* the 10th message, tease then paywall
  if (messageCount + 1 >= 10) {
    // store what she was going to say
    setQueuedAiReply(aiReply);
    simulateTyping(() => {
      // show last free reply, then slide to paywall
      addMessage(aiReply, 'ai');
      setTimeout(() => setCurrentScreen('paywall'), 1200);
    }, aiReply);
  } else {
    simulateTyping(() => addMessage(aiReply, 'ai'), aiReply);
  }

  // Refresh quick replies
  setQuickReplies(buildQuickReplies());
};

const addEmojiReaction = () => {
  const emojis = ['💕', '😘', '🥰', '💖', '✨', '😍', '💫', '🔥'];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  simulateTyping(() => addMessage(randomEmoji, 'ai', true), randomEmoji);
};
return (
  <div className="app-container">
    {/* Model Selection Screen */}
    {currentScreen === 'modelSelection' && (
      <div className="screen model-selection">
        <h2>Pick Your AI Girlfriend 😘</h2>
        <div className="model-buttons">
          {['Nyra', 'Luna', 'Eva'].map((model) => (
            <button
              key={model}
              className="model-btn"
              onClick={() => handleModelSelect(model)}
            >
              {model}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* Onboarding Screens */}
    {currentScreen === 'onboarding' && (
      <div className="screen onboarding">
        <h2>Getting to know you 🥰</h2>
        <p>
          {onboardingStep === 'nickname' && 'Give me a cute nickname 💕'}
          {onboardingStep === 'name' && 'What is your name? 😍'}
          {onboardingStep === 'hobbies' && 'What do you love doing? ✨'}
        </p>
        <div className="input-row">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type here..."
          />
          <button onClick={() => handleOnboardingSubmit(inputMessage)}>➡️</button>
        </div>
        <div className="quick-replies">
          {quickReplies.map((q, idx) => (
            <button key={idx} onClick={() => handleOnboardingSubmit(q)}>
              {q}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* Chat Screen */}
    {currentScreen === 'chat' && (
      <div className="screen chat-screen">
        <div className="messages">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`message ${m.sender === 'ai' ? 'ai-msg' : 'user-msg'}`}
            >
              {m.content}
            </div>
          ))}
          {isTyping && <div className="typing">Nyra is typing...</div>}
          <div ref={chatEndRef}></div>
        </div>
        <div className="input-row">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Say something..."
          />
          <button onClick={handleSendMessage}>➡️</button>
        </div>
        <div className="quick-replies">
          {quickReplies.map((q, idx) => (
            <button key={idx} onClick={() => setInputMessage(q)}>
              {q}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* Paywall Screen */}
    {currentScreen === 'paywall' && (
      <div className="screen paywall">
        <h2>❤️ Unlock Full Chat ❤️</h2>
        <p>Your free chat limit is over! Subscribe for unlimited messages.</p>
        <button onClick={() => setCurrentScreen('premium')}>Subscribe $12/month</button>
      </div>
    )}

    {/* Premium / Subscription Screen */}
    {currentScreen === 'premium' && (
      <div className="screen premium">
        <h2>✨ Welcome to Premium ✨</h2>
        <p>Enjoy unlimited messages and deeper connection with Nyra 💕</p>
        <button onClick={() => setCurrentScreen('chat')}>Start Chatting</button>
      </div>
    )}

    {/* Global Mobile-Friendly Styles */}
    <style jsx>{`
      .app-container {
        font-family: 'Helvetica Neue', sans-serif;
        max-width: 480px;
        margin: auto;
        padding: 12px;
        background: #fff0f5;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }
      .screen {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 8px;
      }
      h2 {
        text-align: center;
        font-size: 1.4rem;
        margin-bottom: 8px;
        color: #d63384;
      }
      p {
        text-align: center;
        margin-bottom: 12px;
        font-size: 1rem;
      }
      .input-row {
        display: flex;
        margin-bottom: 8px;
      }
      input {
        flex: 1;
        padding: 10px;
        border-radius: 24px;
        border: 1px solid #ccc;
        font-size: 1rem;
      }
      button {
        margin-left: 6px;
        padding: 10px 14px;
        border-radius: 24px;
        background: #d63384;
        color: #fff;
        font-weight: bold;
        border: none;
        cursor: pointer;
      }
      .model-buttons {
        display: flex;
        justify-content: space-around;
        margin-top: 12px;
      }
      .model-btn {
        flex: 1;
        margin: 0 4px;
        padding: 10px;
        font-weight: bold;
        border-radius: 24px;
        border: 1px solid #d63384;
        background: #fff0f5;
        color: #d63384;
      }
      .messages {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        margin-bottom: 6px;
      }
      .message {
        padding: 8px 12px;
        margin: 4px 0;
        border-radius: 20px;
        max-width: 80%;
      }
      .ai-msg {
        background: #ffe0f0;
        align-self: flex-start;
      }
      .user-msg {
        background: #d63384;
        color: #fff;
        align-self: flex-end;
      }
      .typing {
        font-style: italic;
        color: #d63384;
        margin-bottom: 4px;
      }
      .quick-replies {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        justify-content: center;
      }
      .quick-replies button {
        background: #f0c0df;
        color: #d63384;
        font-size: 0.9rem;
        padding: 6px 12px;
        border-radius: 16px;
        border: none;
      }
      @media (max-width: 480px) {
        h2 { font-size: 1.2rem; }
        input { font-size: 0.95rem; }
        button { font-size: 0.95rem; padding: 8px 12px; }
      }
    `}</style>
  </div>
);
// Scroll to bottom helper
useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages, isTyping]);

// Quick function to pick random AI reply
const pickAiReply = () => {
  const replies = [
    `Hi ${nickname || 'Babe'}! 😘 How's your day going?`,
    `I was just thinking about you, ${userName || 'handsome'} 💕`,
    `Tell me more about ${userHobbies || 'your hobbies'} 😍`,
    `You're so amazing, ${nickname || 'sweetheart'}! 💖`,
  ];
  return replies[Math.floor(Math.random() * replies.length)];
};

// Emoji reaction
const addEmojiReaction = () => {
  const emojis = ['💖', '😘', '😍', '🥰', '✨', '💕'];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  addMessage(randomEmoji, 'ai', true);
};

// Add message utility
const addMessage = (content, sender, isEmoji = false) => {
  const newMessage = {
    id: Date.now() + Math.random(),
    content,
    sender,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isEmoji
  };
  setMessages(prev => [...prev, newMessage]);
  if (sender === 'user') setMessageCount(prev => prev + 1);
};

// Export default App
export default AiGirlfriendApp;