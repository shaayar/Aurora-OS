import { AppTemplate } from './AppTemplate';
import { MessageSquare, Users, Archive, Star, Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { useAppStorage } from '../../hooks/useAppStorage';
import { cn } from '../ui/utils';

const messagesSidebar = {
  sections: [
    {
      title: 'Conversations',
      items: [
        { id: 'all', label: 'All Messages', icon: MessageSquare, badge: '12' },
        { id: 'groups', label: 'Groups', icon: Users, badge: '3' },
        { id: 'starred', label: 'Starred', icon: Star },
        { id: 'archived', label: 'Archived', icon: Archive },
      ],
    },
  ],
};

const mockConversations = [
  { id: 1, name: 'Sarah Johnson', lastMessage: 'See you tomorrow!', time: '10:30 AM', unread: 2, avatar: 'bg-pink-500' },
  { id: 2, name: 'Team Design', lastMessage: 'New mockups are ready', time: '9:15 AM', unread: 5, avatar: 'bg-purple-500' },
  { id: 3, name: 'Mike Chen', lastMessage: 'Thanks for the help!', time: 'Yesterday', unread: 0, avatar: 'bg-blue-500' },
  { id: 4, name: 'Project Alpha', lastMessage: 'Meeting at 2pm', time: 'Yesterday', unread: 1, avatar: 'bg-green-500' },
  { id: 5, name: 'Emma Wilson', lastMessage: 'Got it, thanks!', time: 'Monday', unread: 0, avatar: 'bg-orange-500' },
];

const mockMessages = [
  { id: 1, text: 'Hey! How are you doing?', sender: 'other', time: '10:25 AM' },
  { id: 2, text: 'I\'m good, thanks! Working on the new project.', sender: 'me', time: '10:26 AM' },
  { id: 3, text: 'That sounds exciting! Want to grab coffee later?', sender: 'other', time: '10:28 AM' },
  { id: 4, text: 'Sure! How about 3pm?', sender: 'me', time: '10:29 AM' },
  { id: 5, text: 'See you tomorrow!', sender: 'other', time: '10:30 AM' },
  { id: 6, text: 'Futu-ti Cristosu ma-tii de responsive design', sender: 'me', time: '10:30 AM' },
];

export function Messages() {
  // Persisted state
  const [appState, setAppState] = useAppStorage('messages', {
    activeCategory: 'all',
  });


  const [selectedConversationId, setSelectedConversationId] = useState<string | number>(mockConversations[0].id);
  const [messageText, setMessageText] = useState('');
  const { accentColor } = useAppContext();

  const selectedConversation = mockConversations.find(c => c.id === selectedConversationId) || mockConversations[0];
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [selectedConversationId]);

  // Map sidebar items to include badge data if needed, or just use static definition
  // Since AppTemplate expects a static structure for sidebar sections, we can keep the static definition
  // or make it dynamic if we want to show unread counts in the sidebar itself (not implemented in mock yet for categories)

  const content = ({ contentWidth }: { contentWidth: number }) => {
    const isCompact = contentWidth < 400;

    // Calculate conversation list width - ensure it doesn't exceed available space
    // When compact: 80px, otherwise up to 320px but max 30% of content width
    const conversationListWidth = isCompact
      ? 80
      : Math.min(320, Math.floor(contentWidth * 0.3));

    return (
      <div className="flex h-full min-w-0">
        {/* Conversation List */}
        <div
          className={cn(
            "border-r border-white/10 overflow-y-auto flex flex-col shrink-0 transition-all duration-300",
            isCompact && "items-center"
          )}
          style={{ width: `${conversationListWidth}px` }}
        >          <div className={cn("p-3", isCompact && "flex justify-center")}>
            {!isCompact ? (
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 text-sm"
              />
            ) : (
              <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                <MessageSquare className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="space-y-1 px-2 flex-1">
            {mockConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversationId(conversation.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg transition-colors",
                  selectedConversationId === conversation.id ? 'bg-white/10' : 'hover:bg-white/5',
                  isCompact && "justify-center px-0"
                )}
              >
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full ${conversation.avatar} flex items-center justify-center text-white flex-shrink-0`}>
                    {conversation.name[0]}
                  </div>
                  {isCompact && conversation.unread > 0 && (
                    <span
                      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] flex items-center justify-center text-white border-2 border-[#1e1e1e]" // Added border to separate from avatar
                      style={{ backgroundColor: accentColor }}
                    >
                      {conversation.unread}
                    </span>
                  )}
                </div>
                {!isCompact && (
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm truncate">{conversation.name}</span>
                      <span className="text-white/40 text-xs">{conversation.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-xs truncate">{conversation.lastMessage}</span>
                      {conversation.unread > 0 && (
                        <span
                          className="px-1.5 py-0.5 rounded-full text-xs text-white ml-2 flex-shrink-0"
                          style={{ backgroundColor: accentColor }}
                        >
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="h-14 border-b border-white/10 flex items-center px-4 shrink-0">
            <div className={`w-8 h-8 rounded-full ${selectedConversation.avatar} flex items-center justify-center text-white text-sm mr-3 shrink-0`}>
              {selectedConversation.name[0]}
            </div>
            <span className="text-white truncate">{selectedConversation.name}</span>
          </div>

          {/* Messages - Full Width List */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
            {mockMessages.map((message) => {
              const isMe = message.sender === 'me';

              return (
                <div
                  key={message.id}
                  className="px-4 py-3 hover:bg-white/5 transition-colors min-w-0"
                >
                  {/* Message bubble with timestamp */}
                  <div className="flex flex-col gap-1" style={{ alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                    <div
                      className="px-4 py-2 rounded-2xl max-w-[80%]"
                      style={{
                        backgroundColor: isMe ? accentColor : 'rgba(75, 85, 99, 0.4)',
                        color: 'white',
                        borderBottomRightRadius: isMe ? '4px' : '16px',
                        borderBottomLeftRadius: isMe ? '16px' : '4px'
                      }}
                    >
                      <p className="text-sm break-words">{message.text}</p>
                    </div>
                    {/* Timestamp below bubble */}
                    <span className="text-xs text-white/40 px-1">{message.time}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input */}
          <div className="h-16 border-t border-white/10 flex items-center px-4 gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 min-w-0 px-4 py-2 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            <button
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white transition-all hover:opacity-90 flex-shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppTemplate
      sidebar={messagesSidebar}
      content={content}
      hasSidebar={true}
      activeItem={appState.activeCategory}
      onItemClick={(id) => setAppState(s => ({ ...s, activeCategory: id }))}
      minContentWidth={500}
    />
  );
}
