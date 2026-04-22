import type { Metadata } from 'next';
import { Nunito, DM_Mono } from 'next/font/google';
import Nav from '@/components/Nav';
import TopNav from '@/components/TopNav';
import styles from './layout.module.css';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Andrew's Training Plan",
  description: 'Personal triathlon training tracker',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${dmMono.variable}`}>
      <body>
        <div className="app-frame">
          <header className={styles.header}>
            <div className={styles.logoGroup}>
              <div className={styles.logoMark}>
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
                  <circle cx="10" cy="4" r="2.5" fill="white" />
                  <path d="M7.5 7.5 L4 16 L7.5 13.5 L10 17 L12.5 13.5 L16 16 L12.5 8 L10 11 Z" fill="white" />
                </svg>
              </div>
              <div className={styles.logoText}>
                <span className={styles.logoName}>Andrew&#39;s</span>
                <span className={styles.logoSub}>Training Plan</span>
              </div>
            </div>
            {/* Nav links appear here on desktop, hidden on mobile */}
            <TopNav />
          </header>

          <main className="app-content">{children}</main>

          {/* Bottom nav — visible on mobile only */}
          <Nav />
        </div>
      </body>
    </html>
  );
}
