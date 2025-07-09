import React from 'react';
import { 
  makeStyles, 
  shorthands, 
  tokens, 
  Text, 
  Title3,
  Tooltip,
  Badge
} from '@fluentui/react-components';
import { UserFields } from './types';
import { 
  ClockRegular, 
  DrinkCoffeeRegular,
  CheckmarkRegular
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  timelineContainer: {
    marginTop: '30px',
  },
  timelineHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
    gap: '8px',
  },
  timeline: {
    position: 'relative',
    height: '60px',
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius('8px'),
    ...shorthands.padding('8px'),
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    overflow: 'hidden',
  },
  timelineTicks: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    bottom: '4px',
    left: 0,
    ...shorthands.padding('0', '8px'),
  },
  timelineTick: {
    width: '1px',
    height: '4px',
    backgroundColor: tokens.colorNeutralForeground3,
  },
  timelineHour: {
    position: 'absolute',
    bottom: '10px',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    transform: 'translateX(-50%)',
  },
  timelineProgress: {
    position: 'absolute',
    height: '20px',
    backgroundColor: tokens.colorBrandBackground,
    ...shorthands.borderRadius('4px'),
    animationName: {
      '0%': {
        width: '0%',
      },
      '100%': {
        width: 'var(--progress-width)',
      },
    },
    animationDuration: '1s',
    animationTimingFunction: 'ease-out',
  },
  timelineEvent: {
    position: 'absolute',
    width: '24px',
    height: '24px',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius('50%'),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...shorthands.border('2px', 'solid', tokens.colorBrandBackground),
    zIndex: 2,
    transform: 'translateX(-50%)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateX(-50%) scale(1.2)',
    },
  },
  eventIcon: {
    fontSize: '14px',
    color: tokens.colorBrandBackground,
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginTop: '8px',
  },
  statusItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginRight: '12px',
    fontSize: tokens.fontSizeBase200,
  },
  statusIcon: {
    fontSize: '14px',
  },
  clockInIcon: {
    color: tokens.colorBrandForeground1,
  },
  breakIcon: {
    color: tokens.colorPaletteDarkOrangeBorder1,
  },
  clockOutIcon: {
    color: tokens.colorPaletteGreenBorder2,
  },
  noData: {
    textAlign: 'center',
    padding: '20px',
    color: tokens.colorNeutralForeground3,
  },
});

interface UserStatusTimelineProps {
  userFields: UserFields | null;
  userName: string | undefined;
}

