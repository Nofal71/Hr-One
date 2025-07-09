import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
            color: '#212121', // Darker text for headers
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
            color: '#212121',
        },
        subtitle1: {
            fontWeight: 600,
            fontSize: '1rem',
            color: '#212121',
        },
        body1: {
            fontWeight: 400,
            fontSize: '0.875rem',
            color: '#424242', // Slightly lighter for body text
        },
        caption: {
            fontWeight: 400,
            fontSize: '0.75rem',
            color: '#616161', // Muted for captions
        },
        button: {
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'none', // No uppercase for a modern look
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                    padding: '8px 16px',
                    boxShadow: 'none', // Remove default shadow
                    '&:hover': {
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    },
                },
                contained: {
                    '&:hover': {
                        opacity: 0.9,
                    },
                },
                outlined: {
                    borderWidth: '1px',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                },
                text: {
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputLabel-root': {
                        color: '#616161', // Muted label color
                        fontWeight: 500,
                    },
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                        '& fieldset': {
                            borderColor: '#bdbdbd',
                        },
                        '&:hover fieldset': {
                            borderColor: '#757575',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#1976d2', // Default MUI primary color
                        },
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#bdbdbd',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#757575',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    borderRadius: '16px',
                    color: '#ffffff', // White text for chips
                    '&:hover': {
                        opacity: 0.9,
                    },
                },
            },
        },
        MuiTable: {
            styleOverrides: {
                root: {
                    borderCollapse: 'separate',
                    borderSpacing: '0',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                    color: '#212121',
                    backgroundColor: '#f5f5f5',
                    borderBottom: '1px solid #e0e0e0',
                    padding: '12px',
                },
                body: {
                    borderBottom: '1px solid #e0e0e0',
                    color: '#424242',
                    padding: '12px',
                    '&:hover': {
                        backgroundColor: '#f5f5f5',
                    },
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    backgroundColor: '#ffffff',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#616161',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                },
            },
        },
    },
    shape: {
        borderRadius: 6, // Slightly larger radius for a softer look
    },
    shadows: [
        'none',
        '0 2px 4px rgba(0, 0, 0, 0.08)', // Subtle shadow for cards and dialogs
        '0 4px 8px rgba(0, 0, 0, 0.1)',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none'
    ],
});

export default muiTheme;