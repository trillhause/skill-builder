'use client';

import { createContext, useReducer, useCallback, ReactNode, useContext } from 'react';
import { Tab, SidebarIcon, WorkspaceState, WorkspaceActions, TAB_TO_SIDEBAR_ICON } from '@/types/workspace';

// Initial state
const initialState: WorkspaceState = {
  activeSidebarIcon: 'files',
  tabs: [],
  activeTabId: null,
  currentVersion: 'Version 8'
};

// Action types
type Action =
  | { type: 'SET_ACTIVE_SIDEBAR_ICON'; payload: SidebarIcon }
  | { type: 'OPEN_TAB'; payload: Tab }
  | { type: 'CLOSE_TAB'; payload: string }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'UPDATE_CURRENT_VERSION'; payload: string };

// Reducer
function workspaceReducer(state: WorkspaceState, action: Action): WorkspaceState {
  switch (action.type) {
    case 'SET_ACTIVE_SIDEBAR_ICON':
      return { ...state, activeSidebarIcon: action.payload };

    case 'OPEN_TAB': {
      // Check if tab with same path already exists (for editor tabs)
      if (action.payload.path) {
        const existingTab = state.tabs.find(t => t.path === action.payload.path);
        if (existingTab) {
          return { ...state, activeTabId: existingTab.id };
        }
      }

      // Check if tab already exists by ID
      const existingTab = state.tabs.find(t => t.id === action.payload.id);
      if (existingTab) {
        return { ...state, activeTabId: existingTab.id };
      }

      return {
        ...state,
        tabs: [...state.tabs, action.payload],
        activeTabId: action.payload.id
      };
    }

    case 'CLOSE_TAB': {
      const newTabs = state.tabs.filter(t => t.id !== action.payload);
      let newActiveId = state.activeTabId;

      if (action.payload === state.activeTabId && newTabs.length > 0) {
        const closedIndex = state.tabs.findIndex(t => t.id === action.payload);
        const newIndex = closedIndex > 0 ? closedIndex - 1 : 0;
        newActiveId = newTabs[newIndex]?.id || null;
      } else if (newTabs.length === 0) {
        newActiveId = null;
      }

      return {
        ...state,
        tabs: newTabs,
        activeTabId: newActiveId
      };
    }

    case 'SET_ACTIVE_TAB': {
      const tab = state.tabs.find(t => t.id === action.payload);
      const newSidebarIcon = tab ? TAB_TO_SIDEBAR_ICON[tab.type] : state.activeSidebarIcon;
      return { ...state, activeTabId: action.payload, activeSidebarIcon: newSidebarIcon };
    }

    case 'UPDATE_CURRENT_VERSION':
      return { ...state, currentVersion: action.payload };

    default:
      return state;
  }
}

// Context
export const WorkspaceContext = createContext<
  (WorkspaceState & WorkspaceActions) | undefined
>(undefined);

// Provider
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);

  const actions: WorkspaceActions = {
    setActiveSidebarIcon: useCallback((icon: SidebarIcon) => {
      dispatch({ type: 'SET_ACTIVE_SIDEBAR_ICON', payload: icon });
    }, []),

    openTab: useCallback((tab: Tab) => {
      dispatch({ type: 'OPEN_TAB', payload: tab });
    }, []),

    closeTab: useCallback((tabId: string) => {
      dispatch({ type: 'CLOSE_TAB', payload: tabId });
    }, []),

    setActiveTab: useCallback((tabId: string) => {
      dispatch({ type: 'SET_ACTIVE_TAB', payload: tabId });
    }, []),

    updateCurrentVersion: useCallback((version: string) => {
      dispatch({ type: 'UPDATE_CURRENT_VERSION', payload: version });
    }, []),

    checkoutVersion: useCallback((versionId: string, versionName: string, tabId?: string) => {
      // Update current version
      dispatch({ type: 'UPDATE_CURRENT_VERSION', payload: versionName });

      // Open the version tab
      const newTabId = `version-${versionId}`;
      dispatch({
        type: 'OPEN_TAB',
        payload: {
          id: newTabId,
          type: 'version-viewer',
          title: versionName,
          versionId,
          isClosable: true
        }
      });
    }, [])
  };

  return (
    <WorkspaceContext.Provider value={{ ...state, ...actions }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

// Hook
export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }
  return context;
}
