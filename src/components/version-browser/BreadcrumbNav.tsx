'use client';

import { ChevronRight } from 'lucide-react';
import { PathSegment } from '@/utils/fileNavigation';

interface BreadcrumbNavProps {
  segments: PathSegment[];
  onNavigate: (path: string) => void;
}

export default function BreadcrumbNav({ segments, onNavigate }: BreadcrumbNavProps) {
  return (
    <div className="breadcrumb-nav">
      {segments.map((segment, index) => (
        <div key={segment.path} className="breadcrumb-item-wrapper">
          {index > 0 && (
            <ChevronRight size={14} className="breadcrumb-separator" />
          )}
          <button
            className={`breadcrumb-item ${index === segments.length - 1 ? 'current' : ''}`}
            onClick={() => onNavigate(segment.path)}
            title={segment.path}
          >
            {segment.name}
          </button>
        </div>
      ))}
    </div>
  );
}
