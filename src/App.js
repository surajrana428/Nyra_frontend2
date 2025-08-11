import React, { useState } from 'react';

// ===== ALL CODE IN ONE FILE (APP.JS) =====
const App = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  
  // Profile data
  const profiles = [
    { id: 1, name: "Angela", age: 26, bio: "Tech-savvy engineer who builds robots for a living...", color: "from-purple-500 to-pink-500" },
    { id: 2, name: "Aria", age: 24, bio: "Esports player and content creator...", color: "from-blue-400 to-cyan-300" },
    { id: 3, name: "Elisa", age: 25, bio: "Waitress at a high-end restaurant...", color: "from-amber-500 to-orange-400" },
    // Add more profiles here
  ];

  // Profile Card Component (embedded)
  const ProfileCard = ({ profile, onClick }) => (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
      onClick={onClick}
    >
      <div className={`h-3 bg-gradient-to-r ${profile.color}`} />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800">{profile.name} <span className="text-gray-500">{profile.age}</span></h2>
        <p className="mt-2 text-gray-600">{profile.bio}</p>
        <button className="mt-4 w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition">
          Chat Now
        </button>
      </div>
    </div>
  );

  // Chat Interface Component (embedded)
  const ChatInterface = ({ profile, onBack }) => (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
        >
          ← Back
        </button>
        
        <div className="flex items-center mb-8">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${profile.color}`} />
          <h2 className="ml-4 text-2xl font-bold">{profile.name} <span className="text-gray-400">{profile.age}</span></h2>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 h-96 overflow-y-auto mb-6">
          <div className="text-center text-gray-400 mt-32">
            Start chatting with {profile.name}!
          </div>
        </div>

        <div className="flex">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-grow p-4 bg-gray-700 rounded-l-lg focus:outline-none"
          />
          <button className="px-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-r-lg hover:opacity-90 transition">
            Send
          </button>
        </div>
      </div>
    </div>
  );

  // Main Render
  return (
    <div className="min-h-screen bg-gray-100">
      {!selectedProfile ? (
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Create your AI girlfriend
          </h1>
          <p className="text-xl text-gray-600 text-center mb-12">
            Connect with your favorite AI companion
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profiles.map((profile) => (
              <ProfileCard 
                key={profile.id} 
                profile={profile} 
                onClick={() => setSelectedProfile(profile)}
              />
            ))}
          </div>
        </div>
      ) : (
        <ChatInterface profile={selectedProfile} onBack={() => setSelectedProfile(null)} />
      )}
    </div>
  );
};

export default App;