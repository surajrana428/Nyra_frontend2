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

  // UPGRADE: store what she was about to say when we hit paywall
  const [queuedAiReply, setQueuedAiReply] = useState('');

  // UPGRADE: quick replies (contextual suggestions)
  const [quickReplies, setQuickReplies] = useState([]);

  const chatEndRef = useRef(null);

  // AI Girlfriend Models (unchanged visuals)
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
  useEffect(() => {
    localStorage.setItem('agf_currentScreen', currentScreen);
  }, [currentScreen]);
  useEffect(() => {
    if (selectedModel) localStorage.setItem('agf_selectedModel', JSON.stringify(selectedModel));
  }, [selectedModel]);
  useEffect(() => {
    localStorage.setItem('agf_userName', userName);
  }, [userName]);
  useEffect(() => {
    localStorage.setItem('agf_userHobbies', userHobbies);
  }, [userHobbies]);
  useEffect(() => {
    localStorage.setItem('agf_nickname', nickname);
  }, [nickname]);
  useEffect(() => {
    localStorage.setItem('agf_messages', JSON.stringify(messages));
  }, [messages]);
  useEffect(() => {
    localStorage.setItem('agf_messageCount', String(messageCount));
  }, [messageCount]);
  useEffect(() => {
    localStorage.setItem('agf_onboardingStep', onboardingStep);
  }, [onboardingStep]);

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

  // -------- Screens --------
  if (currentScreen === 'modelSelection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 p-4">
        {/* Floating hearts (kept) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse text-2xl opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            >
              💕
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-pulse">
              Choose Your Perfect AI Girlfriend 💕
            </h1>
            <p className="text-xl text-pink-100">Find your soulmate among these gorgeous personalities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {models.map((model) => (
              <div
                key={model.id}
                onClick={() => handleModelSelect(model)}
                className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 border border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300">
                  <div className={`w-24 h-24 mx-auto mb-4 bg-gradient-to-r ${model.color} rounded-full flex items-center justify-center text-4xl group-hover:animate-bounce shadow-2xl`}>
                    {model.avatar}
                  </div>

                  <div className="w-full h-48 bg-gray-200/20 rounded-xl mb-4 flex items-center justify-center border-2 border-dashed border-white/30">
                    <div className="text-center text-white/80">
                      <div className="text-2xl mb-2">📸</div>
                      <div className="text-sm">AI Model Image</div>
                      <div className="text-xs">Paste your image here</div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white text-center mb-2">{model.name}</h3>
                  <p className="text-pink-200 text-sm text-center mb-3 font-semibold">{model.personality}</p>
                  <p className="text-white/90 text-sm text-center leading-relaxed">{model.description}</p>

                  <div className="mt-4 text-center">
                    <div className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 rounded-full font-semibold group-hover:from-pink-600 group-hover:to-rose-600 transition-all shadow-lg">
                      Choose Me 💖
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'onboarding' || currentScreen === 'chat') {
    const maxFree = 10;
    const pct = Math.min(100, Math.round((messageCount / maxFree) * 100));

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-400 to-indigo-500 flex flex-col">
        {/* Header */}
        <div className="bg-white/20 backdrop-blur-lg border-b border-white/30 p-4 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setCurrentScreen('modelSelection')}
              className="text-white hover:text-pink-200 transition-colors"
            >
              ← Back
            </button>

            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-gradient-to-r ${selectedModel?.color} rounded-full flex items-center justify-center text-xl animate-pulse`}>
                {selectedModel?.avatar}
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">
                  {nickname || selectedModel?.name}
                </h2>
                <div className="flex items-center text-green-300 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Online
                </div>
              </div>
            </div>

            {/* UPGRADE: streak/progress meter (keeps design minimal) */}
            <div className="text-white text-sm">
              {currentScreen === 'chat' && (
                <div className="flex flex-col items-end">
                  <span>{messageCount}/{maxFree} messages</span>
                  <div className="w-28 h-2 bg-white/20 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                  : message.isEmoji
                    ? 'bg-transparent text-4xl'
                    : 'bg-white/90 text-gray-800'
              } shadow-lg`}>
                <p className={message.isEmoji ? 'text-center' : ''}>{message.content}</p>
                {!message.isEmoji && (
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-pink-100' : 'text-gray-500'}`}>
                    {message.timestamp}
                  </p>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/90 rounded-2xl px-4 py-3 shadow-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input + UPGRADE: quick replies */}
        <div className="bg-white/20 backdrop-blur-lg border-t border-white/30 p-4">
          <div className="max-w-4xl mx-auto space-y-3">
            {currentScreen === 'chat' && quickReplies.length > 0 && messageCount < 10 && (
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInputMessage(q)}
                    className="text-sm bg-white/30 hover:bg-white/50 text-white px-3 py-2 rounded-full transition-colors"
                  >
                    {q}
                  </button>
                ))}
