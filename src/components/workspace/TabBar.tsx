'use client';

import { useWorkspace } from '@/contexts/WorkspaceContext';
import { X, FileText, GitBranch, Terminal, Wrench, FlaskConical, TestTube, BarChart3 } from 'lucide-react';
import { TabType } from '@/types/workspace';

const TAB_ICONS: Record<TabType, React.ReactNode> = {
  'editor': <FileText size={14} />,
  'version-viewer': <GitBranch size={14} />,
  'terminal': <Terminal size={14} />,
  'builder-chat': <Wrench size={14} />,
  'tester-run': <FlaskConical size={14} />,
  'testset-manager': <TestTube size={14} />,
  'analysis-manager': <BarChart3 size={14} />
};

export default function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useWorkspace();

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="tab-manager">
      <div className="tab-bar">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${tab.id === activeTabId ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{TAB_ICONS[tab.type]}</span>
            <span className="tab-name">{tab.title}</span>
            {tab.isClosable !== false && (
              <button
                className="tab-close"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                aria-label={`Close ${tab.title}`}
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
