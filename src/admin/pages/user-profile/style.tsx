import { shorthands, tokens } from '@fluentui/react-components';
import type { GriffelStyle } from '@fluentui/react-components';

export const container: GriffelStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export const content: GriffelStyle = {
  display: 'flex',
  ...shorthands.gap('24px'),
  width: '100%',
  maxWidth: '1200px',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
  },
};

export const backButton: GriffelStyle = {
  ...shorthands.borderRadius(tokens.borderRadiusMedium),
  ...shorthands.padding('8px', '16px'),
  backgroundColor: tokens.colorNeutralBackground1,
  ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  color: tokens.colorNeutralForeground2,
  alignSelf: 'flex-start',
  fontWeight: 600,
  ':hover': {
    backgroundColor: tokens.colorNeutralBackground1Hover,
    ...shorthands.borderColor(tokens.colorBrandStroke1),
    color: tokens.colorNeutralForeground1,
  },
};

export const summaryCard: GriffelStyle = {
  flex: '1 1 300px',
  backgroundColor: tokens.colorNeutralBackground1,
  ...shorthands.borderRadius(tokens.borderRadiusXLarge),
  ...shorthands.padding('24px'),
  boxShadow: tokens.shadow8,
};

export const detailsCard: GriffelStyle = {
  flex: '2 1 400px',
  position: 'relative',
  backgroundColor: tokens.colorNeutralBackground1,
  ...shorthands.borderRadius(tokens.borderRadiusXLarge),
  ...shorthands.padding('24px'),
  boxShadow: tokens.shadow8,
};

export const persona: GriffelStyle = {
  marginBottom: '16px',
  '@media (max-width: 768px)': {
    marginBottom: '12px',
  },
};

export const name: GriffelStyle = {
  color: tokens.colorNeutralForeground1,
  fontWeight: 700,
  lineHeight: '1.5',
};

export const jobTitle: GriffelStyle = {
  color: tokens.colorNeutralForeground2,
  fontSize: '16px',
  lineHeight: '1.5',
  fontWeight: 500,
  '@media (max-width: 768px)': {
    fontSize: '14px',
  },
};

export const summaryContent: GriffelStyle = {
  ...shorthands.padding('12px', '0'),
};

export const detailsContent: GriffelStyle = {
  ...shorthands.padding('12px', '0'),
};

export const divider: GriffelStyle = {
  color: tokens.colorNeutralForeground3,
  fontSize: '14px',
  fontWeight: 600,
  ...shorthands.margin('16px', '0'),
  '@media (max-width: 768px)': {
    ...shorthands.margin('12px', '0'),
  },
};

export const label: GriffelStyle = {
  minWidth: '120px',
  fontWeight: 600,
  color: tokens.colorNeutralForeground1,
  fontSize: '14px',
  lineHeight: '1.5',
  '@media (max-width: 768px)': {
    minWidth: '100px',
  },
};

export const text: GriffelStyle = {
  color: tokens.colorNeutralForeground2,
  fontSize: '14px',
  lineHeight: '1.5',
};

export const tag: GriffelStyle = {
  backgroundColor: tokens.colorBrandBackground2,
  color: tokens.colorBrandForeground2,
  ...shorthands.borderRadius(tokens.borderRadiusMedium),
  fontWeight: 500,
};

export const actions: GriffelStyle = {
  position: 'absolute',
  right: '15px',
  top: '15px',
};

export const actionButton: GriffelStyle = {
  ...shorthands.borderRadius(tokens.borderRadiusMedium),
  backgroundColor: tokens.colorBrandBackground,
  color: tokens.colorNeutralForegroundOnBrand,
  ...shorthands.padding('8px', '16px'),
  fontWeight: 600,
  ':hover': {
    backgroundColor: tokens.colorBrandBackgroundHover,
  },
  ':disabled': {
    backgroundColor: tokens.colorNeutralBackgroundDisabled,
    color: tokens.colorNeutralForegroundDisabled,
  },
};

export const errorText: GriffelStyle = {
  color: tokens.colorPaletteRedForeground1,
  fontSize: '16px',
  textAlign: 'center',
  lineHeight: '1.5',
};

export const loaderOverlay: GriffelStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
};

export const loader: GriffelStyle = {
  ...shorthands.padding('16px'),
};

