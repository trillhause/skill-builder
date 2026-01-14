'use client';

import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Plus } from 'lucide-react';

const MOCK_ANALYSIS_SETS = [
  { id: 'analysis1', name: 'Performance Analysis', runs: 24 },
  { id: 'analysis2', name: 'Error Pattern Analysis', runs: 15 },
  { id: 'analysis3', name: 'Quality Metrics', runs: 8 }
];

export default function AnalysisSidebar() {
  const { openTab, tabs, activeTabId } = useWorkspace();

  const activeTab = tabs.find(t => t.id === activeTabId);
  const activeSetId = activeTab?.type === 'analysis-manager' ? activeTab.setId : undefined;

  const handleSetClick = (setId: string, setName: string) => {
    openTab({
      id: `analysis-${setId}`,
      type: 'analysis-manager',
      title: setName,
      setId,
      isClosable: true
    });
  };

  return (
    <div className="sidebar-content">
      <div className="sidebar-header">
        <h3>Analysis Sets</h3>
        <button className="sidebar-add-button" title="New Analysis Set">
          <Plus size={16} />
        </button>
      </div>
      <div className="sidebar-list">
        {MOCK_ANALYSIS_SETS.map((set) => (
          <div
            key={set.id}
            className={`sidebar-list-item ${activeSetId === set.id ? 'active' : ''}`}
            onClick={() => handleSetClick(set.id, set.name)}
          >
            <span className="sidebar-item-name">{set.name}</span>
            <span className="sidebar-item-meta">{set.runs} runs</span>
          </div>
        ))}
      </div>
    </div>
  );
}