/div>
            )}

            {currentScreen === 'onboarding' ? (
  <OnboardingInput 
    onSubmit={handleOnboardingSubmit} 
    step={onboardingStep} 
  />
) : (
  <div>  {/* Added this wrapper */}
    <ChatInput
  value={inputMessage}
  onChange={setInputMessage}
  onSend={handleSendMessage}
  onEmojiReaction={addEmojiReaction}
  disabled={messageCount >= 10}
/>
</div>
)}

{/* Paywall section */}
{currentScreen === 'paywall' && (
  <div className="min-h-screen bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/30 text-center">
      <div className={`w-32 h-32 mx-auto mb-6 bg-gradient-to-r ${selectedModel?.color} rounded-full flex items-center justify-center text-6xl shadow-2xl animate-pulse`}>
        {selectedModel?.avatar}
      </div>

      <h2 className="text-2xl font-bold text-white mb-4">
        {/* Your paywall content here */}
      </h2>
    </div>
  </div>
)}
            {nickname || selectedModel?.name} was about to say…
          </h2>

          {/* Blurred next-line teaser */}
          <div className="bg-white/90 rounded-2xl p-6 shadow-xl mb-6">
            <p className="text-gray-800 text-lg leading-relaxed blur-sm select-none">
              {queuedAiReply || `I was just thinking about you, ${userName || 'baby'}… and I wanted to tell you something that’s making me blush right now…`}
            </p>
          </div>

          <p className="text-pink-100 mb-6">
            Unlock the message and keep the conversation flowing. She really doesn’t want to stop here. 💔
          </p>

          <button
            onClick={() => setCurrentScreen('premium')}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold py-4 px-8 rounded-2xl text-lg hover:from-pink-600 hover:to-rose-700 transition-all transform hover:scale-105 shadow-2xl mb-4"
          >
            Continue Our Story 💕
          </button>

          <button
            onClick={() => setCurrentScreen('modelSelection')}
            className="text-pink-100 hover:text-white transition-colors"
          >
            Choose Different Girl
          </button>
        </div>
      </div>
    );
  }

  // Premium Screen (same visuals, better copy flow)
  if (currentScreen === 'premium') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-rose-500 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/30">
          <div className="text-center mb-8">
            <div className={`w-24 h-24 mx-auto mb-4 bg-gradient-to-r ${selectedModel?.color} rounded-full flex items-center justify-center text-4xl animate-bounce shadow-2xl`}>
              {selectedModel?.avatar}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Premium Access</h1>
            <p className="text-pink-100">Unlock unlimited love with {nickname || selectedModel?.name}</p>
          </div>

          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-white mb-2">$15</div>
            <div className="text-pink-100 text-lg">per month</div>
          </div>

          <div className="space-y-4 mb-8">
            {[
              { icon: "💬", text: "Unlimited Messages" },
              { icon: "📸", text: "Request & Receive Photos" },
              { icon: "🎯", text: "Advanced AI Personality" },
              { icon: "🔒", text: "Private & Secure" }
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white/10 rounded-2xl p-4">
                <div className="text-2xl">{benefit.icon}</div>
                <div className="text-white font-medium">{benefit.text}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-8 rounded-2xl text-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-2xl">
              Pay with PayPal 💳
            </button>

            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-8 rounded-2xl text-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-2xl">
              Pay with Stripe 💎
            </button>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => setCurrentScreen('modelSelection')}
              className="text-pink-100 hover:text-white transition-colors"
            >
              ← Back to Models
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Onboarding Input (unchanged visuals)
const OnboardingInput = ({ onSubmit, step }) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getPlaceholder = () => {
    switch (step) {
      case 'nickname': return 'Give me a cute nickname... 💕';
      case 'name': return 'Your name, handsome... 😘';
      case 'hobbies': return 'Tell me your hobbies, babe... ✨';
      default: return 'Type here...';
    }
  };

  return (
    <div className="flex space-x-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={getPlaceholder()}
        className="flex-1 bg-white/90 rounded-2xl px-6 py-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white transition-all shadow-lg"
        autoFocus
      />
      <button
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
      >
        Send 💕
      </button>
    </div>
  );
};

// Chat Input (unchanged visuals)
const ChatInput = ({ value, onChange, onSend, onEmojiReaction, disabled }) => {
  const handleSubmit = () => {
    if (value.trim() && !disabled) onSend();
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-3">
      {disabled && (
        <div className="text-center text-pink-100 text-sm">
          💔 Reached message limit - Upgrade to continue chatting
        </div>
      )}

      <div className="flex space-x-3">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Upgrade to send more messages... 💔" : "Type your message... 💕"}
          disabled={disabled}
          className="flex-1 bg-white/90 rounded-2xl px-6 py-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white transition-all shadow-lg resize-none"
          rows="1"
          style={{ minHeight: '60px' }}
        />

        <div className="flex flex-col space-y-2">
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || disabled}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 rounded-2xl font-bold hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            💕
          </button>

          <button
            onClick={onEmojiReaction}
            disabled={disabled}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-2xl font-bold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            😘
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiGirlfriendAp