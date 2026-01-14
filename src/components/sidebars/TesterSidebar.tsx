'use client';

import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Plus } from 'lucide-react';

const MOCK_TEST_THREADS = [
  { id: 'test1', name: 'Test Blog Extraction', updated: '1 hour ago' },
  { id: 'test2', name: 'Test Error Handling', updated: '4 hours ago' },
  { id: 'test3', name: 'Test Edge Cases', updated: '2 days ago' }
];

export default function TesterSidebar() {
  const { openTab, tabs, activeTabId } = useWorkspace();

  const activeTab = tabs.find(t => t.id === activeTabId);
  const activeThreadId = activeTab?.type === 'tester-run' ? activeTab.threadId : undefined;

  const handleThreadClick = (threadId: string, threadName: string) => {
    openTab({
      id: `tester-${threadId}`,
      type: 'tester-run',
      title: threadName,
      threadId,
      isClosable: true
    });
  };

  return (
    <div className="sidebar-content">
      <div className="sidebar-header">
        <h3>Test Threads</h3>
        <button className="sidebar-add-button" title="New Test">
          <Plus size={16} />
        </button>
      </div>
      <div className="sidebar-list">
        {MOCK_TEST_THREADS.map((thread) => (
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
