'use client';

import { useWorkspace } from '@/contexts/WorkspaceContext';
import IconStrip from './IconStrip';
import StatusBar from './StatusBar';
import FilesSidebar from '@/components/sidebars/FilesSidebar';
import GraphSidebar from '@/components/sidebars/GraphSidebar';
import TerminalSidebar from '@/components/sidebars/TerminalSidebar';
import BuilderSidebar from '@/components/sidebars/BuilderSidebar';
import TesterSidebar from '@/components/sidebars/TesterSidebar';
import TestSetsSidebar from '@/components/sidebars/TestSetsSidebar';
import AnalysisSidebar from '@/components/sidebars/AnalysisSidebar';

export default function DynamicSidebar() {
  const { activeSidebarIcon } = useWorkspace();

  const renderSidebarContent = () => {
    switch (activeSidebarIcon) {
      case 'files':
        return <FilesSidebar />;
      case 'graph':
        return <GraphSidebar />;
      case 'terminal':
        return <TerminalSidebar />;
      case 'builder':
        return <BuilderSidebar />;
      case 'tester':
        return <TesterSidebar />;
      case 'testsets':
        return <TestSetsSidebar />;
      case 'analysis':
        return <AnalysisSidebar />;
      default:
        return <div>Unknown sidebar</div>;
    }
  };

  return (
    <div className="dynamic-sidebar">
      <IconStrip />
      <div className="sidebar-content-area">
        {renderSidebarContent()}
      </div>
      <StatusBar />
    </div>
  );
}
