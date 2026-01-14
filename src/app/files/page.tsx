'use client';

import FileTree from '@/components/FileTree';
import MonacoEditor from '@/components/MonacoEditor';
import TabManager from '@/components/TabManager';
import { mockSkillFolder, FileNode } from '@/data/mockSkillData';
import { useFileManager } from '@/hooks/useFileManager';

export default function FilesPage() {
  const { openTabs, activeTabId, openFile, closeTab, switchTab, getActiveTab } = useFileManager();

  const handleFileClick = (file: FileNode) => {
    openFile(file);
  };

  const activeTab = getActiveTab();

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '300px', borderRight: '1px solid var(--border-primary)' }}>
        <FileTree data={mockSkillFolder} onFileClick={handleFileClick} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TabManager
          tabs={openTabs}
          activeTabId={activeTabId}
          onTabClick={switchTab}
          onTabClose={closeTab}
        />
        {activeTab ? (
          <div style={{ flex: 1 }}>
            <MonacoEditor
              content={activeTab.content}
              language={activeTab.language}
            />
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-secondary)'
            }}
          >
            Select a file to view its contents
          </div>
        )}
      </div>
    </div>
  );
}
