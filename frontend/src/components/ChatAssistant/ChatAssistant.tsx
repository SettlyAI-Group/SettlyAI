import { useState } from 'react';
import { MessageOutlined } from '@ant-design/icons';
import ChatWindow from './components/ChatWindow';
import { divIcon } from 'leaflet';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

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
          border: none;
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

        /* Responsive design for button */
        @media (max-width: 480px) {
          .floating-button {
            bottom: 20px;
            right: 20px;
            width: 52px;
            height: 52px;
          }

          .floating-button-icon {
            font-size: 22px;
          }
        }
      `}</style>

      <div className="chatbot-container">
        {/* Floating trigger button */}
        <button
          className={`floating-button ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant"
        >
          <MessageOutlined className="floating-button-icon" />
        </button>

        {/* Chat window */}
        {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
      </div>
    </>
  );
};

export default ChatAssistant;
