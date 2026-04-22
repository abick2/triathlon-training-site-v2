'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './TopNav.module.css';

const TABS = [
  { href: '/today', label: 'Today' },
  { href: '/week',  label: 'Week'  },
  { href: '/plan',  label: 'Plan'  },
];

export default function TopNav() {
  const pathname = usePathname();
  return (
    <nav className={styles.nav}>
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`${styles.link} ${active ? styles.active : ''}`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
