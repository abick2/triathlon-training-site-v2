import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number; // 0–1
  color?: string;
  height?: number;
}

export default function ProgressBar({ value, color, height = 6 }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value * 100));
  return (
    <div className={styles.track} style={{ height }}>
      <div
        className={styles.fill}
        style={{
          width: `${pct}%`,
          background: color ?? 'var(--accent)',
        }}
      />
    </div>
  );
}
