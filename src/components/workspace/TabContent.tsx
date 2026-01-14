'use client';

import { useWorkspace } from '@/contexts/WorkspaceContext';
import MonacoEditor from '@/components/MonacoEditor';
import VersionViewerTab from '@/components/tabs/VersionViewerTab';

export default function TabContent() {
  const { tabs, activeTabId } = useWorkspace();
  const activeTab = tabs.find(t => t.id === activeTabId);

  if (!activeTab) {
    return (
      <div className="tab-content-empty">
        <h2>No tab selected</h2>
        <p>Click an icon in the sidebar to get started</p>
      </div>
    );
  }

  switch (activeTab.type) {
    case 'editor':
      return (
        <div className="tab-content-editor">
          {/* {activeTab.path && (
            <div className="editor-header">
              <span className="editor-filepath">{activeTab.path}</span>
            </div>
          )} */}
          <MonacoEditor
            content={activeTab.content || ''}
            language={activeTab.language || 'text'}
            onChange={(value) => {
              // TODO: Update tab content
            }}
          />
        </div>
      );

    case 'version-viewer':
      return (
        <VersionViewerTab
          versionId={activeTab.versionId || ''}
          tabId={activeTab.id}
        />
      );

    case 'terminal':
      return (
        <div className="tab-content-placeholder">
          <h2>Terminal</h2>
          <p>Session: {activeTab.sessionId || 'Unknown'}</p>
          <p className="placeholder-text">Terminal content coming soon</p>
        </div>
      );

    case 'builder-chat':
      return (
        <div className="tab-content-placeholder">
          <h2>Skill Builder Chat</h2>
          <p>Thread: {activeTab.threadId || 'New Thread'}</p>
          <p className="placeholder-text">Builder chat interface coming soon</p>
        </div>
      );

    case 'tester-run':
      return (
        <div className="tab-content-placeholder">
          <h2>Skill Tester Run</h2>
          <p>Thread: {activeTab.threadId || 'New Test'}</p>
          <p className="placeholder-text">Tester interface coming soon</p>
        </div>
      );

    case 'testset-manager':
      return (
        <div className="tab-content-placeholder">
          <h2>Test Set Manager</h2>
          <p>Set: {activeTab.setId || 'Unknown'}</p>
          <p className="placeholder-text">Test set management coming soon</p>
        </div>
      );

    case 'analysis-manager':
      return (
        <div className="tab-content-placeholder">
          <h2>Analysis Manager</h2>
          <p>Set: {activeTab.setId || 'Unknown'}</p>
          <p className="placeholder-text">Analysis management coming soon</p>
        </div>
      );

    default:
      return (
        <div className="tab-content-placeholder">
          <h2>Unknown Tab Type</h2>
          <p>Type: {activeTab.type}</p>
        </div>
      );
  }
}
