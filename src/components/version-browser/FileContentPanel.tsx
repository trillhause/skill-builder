'use client';

import { FileNode } from '@/data/mockSkillData';
import MonacoEditor from '@/components/MonacoEditor';

interface FileContentPanelProps {
  file: FileNode | null;
}

export default function FileContentPanel({ file }: FileContentPanelProps) {
  if (!file || file.type === 'folder') {
    return (
      <div className="file-content-placeholder">
        <p>Select a file to view its contents</p>
      </div>
    );
  }

  return (
    <div className="file-content-panel">
      {/* <div className="file-content-header">
        <span className="file-content-path">{file.path}</span>
      </div> */}
      <div className="file-content-editor">
        <MonacoEditor
          content={file.content || '// No content available'}
          language={file.language || 'text'}
          readOnly={true}
        />
      </div>
    </div>
  );
}
