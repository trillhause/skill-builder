'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, File } from 'lucide-react';
import { FileNode } from '@/data/mockSkillData';

interface ReadOnlyFileTreeProps {
  data: FileNode;
}

interface ReadOnlyFileTreeItemProps {
  node: FileNode;
  level: number;
}

function ReadOnlyFileTreeItem({ node, level }: ReadOnlyFileTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isFolder = node.type === 'folder';

  const handleClick = () => {
    // Only allow toggling folders, files are not clickable
    if (isFolder) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="file-tree-item">
      <div
        className={`file-tree-row ${isFolder ? '' : 'readonly-file'}`}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={handleClick}
      >
        <div className="file-tree-icon">
          {isFolder ? (
            <>
              {isExpanded ? (
                <ChevronDown size={16} className="chevron" />
              ) : (
                <ChevronRight size={16} className="chevron" />
              )}
              <Folder size={16} className="folder-icon" />
            </>
          ) : (
            <File size={16} className="file-icon" />
          )}
        </div>
        <span className="file-tree-name">{node.name}</span>
      </div>

      {isFolder && isExpanded && node.children && (
        <div className="file-tree-children">
          {node.children.map((child) => (
            <ReadOnlyFileTreeItem
              key={child.id}
              node={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReadOnlyFileTree({ data }: ReadOnlyFileTreeProps) {
  return (
    <div className="file-tree readonly-file-tree">
      {data.children?.map((child) => (
        <ReadOnlyFileTreeItem
          key={child.id}
          node={child}
          level={0}
        />
      ))}
    </div>
  );
}
