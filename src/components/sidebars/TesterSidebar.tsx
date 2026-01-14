'use client';

import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Plus } from 'lucide-react';
import { getRunThreads, formatTimeAgo, RunStatus } from '@/data/mockRunData';

export default function TesterSidebar() {
  const { openTab, tabs, activeTabId } = useWorkspace();
  const threads = getRunThreads();

  const activeTab = tabs.find(t => t.id === activeTabId);
  const activeThreadId = activeTab?.type === 'tester-run' ? activeTab.threadId : undefined;

  const handleThreadClick = (threadId: string, threadName: string) => {
    openTab({
      id: `run-${threadId}`,
      type: 'tester-run',
      title: threadName,
      threadId,
      isClosable: true
    });
  };

  const handleNewRun = () => {
    // Placeholder for Task 6.10 - wire 'New Run' button
    console.log('New Run button clicked');
  };

  const getStatusIndicator = (status: RunStatus) => {
    switch (status) {
      case 'completed':
        return <div className="status-indicator status-completed" />;
      case 'running':
        return <div className="status-indicator status-running" />;
      case 'failed':
        return <div className="status-indicator status-failed" />;
      default:
        return <div className="status-indicator status-ready" />;
    }
  };

  return (
    <div className="sidebar-content">
      <div className="sidebar-header">
        <h3>Test Threads</h3>
        <button className="sidebar-add-button" title="New Run" onClick={handleNewRun}>
          <Plus size={16} />
        </button>
      </div>
      <div className="sidebar-list">
        {threads.map((thread) => (
          <div
            key={thread.id}
            className={`sidebar-list-item ${activeThreadId === thread.id ? 'active' : ''}`}
            onClick={() => handleThreadClick(thread.id, thread.name)}
          >
            <div className="sidebar-item-row">
              {getStatusIndicator(thread.status)}
              <span className="sidebar-item-name">{thread.name}</span>
            </div>
            <span className="sidebar-item-meta">{formatTimeAgo(thread.createdAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
