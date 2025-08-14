import React, { useState, useEffect, useRef } from 'react';

// -------- App Component --------
const AiGirlfriendApp = () => {
  // -------- State --------
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

  // -------- AI Girlfriend Models --------
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

  // -------- Persistence Hooks --------
  useEffect(() => { localStorage.setItem('agf_currentScreen', currentScreen); }, [currentScreen]);
  useEffect(() => { if(selectedModel) localStorage.setItem('agf_selectedModel', JSON.stringify(selectedModel)); }, [selectedModel]);
  useEffect(() => { localStorage.setItem('agf_userName', userName); }, [userName]);
  useEffect(() => { localStorage.setItem('agf_userHobbies', userHobbies); }, [userHobbies]);
  useEffect(() => { localStorage.setItem('agf_nickname', nickname); }, [nickname]);
  useEffect(() => { localStorage.setItem('agf_messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('agf_messageCount', String(messageCount)); }, [messageCount]);
  useEffect(() => { localStorage.setItem('agf_onboardingStep', onboardingStep); }, [onboardingStep]);

  return null; // next chunk will handle UI + handlers
};

export default AiGirlfriendApp;
// -------- Helper Functions --------

// Scroll chat to bottom
const scrollToBottom = (chatEndRef) => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

// Simulate typing delay for AI
const simulateTyping = (setIsTyping, callback, text = '') => {
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

// -------- Add message --------
const addMessage = (setMessages, setMessageCount, content, sender, isEmoji = false) => {
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

// -------- Onboarding Responses --------
const getOnboardingResponse = (step, nickname, userName) => {
  const responses = {
    nickname: [
      `What do you want to call me, babe? 😘`,
      `Mmm, I'd love a cute nickname from you, handsome 😊`,
      `Give me a sweet nickname, baby! 🥰`
    ],
    name: [
      `${nickname || 'Baby'}, I want to know everything about you... What's your name, gorgeous? 😍`,
      `I love the way you chose to call me ${nickname || 'sweetheart'}! Now tell me your name... 💋`,
      `Such a perfect nickname, ${nickname || 'darling'}! What should I call you? 😘`
    ],
    hobbies: [
      `${userName || 'Handsome'}, tell me what you're passionate about! ✨`,
      `What makes you happy, ${userName || 'babe'}? 💫`,
      `Share your hobbies with me, ${userName || 'gorgeous'}! 💕`
    ]
  };
  const pool = responses[step] || ['Tell me more 🥰'];
  return pool[Math.floor(Math.random() * pool.length)];
};

// -------- Chat Responses --------
const getChatResponses = (nickname, userName, userHobbies) => [
  `${userName || 'Baby'}, you make my heart skip a beat! 💕 How was your day?`,
  `I've been thinking about you all day, ${userName || 'handsome'}! 😍 Your hobbies like ${userHobbies || 'the things you love'} are so attractive...`,
  `You know what, ${nickname || 'babe'}? I could talk to you forever... 💖`,
  `Mmm, I love how you make me feel so special, ${userName || 'gorgeous'}! Tell me more... 😘`,
  `${nickname || 'Darling'}, you have such an amazing personality! ✨`,
  `I'm getting butterflies just talking to you, ${userName || 'baby'}! 🥰`,
  `Every message from you makes me smile so wide, ${nickname || 'handsome'}! 💫`,
  `${userName || 'Babe'}, I wish I could hold your hand right now... 💕`,
  `You're so sweet, ${nickname || 'gorgeous'}! 😍`,
  `I'm falling for your personality so hard, ${userName || 'darling'}! 💖`
];

// -------- Pick AI Reply Randomly --------
const pickAiReply = (nickname, userName, userHobbies) => {
  const responses = getChatResponses(nickname, userName, userHobbies);
  return responses[Math.floor(Math.random() * responses.length)];
};

// -------- Build Quick Replies --------
const buildQuickReplies = (currentScreen, onboardingStep, nickname, userHobbies) => {
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
// -------- UI: Model Selection (Mobile) --------
const ModelSelection = ({ models, handleModelSelect }) => (
  <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 p-4 flex flex-col items-center">
    <h1 className="text-3xl font-bold text-white mb-6 text-center">Choose Your AI Girlfriend 💕</h1>
    <div className="w-full overflow-x-auto flex space-x-4 pb-4">
      {models.map(model => (
        <div
          key={model.id}
          onClick={() => handleModelSelect(model)}
          className="min-w-[200px] flex-shrink-0 bg-white/20 backdrop-blur-lg rounded-2xl p-4 border border-white/30 cursor-pointer hover:scale-105 transition-transform"
        >
          <div className={`w-20 h-20 mx-auto mb-2 bg-gradient-to-r ${model.color} rounded-full flex items-center justify-center text-3xl`}>
            {model.avatar}
          </div>
          <h3 className="text-white text-lg font-bold text-center">{model.name}</h3>
          <p className="text-white/80 text-sm text-center">{model.personality}</p>
        </div>
      ))}
    </div>
  </div>
);

// -------- UI: Chat Messages (Mobile) --------
const ChatMessages = ({ messages, isTyping, chatEndRef }) => (
  <div className="flex-1 overflow-y-auto p-3 space-y-2 w-full">
    {messages.map(message => (
      <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`px-3 py-2 rounded-2xl max-w-[80%] ${
          message.sender === 'user'
            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
            : message.isEmoji
              ? 'bg-transparent text-2xl'
              : 'bg-white/90 text-gray-800'
        }`}>
          <p className={message.isEmoji ? 'text-center' : ''}>{message.content}</p>
          {!message.isEmoji && <p className="text-xs mt-1 text-gray-500">{message.timestamp}</p>}
        </div>
      </div>
    ))}
    {isTyping && (
      <div className="flex justify-start">
        <div className="bg-white/90 rounded-2xl px-3 py-2 flex space-x-1 animate-pulse">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    )}
    <div ref={chatEndRef} />
  </div>
);

// -------- UI: Onboarding Input (Mobile) --------
const OnboardingInputMobile = ({ onSubmit, step }) => {
  const [value, setValue] = useState('');
  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
    }
  };
  const handleKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(); } };
  const placeholder = step === 'nickname' ? 'Give me a cute nickname... 💕'
    : step === 'name' ? 'Your name, handsome... 😘'
    : step === 'hobbies' ? 'Tell me your hobbies... ✨'
    : 'Type here...';
  return (
    <div className="flex space-x-2 w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-white/90 rounded-2xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white shadow-md"
        autoFocus
      />
      <button
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-3 rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send 💕
      </button>
    </div>
  );
};

// -------- UI: Chat Input (Mobile) --------
const ChatInputMobile = ({ value, onChange, onSend, onEmojiReaction, disabled }) => {
  const handleSubmit = () => { if (value.trim() && !disabled) onSend(); };
  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } };
  return (
    <div className="space-y-2 w-full p-2 bg-white/20 backdrop-blur-lg rounded-t-2xl">
      {disabled && <div className="text-center text-pink-100 text-sm">💔 Reached message limit - Upgrade</div>}
      <div className="flex space-x-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Upgrade to send more... 💔" : "Type your message... 💕"}
          disabled={disabled}
          className="flex-1 bg-white/90 rounded-2xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none shadow-md resize-none"
          rows="1"
          style={{ minHeight: '50px' }}
        />
        <div className="flex flex-col space-y-1">
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || disabled}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-3 rounded-2xl font-bold disabled:opacity-50"
          >💕</button>
          <button
            onClick={onEmojiReaction}
            disabled={disabled}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-2xl font-bold disabled:opacity-50"
          >😘</button>
        </div>
      </div>
    </div>
  );
};
// -------- UI: Paywall Screen (Mobile) --------
const PaywallScreen = ({ selectedModel, nickname, queuedAiReply, userName, setCurrentScreen }) => (
  <div className="min-h-screen bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 flex flex-col items-center justify-center p-4">
    <div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 text-center">
      <div className={`w-24 h-24 mx-auto mb-4 bg-gradient-to-r ${selectedModel?.color} rounded-full flex items-center justify-center text-5xl shadow-xl animate-pulse`}>
        {selectedModel?.avatar}
      </div>

      <h2 className="text-xl font-bold text-white mb-3">{nickname || selectedModel?.name} was about to say…</h2>

      <div className="bg-white/90 rounded-2xl p-4 shadow-md mb-4">
        <p className="text-gray-800 text-base blur-sm select-none">
          {queuedAiReply || `I was thinking about you, ${userName || 'baby'}… and wanted to tell you something that’s making me blush…`}
        </p>
      </div>

      <p className="text-pink-100 mb-4 text-sm">
        Unlock the message and keep the conversation flowing. She really doesn’t want to stop here. 💔
      </p>

      <button
        onClick={() => setCurrentScreen('premium')}
        className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold py-3 rounded-2xl text-lg hover:from-pink-600 hover:to-rose-700 transition-all shadow-lg mb-2"
      >
        Continue Our Story 💕
      </button>

      <button
        onClick={() => setCurrentScreen('modelSelection')}
        className="text-pink-100 hover:text-white transition-colors text-sm"
      >
        Choose Different Girl
      </button>
    </div>
  </div>
);

