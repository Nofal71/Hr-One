import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '0 16px',
    '@media (max-width: 600px)': {
      maxWidth: '100%',
      padding: '0 8px',
    },
  },
  card: {
    ...shorthands.padding('20px'),
    boxShadow: tokens.shadow8,
    ...shorthands.borderRadius('12px'),
    transition: 'all 0.3s ease',
    ':hover': {
      boxShadow: tokens.shadow16,
    },
    '@media (max-width: 600px)': {
      ...shorthands.padding('16px'),
    },
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '24px',
    textAlign: 'center',
  },
  clockInfoContainer: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  clockInfoRow: {
    display: 'grid',
    gridTemplateColumns: '40px 1fr 1fr',
    alignItems: 'center',
    marginBottom: '16px',
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.padding('0', '0', '12px', '0'),
    '@media (max-width: 400px)': {
      gridTemplateColumns: '30px 1fr 1fr',
      ...shorthands.padding('0', '0', '8px', '0'),
    },
  },
  clockIcon: {
    color: tokens.colorBrandForeground1,
    fontSize: '24px',
    '@media (max-width: 400px)': {
      fontSize: '20px',
    },
  },
  clockLabel: {
    fontWeight: tokens.fontWeightSemibold,
  },
  clockTime: {
    textAlign: 'right',
    fontWeight: tokens.fontWeightSemibold,
  },
  durationContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
    ...shorthands.padding('12px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius('8px'),
  },
  durationText: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '20px',
    gap: '16px',
    '@media (max-width: 400px)': {
      flexDirection: 'column',
      gap: '12px',
    },
  },
  clockButton: {
    flex: '1',
    height: '48px',
    '@media (max-width: 400px)': {
      width: '100%',
    },
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(1px)',
    },
  },
  breakButton: {
    flex: '1',
    height: '48px',
    '@media (max-width: 400px)': {
      width: '100%',
    },
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(1px)',
    },
  },
  leaveRequestButton: {
    marginTop: '16px',
    height: '48px',
    width: '100%',
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    fontWeight: tokens.fontWeightSemibold,
    ...shorthands.borderRadius('8px'),
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      backgroundColor: tokens.colorBrandBackgroundHover,
    },
    '&:active': {
      transform: 'translateY(1px)',
    },
  },
  welcomeText: {
    marginBottom: '8px',
    color: tokens.colorNeutralForeground2,
  },
  title: {
    marginBottom: '20px',
    color: tokens.colorBrandForeground1,
  },
  tableContainer: {
    marginTop: '24px',
    overflowX: 'auto',
    '& table': {
      width: '100%',
      minWidth: '300px',
    },
  },
  tableHeaderCell: {
    backgroundColor: tokens.colorNeutralBackground3,
    fontWeight: tokens.fontWeightSemibold,
    ...shorthands.padding('8px'),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
    '@media (max-width: 400px)': {
      ...shorthands.padding('6px'),
      fontSize: tokens.fontSizeBase200,
    },
  },
  tableCell: {
    ...shorthands.padding('8px'),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
    '@media (max-width: 400px)': {
      ...shorthands.padding('6px'),
      fontSize: tokens.fontSizeBase200,
    },
  },
  iconWrapper: {
    backgroundColor: tokens.colorBrandForeground1,
    borderRadius: '9999px',
    padding: '12px',
    marginBottom: '12px',
  },
  icon: {
    height: '24px',
    width: '24px',
    color: tokens.colorNeutralBackground1,
  },
  headerTextContainer: {
    textAlign: 'center',
    marginBottom: '16px',
  },
  greeting: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground2,
    marginBottom: '4px',
  },
  heading: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#000',
  },
  buttonWrapper: {
    width: '100%',
    marginTop: '16px',
  },
  clockInButton: {
    backgroundColor: tokens.colorBrandForeground1,
    color: tokens.colorNeutralBackground1,
    padding: '10px 16px',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorBrandBackground,
    },
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px',
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
    '@media (min-width: 1024px)': {
      gridTemplateColumns: '1fr 1fr 1fr',
    },
  },
  columnOne: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '0 30px',
  },
  columnTwo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  columnThree: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '0 30px',
  },
  calendarCard: {
    padding: '20px',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius('12px'),
    boxShadow: tokens.shadow8,
    transition: 'all 0.3s ease',
    ':hover': {
      boxShadow: tokens.shadow16,
      transform: 'translateY(-2px)',
    },
  },
  calendarHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    gap: '8px',
  },
  calendarIcon: {
    fontSize: '24px',
    color: tokens.colorBrandForeground1,
  },
  calendarBody: {
    ...shorthands.borderRadius('8px'),
    display: 'flex',
    justifyContent: 'center',
  },
  selectedDateInfo: {
    marginTop: '10px',
    textAlign: 'center',
  },
  selectedDateText: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '4px',
    color: tokens.colorBrandForeground1,
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '16px 0',
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  formLabel: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  input: {
    width: '100%',
    ...shorthands.borderRadius('6px'),
    '& input[type="file"]': {
      padding: '8px',
      backgroundColor: tokens.colorNeutralBackground1,
      ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
      ...shorthands.borderRadius('6px'),
    },
  },
  formButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  },
  formButton: {
    height: '40px',
    minWidth: '120px',
    ...shorthands.borderRadius('8px'),
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(1px)',
    },
  },
  errorText: {
    color: tokens.colorStatusDangerForeground3,
    marginBottom: '12px',
    fontWeight: tokens.fontWeightSemibold,
    textAlign: 'center',
  },
  iconWrapperStyle: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    background: `linear-gradient(135deg, ${tokens.colorBrandForeground1} 0%, ${tokens.colorBrandForeground2Hover} 90%)`,
    borderRadius: '50%',
    // marginBottom: '16px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
  },
  titleStyle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: tokens.colorNeutralForeground1,
    marginBottom: '8px'
  },
  noticecard: {
    width: '100%',
    height: '100%',
    transition: 'all 0.3s ease',
    ':hover': {
      boxShadow: tokens.shadow16,
    },
  },
});