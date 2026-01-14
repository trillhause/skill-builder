'use client';

import { useState, useMemo } from 'react';
import { FileNode } from '@/data/mockSkillData';
import { getFolderContents, buildBreadcrumbs } from '@/utils/fileNavigation';
import BreadcrumbNav from './BreadcrumbNav';
import FileGrid from './FileGrid';
import FileContentPanel from './FileContentPanel';
import VersionViewerMessage from './VersionViewerMessage';

interface VersionBrowserProps {
  rootFolder: FileNode;
  checkoutMessage?: {
    show: boolean;
    onCheckout: () => void;
    isActiveVersion?: boolean;
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
          <VersionViewerMessage
            isActiveVersion={checkoutMessage.isActiveVersion ?? false}
            onCheckout={checkoutMessage.onCheckout}
          />
        )}
      </div>
      <div className="version-browser-right">
          <FileContentPanel file={selectedFile} />
        </div>
      </div>
    </>
  );
}
