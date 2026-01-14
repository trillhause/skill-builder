'use client';

import { useWorkspace } from '@/contexts/WorkspaceContext';
import FileTree from '@/components/FileTree';
import { mockSkillFolder, FileNode } from '@/data/mockSkillData';

export default function FilesSidebar() {
  const { openTab } = useWorkspace();

  const handleFileClick = (file: FileNode) => {
    // Open file in a new editor tab
    openTab({
      id: `editor-${file.path}`,
      type: 'editor',
      title: file.name,
      path: file.path,
      content: file.content || '',
      language: file.language || 'text',
      isClosable: true
    });
  };

  return (
    <div className="files-sidebar">
      <FileTree data={mockSkillFolder} onFileClick={handleFileClick} />
    </div>
  );
}
