'use client';

import { TriangleAlert } from 'lucide-react';

interface VersionViewerMessageProps {
  isActiveVersion: boolean;
  onCheckout: () => void;
}

export default function VersionViewerMessage({ isActiveVersion, onCheckout }: VersionViewerMessageProps) {
  return (
    <div className="version-viewer-message">
      {isActiveVersion ? (
        <>
          <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <TriangleAlert size={18} style={{ marginRight: 6, color: 'var(--accent-primary)' }} />
            </span>
            <span>
              <strong>View only mode</strong>
            </span>
          </p>
          <p>
            This version is currently checked out in the workspace. Navigate to the files tab to make changes on this version.
          </p>
        </>
      ) : (
        <>
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
          <button className="checkout-button" onClick={onCheckout}>
            Checkout Version
          </button>
        </>
      )}
    </div>
  );
}
