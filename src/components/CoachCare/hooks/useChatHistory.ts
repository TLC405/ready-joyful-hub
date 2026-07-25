import { useCallback, useEffect, useState } from 'react';
import type { ChatMessage } from '../types';

const STORAGE_KEY = 'tlc-ai-chat-v1';

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'coach',
  content: "Welcome to **TLC AI**. I can use your assessment to explain what to train, point you to the right path, find an exercise, or help adjust your current plan. What do you want help with?",
  timestamp: new Date().toISOString(),
  type: 'text',
};

export function useChatHistory() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === 'undefined') return [welcomeMessage];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [welcomeMessage];
    } catch {
      return [welcomeMessage];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch { /* storage may be unavailable */ }
  }, [messages]);

  const addMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'timestamp'> & { id?: string; replace?: boolean }) => {
    const { replace: shouldReplace, ...rest } = msg;
    if (shouldReplace && msg.id) {
      setMessages(prev => prev.map(message => message.id === msg.id ? { ...message, ...rest } : message));
      return { ...rest, id: msg.id, timestamp: new Date().toISOString() } as ChatMessage;
    }
    const newMsg: ChatMessage = {
      ...rest,
      id: msg.id || crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMsg]);
    return newMsg;
  }, []);

  const clearHistory = useCallback(() => setMessages([welcomeMessage]), []);

  return { messages, addMessage, clearHistory };
}
