'use client';

import { useState } from 'react';
import styles from './SwimSetDetails.module.css';

type SetItem = { name?: string; yards?: number; details?: string };

export default function SwimSetDetails({ sets }: { sets: SetItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <button className={styles.toggle} onClick={() => setOpen((o) => !o)}>
        <span className={open ? styles.arrowOpen : styles.arrow}>▶</span>
        View set details
      </button>
      {open && (
        <div className={styles.list}>
          {sets.map((set, i) => (
            <div key={i} className={styles.item}>
              {set.name && <span className={styles.name}>{set.name}</span>}
              {set.yards && <span className={`${styles.yards} mono`}>{set.yards} yd</span>}
              {set.details && <span className={styles.details}>{set.details}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
