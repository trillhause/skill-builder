// Workspace types for VS Code-style layout

// Sidebar icon type - controls which sidebar content is shown
export type SidebarIcon =
  | 'files'
  | 'graph'
  | 'terminal'
  | 'builder'
  | 'tester'
  | 'testsets'
  | 'analysis';

// Tab type - determines what content is shown in the main area
export type TabType =
  | 'editor'
  | 'version-viewer'
  | 'terminal'
  | 'builder-chat'
  | 'tester-run'
  | 'testset-manager'
  | 'analysis-manager';

// Tab interface with icon and context-specific data
export interface Tab {
  id: string;
  type: TabType;
  title: string;
  icon?: SidebarIcon;
  isDirty?: boolean;
  isClosable?: boolean;
  // Context-specific data
  path?: string;           // for editor tabs
  content?: string;        // for editor tabs
  language?: string;       // for editor tabs
  versionId?: string;      // for version-viewer tabs
  sessionId?: string;      // for terminal tabs
  threadId?: string;       // for builder-chat and tester-run tabs
  setId?: string;          // for testset-manager and analysis-manager tabs
  [key: string]: unknown;  // allow additional properties
}

// Workspace state interface
export interface WorkspaceState {
  activeSidebarIcon: SidebarIcon;
  tabs: Tab[];
  activeTabId: string | null;
  currentVersion: string;
}

// Workspace actions interface
export interface WorkspaceActions {
  setActiveSidebarIcon: (icon: SidebarIcon) => void;
  openTab: (tab: Tab) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateCurrentVersion: (version: string) => void;
  checkoutVersion: (versionId: string, versionName: string, tabId?: string) => void;
}
