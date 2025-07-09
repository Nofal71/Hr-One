import type { IStackStyles, IButtonStyles } from '@fluentui/react';

export const navStyles: IStackStyles = {
  root: {
    width: 240,
    background: '#fafafa',
    borderRight: '1px solid #e0e0e0',
    transition: 'width 0.2s ease-in-out',
    overflowY: 'auto',
    overflowX: 'hidden',
    boxShadow: '2px 0 6px rgba(0, 0, 0, 0.04)',
    position: 'relative',
  },
};

export const headerStyles: IStackStyles = {
  root: {
    height: 48,
    padding: '0 8px',
    background: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
    zIndex: 100,
  },
};

export const contentStyles: React.CSSProperties = {
  padding: '20px',
  background: '#f5f5f5',
  height: 'calc(100vh - 48px)',
  overflowY: 'auto',
  transition: 'all 0.2s ease-in-out',
};

export const drawerButtonStyles: IButtonStyles = {
  root: {
    position: 'absolute',
    top: 8,
    right: 8,
    background: 'transparent',
    borderRadius: 4,
    width: 32,
    height: 32,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rootHovered: {
    background: '#f0f0f0',
  },
  icon: {
    fontSize: 16,
    color: '#444',
  },
};