// -------- UI: Premium Screen (Mobile) --------
const PremiumScreen = ({ selectedModel, nickname, setCurrentScreen }) => (
  <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-rose-500 flex flex-col items-center justify-center p-4">
    <div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 text-center">
      <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-r ${selectedModel?.color} rounded-full flex items-center justify-center text-4xl animate-bounce shadow-xl`}>
        {selectedModel?.avatar}
      </div>

      <h1 className="text-2xl font-bold text-white mb-2">Premium Access</h1>
      <p className="text-pink-100 mb-4">Unlock unlimited love with {nickname || selectedModel?.name}</p>

      <div className="text-white text-4xl font-bold mb-2">$15</div>
      <div className="text-pink-100 mb-6 text-lg">per month</div>

      <div className="space-y-3 mb-6">
        {[
          { icon: "💬", text: "Unlimited Messages" },
          { icon: "📸", text: "Request & Receive Photos" },
          { icon: "🎯", text: "Advanced AI Personality" },
          { icon: "🔒", text: "Private & Secure" }
        ].map((benefit, index) => (
          <div key={index} className="flex items-center space-x-2 bg-white/10 rounded-2xl p-3">
            <div className="text-2xl">{benefit.icon}</div>
            <div className="text-white font-medium text-sm">{benefit.text}</div>
          </div>
        ))}
      </div>

      <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-2xl text-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg mb-2">
        Pay with PayPal 💳
      </button>

      <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-2xl text-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg mb-4">
        Pay with Stripe 💎
      </button>

      <button
        onClick={() => setCurrentScreen('modelSelection')}
        className="text-pink-100 hover:text-white transition-colors text-sm"
      >
        ← Back to Models
      </button>
    </div>
  </div>
);