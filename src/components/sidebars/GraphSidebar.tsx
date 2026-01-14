'use client';

import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Plus } from 'lucide-react';

const MOCK_VERSIONS = [
  { id: 'v1', name: 'Version 1', date: '2026-01-14' },
  { id: 'v2', name: 'Version 2', date: '2026-01-13' },
  { id: 'v3', name: 'Version 3', date: '2026-01-12' }
];

export default function GraphSidebar() {
  const { openTab } = useWorkspace();

  const handleVersionClick = (versionId: string, versionName: string) => {
    openTab({
      id: `version-${versionId}`,
      type: 'version-viewer',
      title: versionName,
      versionId,
      isClosable: true
    });
  };

  return (
    <div className="sidebar-content">
      <div className="sidebar-header">
        <h3>Versions</h3>
        <button className="sidebar-add-button" title="New Version">
          <Plus size={16} />
        </button>
      </div>
      <div className="sidebar-list">
        {MOCK_VERSIONS.map((version) => (
          <div
            key={version.id}
            className="sidebar-list-item"
            onClick={() => handleVersionClick(version.id, version.name)}
          >
            <span className="sidebar-item-name">{version.name}</span>
            <span className="sidebar-item-meta">{version.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
