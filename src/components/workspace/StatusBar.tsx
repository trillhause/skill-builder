'use client';

import { useWorkspace } from '@/contexts/WorkspaceContext';
import { GitCommit } from 'lucide-react';

export default function StatusBar() {
  const { currentVersion } = useWorkspace();

  return (
    <div className="status-bar">
      <div className="status-bar-content">
        <GitCommit size={14} />
        <span className="status-bar-text">{currentVersion}</span>
      </div>
    </div>
  );
}
