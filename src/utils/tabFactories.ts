import { Tab, TabType } from '@/types/workspace';

export function createDefaultTab(type: TabType): Tab {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  switch (type) {
    case 'editor':
      return {
        id,
        type: 'editor',
        title: 'Untitled',
        isClosable: true
      };

    case 'builder-chat':
      return {
        id,
        type: 'builder-chat',
        title: 'New Skill Builder',
        isClosable: true
      };

    case 'tester-run':
      return {
        id,
        type: 'tester-run',
        title: 'New Skill Test',
        isClosable: true
      };

    case 'terminal':
      return {
        id,
        type: 'terminal',
        title: 'Terminal',
        sessionId: id,
        isClosable: true
      };

    case 'version-viewer':
      return {
        id,
        type: 'version-viewer',
        title: 'Version Graph',
        isClosable: true
      };

    case 'testset-manager':
      return {
        id,
        type: 'testset-manager',
        title: 'New Test Set',
        isClosable: true
      };

    case 'analysis-manager':
      return {
        id,
        type: 'analysis-manager',
        title: 'New Analysis Set',
        isClosable: true
      };

    default:
      throw new Error(`Unknown tab type: ${type}`);
  }
}

// Helper to create an editor tab from file data
export function createEditorTab(file: {
  id?: string;
  name: string;
  path: string;
  content: string;
  language: string;
}): Tab {
  return {
    id: file.id || `editor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'editor',
    title: file.name,
    path: file.path,
    content: file.content,
    language: file.language,
    isClosable: true
  };
}
