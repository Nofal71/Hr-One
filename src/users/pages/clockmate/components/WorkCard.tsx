import React, { useState } from 'react';
import { Card, tokens } from '@fluentui/react-components';
import { Clock } from "lucide-react";

interface TimeSessionProps {
  title: string;
  startTime: string | null;
  endTime: string | null;
  duration: string | null;
}

const WorkCard: React.FC<TimeSessionProps> = ({ title, startTime, endTime, duration }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Define inline styles
  const cardStyle = {
    backgroundColor: 'white',
    padding: '1.25rem',
    borderRadius: '0.75rem',
    marginBottom: '1rem',
    transition: 'all 300ms ease',
    boxShadow: isHovered ? 
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 
      '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    transform: isHovered ? 'translateY(-0.25rem)' : 'translateY(0)'
  };

  const iconContainerStyle = {
    backgroundColor: tokens.colorBrandBackground,
    padding: '0.5rem',
    borderRadius: '50%',
    marginRight: '0.75rem',
    animation: isHovered ? 'pulse 2s infinite' : 'none'
  };

  const iconStyle = {
    height: '1.25rem',
    width: '1.25rem',
    color: tokens.colorNeutralBackground1,
  };

  const durationStyle = {
    fontSize: '0.875rem',
    color: isHovered ? tokens.colorNeutralForeground2 : tokens.colorNeutralForeground3,
    fontWeight: isHovered ? 'bold' : 'normal',
    transition: 'all 300ms ease'
  };

  const detailTextStyle = {
    fontWeight: 'medium',
    color: isHovered ? '#111827' : 'inherit',
    transition: 'color 300ms ease'
  };

  // Define keyframe animations
  const keyframesStyle = `
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }
  `;

  return (
    <>
      <style>{keyframesStyle}</style>
      <div 
        style={cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={iconContainerStyle}>
              <Clock style={iconStyle} />
            </div>
            <h3 style={{ fontWeight: 500, color: '#1E293B' }}>{title}</h3>
          </div>
          <span style={durationStyle}>{duration}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <div>
            <p style={{ color: '#64748B', marginBottom: '0.25rem' }}>Start</p>
            <p style={detailTextStyle}>{startTime || "—"}</p>
          </div>
          <div>
            <p style={{ color: '#64748B', marginBottom: '0.25rem' }}>End</p>
            <p style={detailTextStyle}>{endTime || "—"}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkCard;
