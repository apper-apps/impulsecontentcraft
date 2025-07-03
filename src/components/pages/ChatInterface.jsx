import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { getMyAgents, getChatHistory, sendMessage, exportChatHistory } from '@/services/api/chatService';

const ChatInterface = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAgents();
  }, []);

  useEffect(() => {
    if (agentId && agents.length > 0) {
      const agent = agents.find(a => a.Id === parseInt(agentId));
      if (agent) {
        setSelectedAgent(agent);
        loadChatHistory(agent.Id);
      }
    }
  }, [agentId, agents]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadAgents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMyAgents();
      setAgents(data);
      
      if (data.length === 0) {
        setError('No agents available');
        return;
      }

      if (!agentId && data.length > 0) {
        const firstAgent = data[0];
        setSelectedAgent(firstAgent);
        loadChatHistory(firstAgent.Id);
        navigate(`/chat/${firstAgent.Id}`, { replace: true });
      }
    } catch (err) {
      setError('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const loadChatHistory = async (agentId) => {
    try {
      const history = await getChatHistory(agentId);
      setMessages(history);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  const handleAgentSelect = (agent) => {
    setSelectedAgent(agent);
    setMessages([]);
    navigate(`/chat/${agent.Id}`);
    loadChatHistory(agent.Id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedAgent || sending) return;

    const userMessage = {
      Id: Date.now(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setSending(true);

    try {
      const response = await sendMessage(selectedAgent.Id, newMessage);
      setMessages(prev => [...prev, response]);
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleExportChat = async () => {
    if (!selectedAgent || messages.length === 0) return;

    try {
      await exportChatHistory(selectedAgent.Id);
      toast.success('Chat history exported successfully!');
    } catch (err) {
      toast.error('Failed to export chat history');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <Loading type="chat" />;
  if (error) return <Error message={error} onRetry={loadAgents} />;

  if (agents.length === 0) {
    return (
      <div className="p-6">
        <Empty
          type="agents"
          onAction={() => navigate('/marketplace')}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Agent Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-display font-semibold text-gray-900 mb-3">Your Agents</h2>
          <div className="space-y-2">
            {agents.map((agent) => (
              <button
                key={agent.Id}
                onClick={() => handleAgentSelect(agent)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  selectedAgent?.Id === agent.Id
                    ? 'bg-gradient-primary text-white shadow-primary'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedAgent?.Id === agent.Id ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  <ApperIcon 
                    name={agent.icon} 
                    className={`w-5 h-5 ${
                      selectedAgent?.Id === agent.Id ? 'text-white' : 'text-gray-600'
                    }`} 
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-medium ${
                    selectedAgent?.Id === agent.Id ? 'text-white' : 'text-gray-900'
                  }`}>
                    {agent.name}
                  </p>
                  <p className={`text-sm ${
                    selectedAgent?.Id === agent.Id ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {agent.category}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedAgent && (
          <div className="p-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">{selectedAgent.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{selectedAgent.description}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportChat}
                icon="Download"
                className="w-full"
              >
                Export Chat
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedAgent ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <ApperIcon name={selectedAgent.icon} className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-gray-900">
                      {selectedAgent.name}
                    </h3>
                    <p className="text-sm text-gray-600">{selectedAgent.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4">
                    <ApperIcon name={selectedAgent.icon} className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
                    Start a conversation with {selectedAgent.name}
                  </h3>
                  <p className="text-gray-600 mb-4 max-w-md">
                    Ask me anything about {selectedAgent.category.toLowerCase()}. I'm here to help you create amazing content!
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] p-4 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-gradient-primary text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              
              {sending && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 p-4 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message ${selectedAgent.name}...`}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!newMessage.trim() || sending}
                  icon="Send"
                  className="px-6"
                >
                  Send
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="MessageCircle" className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
                Select an agent to start chatting
              </h3>
              <p className="text-gray-600">
                Choose an AI agent from the sidebar to begin creating content.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;