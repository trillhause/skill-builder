'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FolderOpen,
  GitBranch,
  Terminal,
  Wrench,
  FlaskConical,
  ListChecks,
  BarChart3,
  FileCode,
} from 'lucide-react';

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/files', icon: <FolderOpen />, label: 'File Browser' },
  { href: '/versions', icon: <GitBranch />, label: 'Version Graph' },
  { href: '/terminal', icon: <Terminal />, label: 'Terminal' },
  { href: '/builder', icon: <Wrench />, label: 'Skill Builder' },
  { href: '/tester', icon: <FlaskConical />, label: 'Skill Tester' },
  { href: '/test-sets', icon: <ListChecks />, label: 'Test Sets' },
  { href: '/analysis-sets', icon: <BarChart3 />, label: 'Analysis Sets' },
  { href: '/editor', icon: <FileCode />, label: 'Editor' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <aside className="nav-toolbar">
      <nav>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
            data-tooltip={item.label}
          >
            {item.icon}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