export const notesContainer: GriffelStyle = {
  minHeight: '100px',
  maxHeight: '400px',
  overflowY: 'auto',
  ...shorthands.padding('16px'),
  ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  ...shorthands.borderRadius(tokens.borderRadiusMedium),
  backgroundColor: tokens.colorNeutralBackground2,
  ...shorthands.gap('12px'),
  display: 'flex',
  flexDirection: 'column',
  scrollbarWidth: 'thin',
  scrollbarColor: `${tokens.colorNeutralStroke1} ${tokens.colorNeutralBackground1}`,
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: tokens.colorNeutralBackground1,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: tokens.colorNeutralStroke1,
    ...shorthands.borderRadius('4px'),
  },
};

export const noteCard: GriffelStyle = {
  backgroundColor: tokens.colorNeutralBackground1,
  ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
  ...shorthands.borderRadius(tokens.borderRadiusMedium),
  ...shorthands.padding('12px'),
  alignItems: 'center',
  boxShadow: tokens.shadow4,
  minHeight: '48px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: tokens.colorNeutralBackground1Hover,
    ...shorthands.borderColor(tokens.colorBrandStroke1),
    boxShadow: tokens.shadow8,
  },
  ':active': {
    backgroundColor: tokens.colorNeutralBackground1Pressed,
  },
  '@media (max-width: 768px)': {
    ...shorthands.padding('8px'),
    minHeight: '40px',
  },
};

export const noteHeader: GriffelStyle = {
  flexShrink: 0,
  minHeight: '32px',
  alignItems: 'center',
  display: 'flex',
};

export const toggleButton: GriffelStyle = {
  minWidth: '32px',
  ...shorthands.padding('4px'),
  ':hover': {
    backgroundColor: tokens.colorNeutralBackground1Hover,
  },
  ':disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
};

export const notePreview: GriffelStyle = {
  fontSize: '14px',
  fontWeight: 500,
  color: tokens.colorNeutralForeground1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  flex: 1,
  lineHeight: '1.5',
  ...shorthands.padding('4px', '8px'),
};

export const quillEditor: GriffelStyle = {
  '& .ql-container': {
    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif !important',
    fontSize: '14px !important',
    backgroundColor: '#fffef2 !important',
    ...shorthands.border('none !important'),
    minHeight: '250px !important',
    maxHeight: '250px !important',
    lineHeight: '1.5 !important',
    scrollbarWidth: 'thin',
    scrollbarColor: `${tokens.colorNeutralStroke1} ${tokens.colorNeutralBackground1}`,
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#fffef2',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: tokens.colorNeutralStroke1,
      ...shorthands.borderRadius('4px'),
    },
    '@media (max-width: 768px)': {
      minHeight: '200px !important',
      maxHeight: '200px !important',
      fontSize: '12px !important',
    },
  },
  '& .ql-editor': {
    ...shorthands.padding('12px !important'),
    minHeight: '210px !important',
    '@media (max-width: 768px)': {
      ...shorthands.padding('8px !important'),
      minHeight: '160px !important',
    },
  },
  '& .ql-toolbar': {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius('4px 4px 0 0 !important'),
    position: 'sticky',
    top: '0',
    zIndex: 1,
  },
};

export const noteMeta: GriffelStyle = {
  ...shorthands.padding('8px', '0'),
  borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  flexShrink: 0,
};

export const noteTimestamp: GriffelStyle = {
  fontSize: '12px',
  color: tokens.colorNeutralForeground3,
  lineHeight: '1.5',
  '@media (max-width: 768px)': {
    fontSize: '10px',
  },
};

export const dialogSurface: GriffelStyle = {
  width: '90vw',
  maxWidth: '600px',
  minHeight: '400px',
  ...shorthands.borderRadius('8px'),
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: tokens.colorNeutralBackground1,
  boxShadow: tokens.shadow16,
  '@media (max-width: 768px)': {
    minHeight: '350px',
    maxWidth: '90vw',
  },
};

export const dialogBody: GriffelStyle = {
  ...shorthands.padding('24px'),
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  flexGrow: 1,
  '@media (max-width: 768px)': {
    ...shorthands.padding('16px'),
  },
};

export const dialogActions: GriffelStyle = {
  ...shorthands.padding('0', '24px', '24px', '24px'),
  '@media (max-width: 768px)': {
    ...shorthands.padding('0', '16px', '16px', '16px'),
  },
};