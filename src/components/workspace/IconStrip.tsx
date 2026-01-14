'use client';

import { useWorkspace } from '@/contexts/WorkspaceContext';
import { SidebarIcon } from '@/types/workspace';
import {
  FolderTree,
  GitBranch,
  Terminal,
  Wrench,
  FlaskConical,
  TestTube,
  BarChart3
} from 'lucide-react';

const SIDEBAR_ICONS: Array<{ icon: SidebarIcon; component: React.ReactNode; title: string }> = [
  { icon: 'files', component: <FolderTree size={20} />, title: 'Files' },
  { icon: 'graph', component: <GitBranch size={20} />, title: 'Version Graph' },
  { icon: 'terminal', component: <Terminal size={20} />, title: 'Terminal' },
  { icon: 'builder', component: <Wrench size={20} />, title: 'Skill Builder' },
  { icon: 'tester', component: <FlaskConical size={20} />, title: 'Skill Tester' },
  { icon: 'testsets', component: <TestTube size={20} />, title: 'Test Sets' },
  { icon: 'analysis', component: <BarChart3 size={20} />, title: 'Analysis' },
];

export default function IconStrip() {
  const { activeSidebarIcon, setActiveSidebarIcon } = useWorkspace();

  return (
    <div className="icon-strip">
      {SIDEBAR_ICONS.map(({ icon, component, title }) => (
        <button
          key={icon}
          className={`icon-strip-button ${activeSidebarIcon === icon ? 'active' : ''}`}
          onClick={() => setActiveSidebarIcon(icon)}
          title={title}
          aria-label={title}
        >
          {component}
        </button>
      ))}
    </div>
  );
}
