import { useState } from 'react';
import { Tab } from '@/components/TabManager';
import { FileNode } from '@/data/mockSkillData';

export function useFileManager() {
  const [openTabs, setOpenTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  const openFile = (file: FileNode) => {
    // Check if file is already open
    const existingTab = openTabs.find((tab) => tab.path === file.path);

    if (existingTab) {
      // File already open, just switch to it
      setActiveTabId(existingTab.id);
    } else {
      // Create new tab
      const newTab: Tab = {
        id: file.id,
        name: file.name,
        path: file.path,
        content: file.content || '',
        language: file.language || 'text'
      };

      setOpenTabs((prev) => [...prev, newTab]);
      setActiveTabId(newTab.id);
    }
  };

  const closeTab = (tabId: string) => {
    setOpenTabs((prev) => {
      const newTabs = prev.filter((tab) => tab.id !== tabId);

      // If closing the active tab, switch to another tab
      if (tabId === activeTabId) {
        if (newTabs.length > 0) {
          // Find the index of the closed tab
          const closedIndex = prev.findIndex((tab) => tab.id === tabId);
          // Switch to the tab before it, or the first tab if it was the first
          const newActiveIndex = closedIndex > 0 ? closedIndex - 1 : 0;
          setActiveTabId(newTabs[newActiveIndex]?.id || null);
        } else {
          setActiveTabId(null);
        }
      }

      return newTabs;
    });
  };

  const switchTab = (tabId: string) => {
    setActiveTabId(tabId);
  };

  const getActiveTab = (): Tab | null => {
    return openTabs.find((tab) => tab.id === activeTabId) || null;
  };

  return {
    openTabs,
    activeTabId,
    openFile,
    closeTab,
    switchTab,
    getActiveTab
  };
}
