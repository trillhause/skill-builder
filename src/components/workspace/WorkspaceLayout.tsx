'use client';

import DynamicSidebar from './DynamicSidebar';
import TabBar from './TabBar';
import TabContent from './TabContent';

export default function WorkspaceLayout() {
  return (
    <div className="workspace-layout">
      <DynamicSidebar />
      <div className="workspace-main">
        <TabBar />
        <div className="workspace-content">
          <TabContent />
        </div>
      </div>
    </div>
  );
}
