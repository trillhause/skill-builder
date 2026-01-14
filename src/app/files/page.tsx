'use client';

import FileTree from '@/components/FileTree';
import { mockSkillFolder, FileNode } from '@/data/mockSkillData';

export default function FilesPage() {
  const handleFileClick = (file: FileNode) => {
    console.log('File clicked:', file.name, file.path);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '300px', borderRight: '1px solid var(--border-primary)' }}>
        <FileTree data={mockSkillFolder} onFileClick={handleFileClick} />
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        <h2>File Tree Test</h2>
        <p>Click a file in the tree to test the click handler.</p>
      </div>
    </div>
  );
}
