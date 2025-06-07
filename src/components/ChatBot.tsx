
import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Vruksha assistant. How can I help you today?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const faqResponses = {
    'upload': 'To upload content, go to the Upload Content section from the sidebar. You can upload various file types including videos, documents, and images.',
    'help': 'I can help you with uploading content, viewing your activities, and navigating the platform. What specific assistance do you need?',
    'formats': 'Supported formats include: Text files, Videos (MP4, AVI), Audio (MP3, WAV), Images (JPG, PNG), PDFs, DOCX, and PowerPoint presentations.',
    'status': 'You can check your content status in the Previous Activities section. Content goes through ML validation before approval.',
    'reject': 'If content is rejected, it\'s usually due to inappropriate content, quality issues, or sensitive information. You can re-upload after making necessary changes.',
    'default': 'I understand you need help. Try asking about: uploading content, file formats, content status, or general help.'
  };

  const getResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('upload') || message.includes('submit')) {
      return faqResponses.upload;
    } else if (message.includes('format') || message.includes('file')) {
      return faqResponses.formats;
    } else if (message.includes('status') || message.includes('check')) {
      return faqResponses.status;
    } else if (message.includes('reject') || message.includes('denied')) {
      return faqResponses.reject;
    } else if (message.includes('help')) {
      return faqResponses.help;
    } else {
      return faqResponses.default;
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getResponse(inputValue),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInputValue('');
  };

  const quickQuestions = [
    'How to upload content?',
    'What file formats are supported?',
    'How to check content status?',
    'Why was my content rejected?'
  ];

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-96 bg-white border border-green-200 rounded-lg shadow-xl z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Vruksha Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.isBot ? "justify-start" : "justify-end"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-lg text-sm",
                    message.isBot
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-green-500 text-white"
                  )}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="p-3 border-t border-green-100">
              <p className="text-xs text-green-600 mb-2">Quick questions:</p>
              <div className="space-y-1">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(question)}
                    className="block w-full text-left text-xs text-green-700 hover:text-green-800 p-1 hover:bg-green-50 rounded"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-green-100 flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button onClick={handleSend} size="sm" className="bg-green-500 hover:bg-green-600">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
