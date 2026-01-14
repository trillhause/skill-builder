'use client';

import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Plus } from 'lucide-react';

const MOCK_THREADS = [
  { id: 'thread1', name: 'Build Blog Extractor', updated: '2 hours ago' },
  { id: 'thread2', name: 'Build API Client', updated: '1 day ago' },
  { id: 'thread3', name: 'Build Data Parser', updated: '3 days ago' }
];

export default function BuilderSidebar() {
  const { openTab, tabs, activeTabId } = useWorkspace();

  const activeTab = tabs.find(t => t.id === activeTabId);
  const activeThreadId = activeTab?.type === 'builder-chat' ? activeTab.threadId : undefined;

  const handleThreadClick = (threadId: string, threadName: string) => {
    openTab({
      id: `builder-${threadId}`,
      type: 'builder-chat',
      title: threadName,
      threadId,
      isClosable: true
    });
  };

  return (
    <div className="sidebar-content">
      <div className="sidebar-header">
        <h3>Builder Threads</h3>
        <button className="sidebar-add-button" title="New Thread">
          <Plus size={16} />
        </button>
      </div>
      <div className="sidebar-list">
        {MOCK_THREADS.map((thread) => (
          <div
            key={thread.id}
            className={`sidebar-list-item ${activeThreadId === thread.id ? 'active' : ''}`}
            onClick={() => handleThreadClick(thread.id, thread.name)}
          >
            <span className="sidebar-item-name">{thread.name}</span>
            <span className="sidebar-item-meta">{thread.updated}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
