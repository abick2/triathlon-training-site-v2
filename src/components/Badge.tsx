import type { Sport, WorkoutType } from '@/lib/types';
import styles from './Badge.module.css';

const TYPE_CONFIG: Record<WorkoutType, { label: string; color: string; bg: string }> = {
  Easy:      { label: 'EASY',      color: '#3B7DD8', bg: 'rgba(59,125,216,0.12)' },
  Recovery:  { label: 'RECOVERY',  color: '#3B7DD8', bg: 'rgba(59,125,216,0.12)' },
  Tempo:     { label: 'TEMPO',     color: '#D97B2A', bg: 'rgba(217,123,42,0.12)' },
  Threshold: { label: 'THRESHOLD', color: '#D97B2A', bg: 'rgba(217,123,42,0.12)' },
  Long:      { label: 'LONG',      color: '#7B5EA7', bg: 'rgba(123,94,167,0.12)' },
  Race:      { label: 'RACE',      color: '#C93B3B', bg: 'rgba(201,59,59,0.12)' },
  Rest:      { label: 'REST',      color: '#8A8680', bg: 'rgba(138,134,128,0.10)' },
};

const SPORT_PREFIX: Partial<Record<Sport, string>> = {
  bike:     'BIKE',
  swim:     'SWIM',
  strength: 'STR',
};

interface BadgeProps {
  workoutType: WorkoutType;
  sport: Sport;
  small?: boolean;
}

export default function Badge({ workoutType, sport, small }: BadgeProps) {
  const cfg = TYPE_CONFIG[workoutType] ?? TYPE_CONFIG.Rest;
  const sportPrefix = SPORT_PREFIX[sport];
  const label = sportPrefix
    ? sport === 'strength' ? 'STRENGTH' : `${sportPrefix} · ${cfg.label}`
    : cfg.label;

  return (
    <span
      className={small ? styles.badgeSmall : styles.badge}
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {label}
    </span>
  );
}
