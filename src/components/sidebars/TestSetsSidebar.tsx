'use client';

import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Plus } from 'lucide-react';

const MOCK_TEST_SETS = [
  { id: 'set1', name: 'Basic Functionality', count: 12 },
  { id: 'set2', name: 'Edge Cases', count: 8 },
  { id: 'set3', name: 'Performance Tests', count: 5 }
];

export default function TestSetsSidebar() {
  const { openTab } = useWorkspace();

  const handleSetClick = (setId: string, setName: string) => {
    openTab({
      id: `testset-${setId}`,
      type: 'testset-manager',
      title: setName,
      setId,
      isClosable: true
    });
  };

  return (
    <div className="sidebar-content">
      <div className="sidebar-header">
        <h3>Test Sets</h3>
        <button className="sidebar-add-button" title="New Test Set">
          <Plus size={16} />
        </button>
      </div>
      <div className="sidebar-list">
        {MOCK_TEST_SETS.map((set) => (
          <div
            key={set.id}
            className="sidebar-list-item"
            onClick={() => handleSetClick(set.id, set.name)}
          >
            <span className="sidebar-item-name">{set.name}</span>
            <span className="sidebar-item-meta">{set.count} tests</span>
          </div>
        ))}
      </div>
    </div>
  );
}
