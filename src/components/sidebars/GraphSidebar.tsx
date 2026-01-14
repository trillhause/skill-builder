'use client';

import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Plus } from 'lucide-react';
import { getAllVersions } from '@/data/mockVersionData';

export default function GraphSidebar() {
  const { openTab } = useWorkspace();
  const versions = getAllVersions(); // Returns sorted by version number descending (V8, V7, V6...)

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
        {versions.map((version) => (
          <div
            key={version.id}
            className="sidebar-list-item"
            onClick={() => handleVersionClick(version.id, version.name)}
          >
            <div className="version-list-item">
              {version.isCurrent && (
                <span className="version-indicator current" title="Current Version"></span>
              )}
              <span className="sidebar-item-name">{version.name}</span>
            </div>
            <span className="sidebar-item-meta">{version.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
