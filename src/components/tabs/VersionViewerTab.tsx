'use client';

import ReadOnlyFileTree from '@/components/ReadOnlyFileTree';
import { mockSkillFolder } from '@/data/mockSkillData';
import { getVersionById } from '@/data/mockVersionData';

interface VersionViewerTabProps {
  versionId: string;
}

export default function VersionViewerTab({ versionId }: VersionViewerTabProps) {
  const version = getVersionById(versionId);

  const handleCheckout = () => {
    // This will be implemented in task 4.5
    console.log('Checkout version:', versionId);
  };

  return (
    <div className="version-viewer-tab">
      <div className="version-viewer-content">
        <div className="version-viewer-tree">
          <ReadOnlyFileTree data={mockSkillFolder} />
        </div>

        <div className="version-viewer-message">
          <p>
            Preview Only: To run tests or make changes to this version, you
            must first checkout this version
          </p>
          <button className="checkout-button" onClick={handleCheckout}>
            Checkout Version
          </button>
        </div>
      </div>
    </div>
  );
}
