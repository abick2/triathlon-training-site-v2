'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Nav.module.css';

const TABS = [
  {
    href: '/today',
    label: 'Today',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z"
          stroke={active ? 'var(--accent)' : 'var(--fg3)'}
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill={active ? 'var(--accent-dim)' : 'none'}
        />
      </svg>
    ),
  },
  {
    href: '/week',
    label: 'Week',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect
          x="3" y="4" width="14" height="13" rx="2"
          stroke={active ? 'var(--accent)' : 'var(--fg3)'}
          strokeWidth="1.5"
          fill={active ? 'var(--accent-dim)' : 'none'}
        />
        <path d="M3 8H17" stroke={active ? 'var(--accent)' : 'var(--fg3)'} strokeWidth="1.5" />
        <path
          d="M7 2V5M13 2V5"
          stroke={active ? 'var(--accent)' : 'var(--fg3)'}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: '/plan',
    label: 'Plan',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M4 5H16M4 10H16M4 15H10"
          stroke={active ? 'var(--accent)' : 'var(--fg3)'}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle
          cx="15" cy="15" r="3"
          stroke={active ? 'var(--accent)' : 'var(--fg3)'}
          strokeWidth="1.5"
          fill={active ? 'var(--accent-dim)' : 'none'}
        />
        <path
          d="M14 15L14.8 15.8L16.5 14"
          stroke={active ? 'var(--accent)' : 'var(--fg3)'}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link key={tab.href} href={tab.href} className={styles.tab}>
            {tab.icon(active)}
            <span
              className={styles.label}
              style={{
                color: active ? 'var(--accent)' : 'var(--fg3)',
                fontWeight: active ? 800 : 600,
              }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
