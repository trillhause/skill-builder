'use client';

import VersionBrowser from '@/components/version-browser/VersionBrowser';
import { mockSkillFolder } from '@/data/mockSkillData';
import { getVersionById } from '@/data/mockVersionData';
import { useWorkspace } from '@/contexts/WorkspaceContext';

interface VersionViewerTabProps {
  versionId: string;
  tabId: string;
}

export default function VersionViewerTab({ versionId, tabId }: VersionViewerTabProps) {
  const { checkoutVersion } = useWorkspace();
  const version = getVersionById(versionId);

  const handleCheckout = () => {
    if (version) {
      checkoutVersion(versionId, version.name, tabId);
    }
  };

  return (
    <div className="version-viewer-tab">
      <div className="version-viewer-content">
        <div className="version-browser-wrapper">
          <VersionBrowser rootFolder={mockSkillFolder} />
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
