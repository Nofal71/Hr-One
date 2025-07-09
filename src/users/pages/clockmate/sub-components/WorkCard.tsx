import React from 'react';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { Clock12Regular } from '@fluentui/react-icons';

const useWorkCardStyles = makeStyles({
  card: {
    ...shorthands.padding('20px'),
    ...shorthands.borderRadius('12px'),
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow8,
    transition: 'all 0.3s ease',
    ':hover': {
      boxShadow: tokens.shadow16,
      transform: 'translateY(-4px)',
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  iconContainer: {
    ...shorthands.padding('8px'),
    ...shorthands.borderRadius('50%'),
    backgroundColor: tokens.colorBrandForeground1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px',
    animationName: {
      '0%': { opacity: 1 },
      '50%': { opacity: 0.7 },
      '100%': { opacity: 1 },
    },
    animationDuration: '2s',
    animationIterationCount: 'infinite',
    ':hover': {
      animationPlayState: 'paused',
    },
  },
  icon: {
    width: '20px',
    height: '20px',
    color: tokens.colorNeutralBackground1,
  },
  title: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  duration: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
    ':hover': {
      color: tokens.colorBrandForeground1,
    },
  },
  details: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '8px',
  },
  detailColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  value: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground2,
    ':hover': {
      color: tokens.colorNeutralForeground1,
    },
  },
});

interface WorkCardProps {
  title: string;
  startTime: string | null;
  endTime: string | null;
  duration: string | null;
  theme: 'light' | 'dark';
}

const WorkCard: React.FC<WorkCardProps> = ({ title, startTime, endTime, duration }) => {
  const styles = useWorkCardStyles();

  return (
    <div
      className={styles.card}
    >
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className={styles.iconContainer}>
            <Clock12Regular className={styles.icon} />
          </div>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <span className={styles.duration}>{duration || '0h 0m'}</span>
      </div>
      <div className={styles.details}>
        <div className={styles.detailColumn}>
          <p className={styles.label}>Start</p>
          <p className={styles.value}>{startTime || '—'}</p>
        </div>
        <div className={styles.detailColumn}>
          <p className={styles.label}>End</p>
          <p className={styles.value}>{endTime || '—'}</p>
        </div>
      </div>
    </div>
  );
};

export default WorkCard;