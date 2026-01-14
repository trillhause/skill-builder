'use client';

import { useWorkspace } from '@/contexts/WorkspaceContext';
import FileTree from '@/components/FileTree';
import { mockSkillFolder, FileNode } from '@/data/mockSkillData';
import { Plus } from 'lucide-react';

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
      <div className="sidebar-header">
        <h3>Files</h3>
        <button className="sidebar-add-button" title="New Version">
          <Plus size={16} />
        </button>
      </div>
      <FileTree data={mockSkillFolder} onFileClick={handleFileClick} />
    </div>
  );
}
