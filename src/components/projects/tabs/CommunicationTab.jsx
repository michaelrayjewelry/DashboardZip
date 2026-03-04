import React, { useState } from 'react';
import { Section, ChatBubble } from '../ProjectComponents';

const CHANNELS = ['All', 'Client', 'CAD Designer', 'Manufacturer', 'Internal Notes'];

export default function CommunicationTab({ project }) {
  const [activeChannel, setActiveChannel] = useState('All');
  const messages = project.messages || [];

  const filtered = activeChannel === 'All'
    ? messages
    : messages.filter(m => m.channel === activeChannel);

  return (
    <div className="communication-tab">
      <div className="channel-pills">
        {CHANNELS.map(ch => (
          <button
            key={ch}
            className={`channel-pill ${activeChannel === ch ? 'channel-pill--active' : ''}`}
            onClick={() => setActiveChannel(ch)}
          >
            {ch}
          </button>
        ))}
      </div>

      <Section label="Messages" count={filtered.length}>
        {filtered.length > 0 ? (
          <div className="chat-thread">
            {filtered.map(msg => <ChatBubble key={msg.id} message={msg} />)}
          </div>
        ) : (
          <p className="text-muted">No messages in this channel yet.</p>
        )}
      </Section>

      <div className="chat-input-bar">
        <input className="chat-input" placeholder="Type a message..." />
        <button className="btn btn--sm btn--primary">Send</button>
      </div>
    </div>
  );
}
