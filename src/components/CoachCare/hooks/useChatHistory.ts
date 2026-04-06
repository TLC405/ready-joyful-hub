import { useState, useCallback, useEffect } from 'react';
import type { ChatMessage } from '../types';

const STORAGE_KEY = 'tlc-coach-chat';

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'coach',
  content: "Welcome to Coach Care Studio. I'm your AI training partner. Paste a YouTube URL for form analysis, ask about any exercise, or let me build you a program. What are we working on?",
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
    } catch {}
  }, [messages]);

  const addMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'timestamp'> & { id?: string; replace?: boolean }) => {
    const { replace: shouldReplace, ...rest } = msg;
    if (shouldReplace && msg.id) {
      // Update existing message in place (for streaming)
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, ...rest } : m));
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

  const clearHistory = useCallback(() => {
    setMessages([welcomeMessage]);
  }, []);

  return { messages, addMessage, clearHistory };
}