const UserStatusTimeline: React.FC<UserStatusTimelineProps> = ({ userFields, userName }) => {
  const styles = useStyles();

  if (!userFields || !userFields.Clockin) {
    return (
      <div className={styles.timelineContainer}>
        <div className={styles.timelineHeader}>
          <Title3>Today's Activity</Title3>
        </div>
        <Text className={styles.noData}>No attendance data available</Text>
      </div>
    );
  }

  // Define work hours (8 AM to 6 PM)
  const workStart = 8;
  const workEnd = 18;
  const totalHours = workEnd - workStart;

  // Get clock in time
  const clockInTime = userFields.Clockin ? new Date(userFields.Clockin as string) : null;
  const clockInHour = clockInTime ? clockInTime.getHours() + (clockInTime.getMinutes() / 60) : null;
  
  // Calculate position as percentage
  const getPosition = (hour: number) => {
    // Clamp the hours to our displayed range
    const clampedHour = Math.max(workStart, Math.min(workEnd, hour));
    return ((clampedHour - workStart) / totalHours) * 100;
  };

  // Generate hours for the timeline
  const hours = [];
  for (let i = workStart; i <= workEnd; i++) {
    hours.push(i);
  }

  // Clock in position
  const clockInPosition = clockInHour ? getPosition(clockInHour) : 0;
  
  // Current time position for progress bar
  const now = new Date();
  const currentHour = now.getHours() + (now.getMinutes() / 60);
  const currentPosition = getPosition(currentHour);
  
  // Calculate progress width
  const progressWidth = clockInHour && currentHour > clockInHour 
    ? `${Math.min(currentPosition - clockInPosition, 100)}%` 
    : '0%';

  // Get mock break events for visualization
  const breakEvents = [
    { type: 'breakStart', hour: 10.5 },
    { type: 'breakEnd', hour: 11 },
    { type: 'breakStart', hour: 13 },
    { type: 'breakEnd', hour: 14 },
  ];

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timelineHeader}>
        <Title3>Today's Activity</Title3>
        <Badge appearance="filled" color="brand" shape="rounded">
          Present
        </Badge>
      </div>
      
      <div className={styles.timeline}>
        {/* Timeline progress bar */}
        <div 
          className={styles.timelineProgress} 
          style={{ 
            '--progress-width': progressWidth,
            left: `${clockInPosition}%` 
          } as React.CSSProperties}
        ></div>
        
        {/* Clock in marker */}
        {clockInHour && (
          <Tooltip content="Clock In" relationship="label">
            <div 
              className={styles.timelineEvent} 
              style={{ left: `${clockInPosition}%` }}
            >
              <ClockRegular className={`${styles.eventIcon} ${styles.clockInIcon}`} />
            </div>
          </Tooltip>
        )}
        
        {/* Break markers - for visualization */}
        {breakEvents.map((event, index) => (
          <Tooltip 
            key={index} 
            content={event.type === 'breakStart' ? 'Break Start' : 'Break End'}
            relationship="label"
          >
            <div 
              className={styles.timelineEvent} 
              style={{ 
                left: `${getPosition(event.hour)}%`,
                border: `2px solid ${event.type === 'breakStart' 
                  ? tokens.colorPaletteDarkOrangeBorder1 
                  : tokens.colorPaletteDarkOrangeBorder2}`
              }}
            >
              <DrinkCoffeeRegular className={`${styles.eventIcon} ${styles.breakIcon}`} />
            </div>
          </Tooltip>
        ))}
        
        {/* Current time marker if user is still clocked in */}
        {!userFields.Clockout && (
          <Tooltip content="Current Time" relationship="label">
            <div 
              className={styles.timelineEvent} 
              style={{ 
                left: `${currentPosition}%`,
                border: `2px solid ${tokens.colorNeutralForeground1}`,
                animation: 'pulse 2s infinite'
              }}
            >
              <ClockRegular className={styles.eventIcon} />
            </div>
          </Tooltip>
        )}
        
        {/* Clock out marker if user has clocked out */}
        {userFields.Clockout && (
          <Tooltip content="Clock Out" relationship="label">
            <div 
              className={styles.timelineEvent} 
              style={{ 
                left: `${getPosition(new Date(userFields.Clockout as string).getHours() + 
                  (new Date(userFields.Clockout as string).getMinutes() / 60))}%`,
                border: `2px solid ${tokens.colorPaletteGreenBorder2}`
              }}
            >
              <CheckmarkRegular className={`${styles.eventIcon} ${styles.clockOutIcon}`} />
            </div>
          </Tooltip>
        )}
        
        {/* Hour ticks */}
        <div className={styles.timelineTicks}>
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className={styles.timelineTick}></div>
              <Text 
                className={styles.timelineHour} 
                style={{ left: `${((hour - workStart) / totalHours) * 100}%` }}
              >
                {hour > 12 ? `${hour - 12}PM` : `${hour}AM`}
              </Text>
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className={styles.statusIndicator}>
        <div className={styles.statusItem}>
          <ClockRegular className={`${styles.statusIcon} ${styles.clockInIcon}`} />
          <Text>Clock In</Text>
        </div>
        <div className={styles.statusItem}>
          <DrinkCoffeeRegular className={`${styles.statusIcon} ${styles.breakIcon}`} />
          <Text>Break</Text>
        </div>
        <div className={styles.statusItem}>
          <CheckmarkRegular className={`${styles.statusIcon} ${styles.clockOutIcon}`} />
          <Text>Clock Out</Text>
        </div>
      </div>
    </div>
  );
};

export default UserStatusTimeline;