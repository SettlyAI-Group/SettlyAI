import React, { useState, useRef, useEffect } from 'react';
import {
  MessageOutlined,
  SendOutlined,
  CloseOutlined,
  PaperClipOutlined,
  SmileOutlined,
  AudioOutlined,
  RobotOutlined,
  UserOutlined,
  PlusOutlined,
  ExpandOutlined,
  CompressOutlined,
  HistoryOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined,
  BulbOutlined,
  ThunderboltOutlined,
  RocketOutlined,
} from '@ant-design/icons';

const ChatBotPageV2 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeConversation, setActiveConversation] = useState(1);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content:
        "G'day! I'm your AI assistant 🤖\n\nI can help you with:\n• Technical questions\n• Creative solutions\n• Data analysis\n• Workflow optimization\n\nWhat can I help you with today?",
      time: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Conversation history
  const [conversations, setConversations] = useState([
    { id: 1, title: 'Current chat', preview: 'About chatbot UI design...', active: true },
    { id: 2, title: 'Data analytics', preview: 'Sales dashboard visualisation...', active: false },
    { id: 3, title: 'Code review', preview: 'React performance optimisation...', active: false },
    { id: 4, title: 'Marketing copy', preview: 'Product launch campaign draft...', active: false },
    { id: 5, title: 'Market research', preview: 'Competitor analysis report...', active: false },
    { id: 6, title: 'API documentation', preview: 'RESTful endpoint specifications...', active: false },
    { id: 7, title: 'User feedback', preview: 'Weekly UX issues summary...', active: false },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      time: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setShowGuide(false);

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content:
          "Thanks for your message! I'm analysing your request...\n\nThis is a demo response. In production, this would show the AI's intelligent answer.",
        time: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = action => {
    setInputValue(action);
    inputRef.current?.focus();
    setShowGuide(false);
  };

  const handleConversationClick = id => {
    setActiveConversation(id);
    setConversations(prev =>
      prev.map(conv => ({
        ...conv,
        active: conv.id === id,
      }))
    );
    // Load corresponding history here
  };

  const handleNewConversation = () => {
    const newId = conversations.length + 1;
    const newConv = {
      id: newId,
      title: `New chat ${newId}`,
      preview: 'Click to start a new conversation...',
      active: true,
    };
    setConversations(prev => [newConv, ...prev.map(c => ({ ...c, active: false }))]);
    setActiveConversation(newId);
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: 'New conversation started! How can I help you?',
        time: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Quick action suggestions
  const quickActions = [
    { icon: <BulbOutlined />, text: 'Get ideas', color: '#FAAD14' },
    { icon: <ThunderboltOutlined />, text: 'Quick fix', color: '#52C41A' },
    { icon: <RocketOutlined />, text: 'Start project', color: '#1890FF' },
    { icon: <QuestionCircleOutlined />, text: 'Ask anything', color: '#722ED1' },
  ];

  // Chat window style based on state
  const getChatWindowStyle = () => {
    if (isFullscreen) {
      return {
        width: '100vw',
        height: '100vh',
        bottom: 0,
        right: 0,
        borderRadius: 0,
      };
    }
    return {
      width: window.innerWidth <= 480 ? '100vw' : showHistory ? '640px' : '380px',
      height: window.innerWidth <= 480 ? '100vh' : '680px',
      bottom: window.innerWidth <= 480 ? 0 : '20px',
      right: window.innerWidth <= 480 ? 0 : '20px',
      borderRadius: window.innerWidth <= 480 ? 0 : '16px',
    };
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        
        * {
          box-sizing: border-box;
        }

        .chatbot-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Floating button */
        .floating-button {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #1890FF 0%, #0050B3 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(24, 144, 255, 0.35);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 4px 20px rgba(24, 144, 255, 0.35); }
          50% { box-shadow: 0 4px 30px rgba(24, 144, 255, 0.5); }
          100% { box-shadow: 0 4px 20px rgba(24, 144, 255, 0.35); }
        }

        .floating-button:hover {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 6px 25px rgba(24, 144, 255, 0.45);
        }

        .floating-button.open {
          transform: scale(0) rotate(90deg);
          opacity: 0;
          pointer-events: none;
        }

        .floating-button-icon {
          color: white;
          font-size: 24px;
          animation: bounce 1.5s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-3px) rotate(-5deg); }
          75% { transform: translateY(1px) rotate(5deg); }
        }

        /* Chat window */
        .chat-window {
          position: fixed;
          background: white;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          display: flex;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1001;
          overflow: hidden;
        }

        .chat-window.closed {
          transform: scale(0.8) translateY(20px);
          opacity: 0;
          pointer-events: none;
        }

        /* History sidebar */
        .history-sidebar {
          width: 200px;
          background: #FAFAFA;
          border-right: 1px solid #F0F0F0;
          display: flex;
          flex-direction: column;
          transition: all 0.3s;
        }

        .history-sidebar.hidden {
          width: 0;
          opacity: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .history-header {
          height: 56px;
          padding: 0 16px;
          background: linear-gradient(135deg, #1890FF 0%, #0050B3 100%);
          display: flex;
          align-items: center;
          color: white;
          font-size: 14px;
          font-weight: 500;
          gap: 8px;
          flex-shrink: 0;
        }

        .new-chat-btn {
          padding: 6px 12px;
          margin: 10px;
          background: white;
          border: 1px dashed #D9D9D9;
          border-radius: 6px;
          color: #595959;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .new-chat-btn:hover {
          border-color: #1890FF;
          color: #1890FF;
          background: #E6F7FF;
        }

        .history-list {
          flex: 1;
          overflow-y: auto;
          padding: 0 8px 8px 8px;
        }

        .history-item {
          padding: 8px 10px;
          margin-bottom: 2px;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .history-item:hover {
          background: #F5F5F5;
          transform: translateX(2px);
        }

        .history-item.active {
          background: #E6F7FF;
          border-left: 2px solid #1890FF;
        }

        .history-item-title {
          font-size: 13px;
          font-weight: 500;
          color: #262626;
        }

        .history-item-preview {
          font-size: 11px;
          color: #8C8C8C;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100%;
        }

        /* Main chat area */
        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        /* Header */
        .chat-header {
          height: 56px;
          background: linear-gradient(135deg, #1890FF 0%, #0050B3 100%);
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: white;
          flex-shrink: 0;
        }

        .chat-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .menu-toggle {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .menu-toggle:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .chat-avatar {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .chat-info {
          display: flex;
          flex-direction: column;
        }

        .chat-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 1px;
        }

        .chat-status {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          opacity: 0.9;
        }

        .status-dot {
          width: 5px;
          height: 5px;
          background: #52C41A;
          border-radius: 50%;
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .chat-header-actions {
          display: flex;
          gap: 6px;
        }

        .header-action {
          width: 30px;
          height: 30px;
          background: rgba(255, 255, 255, 0.15);
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          font-size: 14px;
        }

        .header-action:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
        }

        /* Messages area - Bubble style */
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: linear-gradient(to bottom, #F5F7FA 0%, #FFFFFF 100%);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* User guide - Compact design */
        .guide-container {
          background: linear-gradient(135deg, #E6F7FF 0%, #F0F5FF 100%);
          border: 1px solid #91D5FF;
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 12px;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .guide-title {
          font-size: 12px;
          color: #0050B3;
          font-weight: 500;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .guide-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
        }

        .guide-action {
          background: white;
          border: 1px solid #D9D9D9;
          border-radius: 6px;
          padding: 8px 10px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .guide-action:hover {
          border-color: #40A9FF;
          box-shadow: 0 2px 6px rgba(24, 144, 255, 0.15);
          transform: translateY(-1px);
        }

        .guide-action-icon {
          font-size: 16px;
        }

        .guide-action-text {
          font-size: 11px;
          color: #262626;
        }

        /* Bubble style messages */
        .message {
          display: flex;
          gap: 10px;
          animation: messageSlide 0.3s ease;
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 16px;
        }

        .message.ai .message-avatar {
          background: linear-gradient(135deg, #E6F7FF, #BAE7FF);
          color: #0050B3;
        }

        .message.user .message-avatar {
          background: linear-gradient(135deg, #1890FF, #0050B3);
          color: white;
        }

        .message-content-wrapper {
          display: flex;
          flex-direction: column;
          max-width: 70%;
          position: relative;
        }

        /* Bubble component style */
        .message-bubble {
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.6;
          white-space: pre-wrap;
          word-wrap: break-word;
          position: relative;
        }

        .message.ai .message-bubble {
          background: white;
          color: #262626;
          border: 1px solid #F0F0F0;
          border-top-left-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
        }

        .message.user .message-bubble {
          background: linear-gradient(135deg, #1890FF 0%, #0050B3 100%);
          color: white;
          border-top-right-radius: 4px;
          box-shadow: 0 2px 8px rgba(24, 144, 255, 0.25);
        }

        .message-bubble::before {
          content: '';
          position: absolute;
          top: 12px;
          width: 0;
          height: 0;
          border-style: solid;
        }

        .message.ai .message-bubble::before {
          left: -6px;
          border-width: 6px 6px 6px 0;
          border-color: transparent white transparent transparent;
        }

        .message.user .message-bubble::before {
          right: -6px;
          border-width: 6px 0 6px 6px;
          border-color: transparent transparent transparent #0050B3;
        }

        .message-time {
          font-size: 11px;
          color: #8C8C8C;
          margin-top: 4px;
          opacity: 0;
          transition: opacity 0.2s;
          text-align: right;
        }

        .message.user .message-time {
          text-align: left;
        }

        .message-content-wrapper:hover .message-time {
          opacity: 1;
        }

        /* Typing animation */
        .typing-indicator {
          display: flex;
          gap: 10px;
          animation: messageSlide 0.3s ease;
        }

        .typing-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #E6F7FF, #BAE7FF);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0050B3;
          font-size: 16px;
        }

        .typing-bubble {
          background: white;
          border: 1px solid #F0F0F0;
          padding: 12px 16px;
          border-radius: 16px;
          border-top-left-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .typing-dot {
          width: 8px;
          height: 8px;
          background: #8C8C8C;
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            background: #8C8C8C;
          }
          30% {
            transform: translateY(-10px);
            background: #1890FF;
          }
        }

        /* Sender style input area */
        .input-container {
          padding: 16px 20px;
          background: white;
          border-top: 1px solid #F0F0F0;
          flex-shrink: 0;
        }

        .input-wrapper {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }

        .input-box {
          flex: 1;
          background: #F5F7FA;
          border: 1px solid #D9D9D9;
          border-radius: 20px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .input-box:focus-within {
          background: white;
          border-color: #40A9FF;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
        }

        .input-field {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          font-size: 14px;
          font-family: inherit;
          resize: none;
          max-height: 80px;
          line-height: 1.5;
        }

        .input-actions {
          display: flex;
          gap: 4px;
        }

        .input-action {
          width: 28px;
          height: 28px;
          border: none;
          background: none;
          color: #8C8C8C;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s;
          font-size: 16px;
        }

        .input-action:hover {
          background: #F0F5FF;
          color: #1890FF;
        }

        .send-button {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #1890FF 0%, #0050B3 100%);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          font-size: 16px;
        }

        .send-button:hover:not(:disabled) {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(24, 144, 255, 0.35);
        }

        .send-button:active {
          transform: scale(0.95);
        }

        .send-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .history-sidebar {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            z-index: 10;
            box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
          }

          .guide-actions {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .floating-button {
            bottom: 20px;
            right: 20px;
            width: 52px;
            height: 52px;
          }

          .chat-header {
            padding: 0 12px;
          }

          .messages-container {
            padding: 16px;
          }

          .input-container {
            padding: 12px 16px;
          }

          .message-content-wrapper {
            max-width: 85%;
          }
        }

        /* Scrollbar styling */
        .messages-container::-webkit-scrollbar,
        .history-list::-webkit-scrollbar {
          width: 6px;
        }

        .messages-container::-webkit-scrollbar-track,
        .history-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .messages-container::-webkit-scrollbar-thumb,
        .history-list::-webkit-scrollbar-thumb {
          background: #D9D9D9;
          border-radius: 3px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover,
        .history-list::-webkit-scrollbar-thumb:hover {
          background: #BFBFBF;
        }
      `}</style>

      <div className="chatbot-container">
        {/* Floating trigger button */}
        <div className={`floating-button ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(true)}>
          <MessageOutlined className="floating-button-icon" />
        </div>

        {/* Chat window */}
        <div className={`chat-window ${!isOpen ? 'closed' : ''}`} style={getChatWindowStyle()}>
          {/* History sidebar */}
          <div className={`history-sidebar ${!showHistory ? 'hidden' : ''}`}>
            <div className="history-header">
              <HistoryOutlined />
              <span>Chat History</span>
            </div>

            <button className="new-chat-btn" onClick={handleNewConversation}>
              <PlusOutlined />
              <span>New chat</span>
            </button>

            <div className="history-list">
              {conversations.map(conv => (
                <div
                  key={conv.id}
                  className={`history-item ${conv.active ? 'active' : ''}`}
                  onClick={() => handleConversationClick(conv.id)}
                >
                  <div className="history-item-title">{conv.title}</div>
                  <div className="history-item-preview">{conv.preview}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Main chat area */}
          <div className="chat-main">
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-left">
                <button className="menu-toggle" onClick={() => setShowHistory(!showHistory)} title="History">
                  {showHistory ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                </button>
                <div className="chat-avatar">
                  <RobotOutlined />
                </div>
                <div className="chat-info">
                  <div className="chat-title">AI Assistant</div>
                  <div className="chat-status">
                    <span className="status-dot"></span>
                    <span>Online</span>
                  </div>
                </div>
              </div>
              <div className="chat-header-actions">
                <button
                  className="header-action"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
                </button>
                <button className="header-action" onClick={() => setIsOpen(false)} title="Close">
                  <CloseOutlined />
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div className="messages-container">
              {/* User guide - Compact design */}
              {showGuide && (
                <div className="guide-container">
                  <div className="guide-title">
                    <BulbOutlined />
                    Quick Start
                  </div>
                  <div className="guide-actions">
                    {quickActions.map((action, index) => (
                      <div key={index} className="guide-action" onClick={() => handleQuickAction(action.text)}>
                        <span className="guide-action-icon" style={{ color: action.color }}>
                          {action.icon}
                        </span>
                        <span className="guide-action-text">{action.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {messages.map(message => (
                <div key={message.id} className={`message ${message.type}`}>
                  <div className="message-avatar">{message.type === 'ai' ? <RobotOutlined /> : <UserOutlined />}</div>
                  <div className="message-content-wrapper">
                    <div className="message-bubble">{message.content}</div>
                    <div className="message-time">{message.time}</div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="typing-indicator">
                  <div className="typing-avatar">
                    <RobotOutlined />
                  </div>
                  <div className="typing-bubble">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Sender style input area */}
            <div className="input-container">
              <div className="input-wrapper">
                <div className="input-box">
                  <input
                    ref={inputRef}
                    className="input-field"
                    placeholder="Type a message..."
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyPress={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <div className="input-actions">
                    <button className="input-action" title="Attach file">
                      <PaperClipOutlined />
                    </button>
                    <button className="input-action" title="Emoji">
                      <SmileOutlined />
                    </button>
                    <button className="input-action" title="Voice">
                      <AudioOutlined />
                    </button>
                  </div>
                </div>
                <button className="send-button" onClick={handleSend} disabled={!inputValue.trim()}>
                  <SendOutlined />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBotPageV2;
