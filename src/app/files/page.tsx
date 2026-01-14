'use client';

import { useState } from 'react';
import FileTree from '@/components/FileTree';
import MonacoEditor from '@/components/MonacoEditor';
import { mockSkillFolder, FileNode } from '@/data/mockSkillData';

export default function FilesPage() {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

  const handleFileClick = (file: FileNode) => {
    setSelectedFile(file);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '300px', borderRight: '1px solid var(--border-primary)' }}>
        <FileTree data={mockSkillFolder} onFileClick={handleFileClick} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedFile ? (
          <>
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-primary)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '13px'
              }}
            >
              {selectedFile.path}
            </div>
            <div style={{ flex: 1 }}>
              <MonacoEditor
                content={selectedFile.content || ''}
                language={selectedFile.language || 'text'}
              />
            </div>
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-secondary)'
            }}
          >
            Select a file to view its contents
          </div>
        )}
      </div>
    </div>
  );
}
