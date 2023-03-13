import {createTheme, darken} from '@mui/material';
import {blue} from '@mui/material/colors';

/**
 * Creat light theme using material ui
 * Set the typography properties based on your preferences (fontFamily, fontWeight)
 * Set palette default properties to colors of your choice
 * Override material ui components like scrollbars, icons or tooltips
 */
export const lightTheme = createTheme({
    typography: {
        fontFamily:'Raleway',
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 600
    },
    palette: {
        mode: 'light',
        primary: {
            main: '#1B4357',
        },
        secondary: {
            main: '#25607E'
        },
        success: {
            main: '#008000'
        },
        warning: {
            main: '#FF9826'
        },
        error: {
            main: '#660700'
        },
        info: {
            main: blue[900]
        },
        background: {
            paper: '#F9F7F7',
            default: '#E1E6E8'
        },
        text: {
            primary: '#454545'
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                '*::-webkit-scrollbar': {
                    width: '.5em',
                    height: '.5em'
                },
                '*::-webkit-scrollbar-track': {
                    backgroundColor: '#fafafa'
                },
                '*::-webkit-scrollbar-thumb': {
                    backgroundColor: '#c2c2c2',
                    borderRadius: 10,
                    backgroundClip: 'content-box'
                },
                '*::-webkit-scrollbar-corner': {
                    backgroundColor: '#fafafa'
                }
            }
        },
        MuiIcon: {
            styleOverrides: {
                colorPrimary: {
                    color: 'red'
                }
            }
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    padding: '0.1em'
                }
            }
        }
    }
});

/**
 * Creat dark theme using material ui
 * Set the typography properties based on your preferences (fontFamily, fontWeight)
 * Set palette default properties to colors of your choice
 * Override material ui components like scrollbars, icons or tooltips
 */
export const darkTheme = createTheme({
    typography: {
        fontFamily:'Raleway',
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 600
    },
    palette: {
        mode: 'dark',
        primary: {
            main: '#008000',
        },
        secondary: {
            main: '#80C080'
        },
        success: {
            main: '#008000'
        },
        warning: {
            main: '#FF9826'
        },
        error: {
            main: '#660700'
        },
        info: {
            main: blue[800]
        },
        background: {
            paper: '#06050A',
            default: '#29292B'
        },
        text: {
            primary: '#F5F5F5'
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                '*::-webkit-scrollbar': {
                    width: '.5em',
                    height: '.5em'
                },
                '*::-webkit-scrollbar-track': {
                    backgroundColor: '#181d1f'
                },
                '*::-webkit-scrollbar-thumb': {
                    backgroundColor: '#68686e',
                    borderRadius: 10,
                    backgroundClip: 'content-box'
                },
                '*::-webkit-scrollbar-corner': {
                    backgroundColor: '#181d1f'
                }
            }
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    padding: '0.1em'
                }
            }
        }
    }
});
