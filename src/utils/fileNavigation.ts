// Helper functions for file/folder navigation in version viewer

import { FileNode } from '@/data/mockSkillData';
import { findFileByPath } from '@/data/mockSkillData';

export interface PathSegment {
  name: string;
  path: string;
  node: FileNode;
}

/**
 * Get the contents of a folder at a given path
 * @param path - The path to the folder (e.g., '/' or '/scripts')
 * @param root - The root folder node (defaults to mockSkillFolder)
 * @returns Array of FileNode children, or empty array if path is invalid or not a folder
 */
export function getFolderContents(
  path: string,
  root: FileNode
): FileNode[] {
  const node = findFileByPath(path, root);

  if (!node || node.type !== 'folder') {
    return [];
  }

  return node.children || [];
}

/**
 * Build breadcrumb segments from a path
 * @param path - The current path (e.g., '/scripts/helpers')
 * @param root - The root folder node
 * @returns Array of PathSegment objects for breadcrumb navigation
 */
export function buildBreadcrumbs(
  path: string,
  root: FileNode
): PathSegment[] {
  const segments: PathSegment[] = [];

  // Split path into parts and build segments
  const parts = path.split('/').filter(Boolean); // Remove empty strings

  // Start with root
  segments.push({
    name: root.name,
    path: root.path,
    node: root
  });

  // Build segments for each part of the path
  let currentPath = root.path;
  let currentNode = root;

  for (const part of parts) {
    // Find the child node matching this part
    if (currentNode.children) {
      const child = currentNode.children.find(c => c.name === part);
      if (child) {
        currentPath = child.path;
        currentNode = child;
        segments.push({
          name: child.name,
          path: currentPath,
          node: currentNode
        });
      }
    }
  }

  return segments;
}

/**
 * Get the parent path of a given path
 * @param path - The current path
 * @returns The parent path, or empty string if already at root
 */
export function getParentPath(path: string): string {
  const parts = path.split('/').filter(Boolean);

  if (parts.length <= 1) {
    return '';
  }

  parts.pop();
  return '/' + parts.join('/');
}
