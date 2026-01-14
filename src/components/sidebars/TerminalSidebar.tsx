'use client';

import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Terminal as TerminalIcon } from 'lucide-react';

export default function TerminalSidebar() {
  const { openTab } = useWorkspace();

  const handleSessionClick = () => {
    openTab({
      id: 'terminal-global',
      type: 'terminal',
      title: 'Terminal',
      sessionId: 'global',
      isClosable: true
    });
  };

  return (
    <div className="sidebar-content">
      <div className="sidebar-header">
        <h3>Terminal</h3>
      </div>
      <div className="sidebar-list">
        <div className="sidebar-list-item" onClick={handleSessionClick}>
          <TerminalIcon size={16} />
          <span className="sidebar-item-name">Global Session</span>
        </div>
      </div>
    </div>
  );
}
