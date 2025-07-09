import React, { useState, useEffect } from 'react';
import { makeStyles, shorthands, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  clockContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  analogClock: {
    position: 'relative',
    width: '140px',
    height: '140px',
    ...shorthands.border('4px', 'solid', tokens.colorBrandBackground),
    ...shorthands.borderRadius('50%'),
    marginBottom: '16px',
    boxShadow: tokens.shadow8,
    backgroundColor: tokens.colorNeutralBackground1,
    '@media (max-width: 600px)': {
      width: '120px',
      height: '120px',
    },
  },
  clockFace: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  clockCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '12px',
    height: '12px',
    backgroundColor: tokens.colorBrandBackground,
    ...shorthands.borderRadius('50%'),
    transform: 'translate(-50%, -50%)',
    zIndex: 3,
  },
  hourHand: {
    position: 'absolute',
    bottom: '50%',
    left: 'calc(50% - 3px)',
    width: '6px',
    height: '30%',
    backgroundColor: tokens.colorNeutralForeground1,
    transformOrigin: 'bottom center',
    ...shorthands.borderRadius('4px'),
    zIndex: 2,
  },
  minuteHand: {
    position: 'absolute',
    bottom: '50%',
    left: 'calc(50% - 2px)',
    width: '4px',
    height: '40%',
    backgroundColor: tokens.colorNeutralForeground2,
    transformOrigin: 'bottom center',
    ...shorthands.borderRadius('4px'),
    zIndex: 1,
  },
  secondHand: {
    position: 'absolute',
    bottom: '50%',
    left: 'calc(50% - 1px)',
    width: '2px',
    height: '45%',
    backgroundColor: tokens.colorBrandForeground1,
    transformOrigin: 'bottom center',
    ...shorthands.borderRadius('4px'),
    zIndex: 0,
  },
  hourMarkers: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  digitalTime: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    marginTop: '8px',
    animation: 'pulse 1s infinite',
    animationName: {
      '0%': {
        opacity: 1,
      },
      '50%': {
        opacity: 0.7,
      },
      '100%': {
        opacity: 1,
      },
    },
  },
  date: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
  },
});

const LiveClock: React.FC = () => {
  const styles = useStyles();
  const [time, setTime] = useState(new Date());
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timerID = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerID);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDegrees = (hours % 12) * 30 + minutes * 0.5;
  const minuteDegrees = minutes * 6;
  const secondDegrees = seconds * 6;

  const hourHandStyle = {
    transform: `rotate(${hourDegrees}deg)`,
  };

  const minuteHandStyle = {
    transform: `rotate(${minuteDegrees}deg)`,
  };

  const secondHandStyle = {
    transform: `rotate(${secondDegrees}deg)`,
  };

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.clockContainer} onMouseEnter={()=> setIsHovered(true)} onMouseLeave={()=> setIsHovered(false)}>
      <div className={styles.analogClock}>
        <div className={styles.clockFace}>
          <div className={styles.hourHand} style={hourHandStyle}></div>
          <div className={styles.minuteHand} style={minuteHandStyle}></div>
          <div className={styles.secondHand} style={secondHandStyle}></div>
          <div className={styles.clockCenter}></div>
        </div>
      </div>
      <Text className={styles.digitalTime}>{formatTime(time)}</Text>
      <Text className={styles.date}>{formatDate(time)}</Text>
    </div>
  );
};

export default LiveClock;