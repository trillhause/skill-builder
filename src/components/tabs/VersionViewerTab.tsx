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
  const { checkoutVersion, currentVersion } = useWorkspace();
  const version = getVersionById(versionId);

  const handleCheckout = () => {
    if (version) {
      checkoutVersion(versionId, version.name, tabId);
    }
  };

  // Check if this is the active/checked-out version
  const isActiveVersion = version && version.name === currentVersion;

  return (
    <div className="version-viewer-tab">
      <div className="version-viewer-content">
        <div className="version-browser-wrapper">
          <VersionBrowser
            rootFolder={mockSkillFolder}
            checkoutMessage={{
              show: true,
              onCheckout: handleCheckout,
              isActiveVersion,
            }}
          />
        </div>
      </div>
    </div>
  );
}
