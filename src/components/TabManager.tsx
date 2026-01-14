'use client';

import { X } from 'lucide-react';

export interface Tab {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
}

interface TabManagerProps {
  tabs: Tab[];
  activeTabId: string | null;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

export default function TabManager({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose
}: TabManagerProps) {
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
            onClick={() => onTabClick(tab.id)}
          >
            <span className="tab-name">{tab.name}</span>
            <button
              className="tab-close"
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
              aria-label={`Close ${tab.name}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
