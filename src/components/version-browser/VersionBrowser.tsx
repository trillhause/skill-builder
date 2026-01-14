'use client';

import { useState, useMemo } from 'react';
import { FileNode } from '@/data/mockSkillData';
import { getFolderContents, buildBreadcrumbs } from '@/utils/fileNavigation';
import BreadcrumbNav from './BreadcrumbNav';
import FileGrid from './FileGrid';
import FileContentPanel from './FileContentPanel';
import { TriangleAlert } from 'lucide-react';

interface VersionBrowserProps {
  rootFolder: FileNode;
  checkoutMessage?: {
    show: boolean;
    onCheckout: () => void;
  };
}

export default function VersionBrowser({ rootFolder, checkoutMessage }: VersionBrowserProps) {
  const [currentPath, setCurrentPath] = useState<string>(rootFolder.path);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

  // Get current folder contents based on path
  const currentFolderContents = useMemo(() => {
    return getFolderContents(currentPath, rootFolder);
  }, [currentPath, rootFolder]);

  // Build breadcrumb segments
  const breadcrumbs = useMemo(() => {
    return buildBreadcrumbs(currentPath, rootFolder);
  }, [currentPath, rootFolder]);

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (path: string) => {
    setCurrentPath(path);
    setSelectedFile(null); // Clear file selection when navigating
  };

  // Handle folder click (navigate into folder)
  const handleFolderClick = (item: FileNode) => {
    if (item.type === 'folder') {
      setCurrentPath(item.path);
      setSelectedFile(null); // Clear file selection when navigating
    }
  };

  // Handle file click (show file content)
  const handleFileClick = (item: FileNode) => {
    if (item.type === 'file') {
      setSelectedFile(item);
    }
  };

  // Handle item click (route to appropriate handler)
  const handleItemClick = (item: FileNode) => {
    if (item.type === 'folder') {
      handleFolderClick(item);
    } else {
      handleFileClick(item);
    }
  };

  return (
    <>
    <BreadcrumbNav segments={breadcrumbs} onNavigate={handleBreadcrumbClick} selectedFile={selectedFile} />
    <div className="version-browser">
      <div className="version-browser-left">
        <FileGrid items={currentFolderContents} onItemClick={handleItemClick} selectedFile={selectedFile} />
        {checkoutMessage?.show && (
          <div className="version-viewer-message">
            
            <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <TriangleAlert size={18} style={{ marginRight: 6, color: 'var(--accent-primary)' }} />
              </span>
              <span>
                <strong>View only mode</strong> 
              </span>
            </p>
            <p>
            To run tests or make changes to this version, you must first checkout this version.
            </p>
            <button className="checkout-button" onClick={checkoutMessage.onCheckout}>
              Checkout Version
            </button>
          </div>
        )}
      </div>
      <div className="version-browser-right">
          <FileContentPanel file={selectedFile} />
        </div>
      </div>
    </>
  );
}
