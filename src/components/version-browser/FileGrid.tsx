'use client';

import { FileNode, FileType as FileNodeType } from '@/data/mockSkillData';
import { Folder, File } from 'lucide-react';

interface FileGridProps {
  items: FileNode[];
  onItemClick: (item: FileNode) => void;
}

// Map file types to icons
function getFileIcon(type: FileNodeType): React.ComponentType<{ size?: number }> {
  switch (type) {
    case 'folder':
      return Folder;
    case 'file':
      return File;
    default:
      return File;
  }
}

export default function FileGrid({ items, onItemClick }: FileGridProps) {
  if (items.length === 0) {
    return (
      <div className="file-grid-empty">
        <p>Empty folder</p>
      </div>
    );
  }

  return (
    <div className="file-grid">
      {items.map((item) => {
        const Icon = getFileIcon(item.type);
        return (
          <div
            key={item.id}
            className="file-grid-item"
            onClick={() => onItemClick(item)}
            title={item.name}
          >
            <div className="file-grid-icon">
              <Icon size={64} />
            </div>
            <span className="file-grid-name">{item.name}</span>
          </div>
        );
      })}
    </div>
  );
}
