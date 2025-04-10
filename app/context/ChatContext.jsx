// context/ChatContext.js
import React, { createContext, useContext, useState } from 'react';

// Create Context
const ChatContext = createContext();

// Create a custom hook to use the chat context
export const useChatContext = () => {
  return useContext(ChatContext);
};

// ChatProvider component to wrap your app and provide context
const ChatProvider = ({ children }) => {
  const [selectedChatName, setSelectedChatName] = useState('Home'); // Default to "Home"

  return (
    <ChatContext.Provider value={{ selectedChatName, setSelectedChatName }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;


