'use client';

import { ChevronRight } from 'lucide-react';
import { PathSegment } from '@/utils/fileNavigation';
import { FileNode } from '@/data/mockSkillData';

interface BreadcrumbNavProps {
  segments: PathSegment[];
  onNavigate: (path: string) => void;
  selectedFile?: FileNode | null;
}

export default function BreadcrumbNav({ segments, onNavigate, selectedFile }: BreadcrumbNavProps) {
  return (
    <div className="breadcrumb-nav">
      {segments.map((segment, index) => (
        <div key={segment.path} className="breadcrumb-item-wrapper">
          {index > 0 && (
            <ChevronRight size={14} className="breadcrumb-separator" />
          )}
          <button
            className={`breadcrumb-item ${!selectedFile && index === segments.length - 1 ? 'current' : ''}`}
            onClick={() => onNavigate(segment.path)}
            title={segment.path}
          >
            {segment.name}
          </button>
        </div>
      ))}
      {selectedFile && (
        <div className="breadcrumb-item-wrapper">
          <ChevronRight size={14} className="breadcrumb-separator" />
          <span className="breadcrumb-item current">
            {selectedFile.name}
          </span>
        </div>
      )}
    </div>
  );
}
