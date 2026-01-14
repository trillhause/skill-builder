'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, File } from 'lucide-react';
import { FileNode } from '@/data/mockSkillData';

interface FileTreeProps {
  data: FileNode;
  onFileClick: (file: FileNode) => void;
  selectedPath?: string;
}

interface FileTreeItemProps {
  node: FileNode;
  level: number;
  onFileClick: (file: FileNode) => void;
  selectedPath?: string;
}

function FileTreeItem({ node, level, onFileClick, selectedPath }: FileTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isFolder = node.type === 'folder';
  const isSelected = !isFolder && selectedPath === node.path;

  const handleClick = () => {
    if (isFolder) {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(node);
    }
  };

  return (
    <div className="file-tree-item">
      <div
        className={`file-tree-row ${isSelected ? 'selected' : ''}`}
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
            <FileTreeItem
              key={child.id}
              node={child}
              level={level + 1}
              onFileClick={onFileClick}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileTree({ data, onFileClick, selectedPath }: FileTreeProps) {
  return (
    <div className="file-tree">
      {data.children?.map((child) => (
        <FileTreeItem
          key={child.id}
          node={child}
          level={0}
          onFileClick={onFileClick}
          selectedPath={selectedPath}
        />
      ))}
    </div>
  );
}
