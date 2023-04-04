import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, AutocompleteRenderInputParams, Box, Divider, Fab, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { Theme } from "@mui/material";
import { createStyles, makeStyles } from '@mui/styles';
import { GridApi } from 'ag-grid-community';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CountryList } from '../../../../../models/shared/sharedModels';
import { NewLP } from '../../../../../models/lps/lpModels';
import { darken, useTheme } from "@mui/material/styles";
import { DatePicker } from '@mui/x-date-pickers';
import { minHeight } from '@mui/system';

const autocompleteInputStyles = makeStyles((theme: Theme) => ({
    autocomplete: {
        'borderRadius': 5,
        'backgroundColor': theme.palette.background.paper,
        '& input::placeholder': {
            color: theme.palette.text.primary
        },
        '& .Mui-disabled': {
            color: theme.palette.text.primary,
            opacity: 0.8
        }
    },
    textInput: {
        'color': theme.palette.text.primary,
        'fontWeight': 800,
        'fontFamily': 'Raleway',
        height: '2.2em',
        /* 'height': '2.5em', */
        'fontSize': 10,
        '& .MuiIconButton-label': {
            color: theme.palette.text.primary
        }
    },
    clearIndicator: {
        color: theme.palette.text.primary
    }
}));

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        chart: {
            flex: 1,
            textAlign: 'center',
            display: 'flex',
            alignContent: 'center',
        },
        fabIcon: {
            marginLeft: 10,
            alignSelf: 'center',
        },
        searchBox: {
            width: '435px',
            marginRight: '1em',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontFamily: 'Raleway',
            borderRadius: 5,
        },
        datePickers: {
            width: '100%',
            flex: 1,
        },
        textField: {
            width: '435px',
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.text.primary,
            color: theme.palette.text.primary,
            borderRadius: 5,
            '& .MuiSvgIcon-root':
            {
                color: theme.palette.text.primary
            },

            '& label': {
                '&.Mui-focused': {
                    color: theme.palette.text.primary
                }
            },
        },
        textFildsSmall: {
            marginRight: '1em',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontFamily: 'Raleway',
            borderRadius: 5,
        },
        inputRoot: {
            height: '1em',
            'borderRadius': 5,
            'backgroundColor': 'transparent',
            /*         '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'black'
                    },*/
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main
            },
            /*  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'black'
              }, */
            '& .MuiChip-root': {
                color: theme.palette.text.primary,
                backgroundColor: 'transparent',
                borderRadius: 5
            },
            '& .MuiChip-deleteIconSmall': {
                color: theme.palette.text.primary
            }
        },
        option: {
            'background': theme.palette.background.paper,
            '&:hover': {
                color: theme.palette.primary.main,
                fontWeight: 400,
                fontFamily: 'Raleway'
            },
            '&[aria-selected="true"]': {
                background: theme.palette.background.paper,
                color: theme.palette.primary.main,
                fontWeight: 700,
                fontFamily: 'Raleway'
            }
        },
        popupIndicator: {
            '&.MuiIconButton-root': {
                color: theme.palette.text.primary
            }
        },
        clearIndicator: {
            color: theme.palette.text.primary
        },
    }),
);
const LPTypes = [
    "Corporate",
    "General Partner",
    "Individual",
    "Institutional",
];

const CommitmentsStepContentComponent = () => {
    const classes = useStyles();
    const theme = useTheme();
    const autocompleteInputClasses = autocompleteInputStyles();
    const [country, setCountry] = useState<string | null>('');
    const [type, setType] = useState<string | null>('');
    const [name, setName] = useState<string>('');
    const [shortName, setShortName] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [postalCode, setPostalCode] = useState<string | number>('');
    const [baseCapital, setBaseCapital] = useState<number>(0);
    const [website, setWebsite] = useState<string>('');

    return (
        <Grid container spacing={2} sx={{ flex: 1, width: '100%' }}>
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <Accordion
                        key={`card-commitments`}
                        sx={{ marginBottom: '0.5em', backgroundColor: theme.palette.background.paper, width: '435px', borderLeft:`1px solid rgba(133, 133, 133,0.5)`,borderRight:`1px solid rgba(133, 133, 133,0.5)`,borderTop:`1px solid rgba(133, 133, 133,0.5)`, borderBottom:'none' }}
                    >
                        <AccordionSummary
                        sx={{height:'40px'}}
                            /* sx={{
                                'cursor': 'pointer',
                                'width': '100%',
                                'minHeight': '68px !important',
                                'paddingTop': 0,
                                'backgroundColor': theme.palette.background.paper,
                               
                            }} */
                            expandIcon={
                                <IconButton>
                                    <ExpandMoreIcon
                                        sx={{ pointerEvents: 'auto', cursor: 'pointer' }} />
                                </IconButton>
                            }
                        >
                            <Grid container
                                sx={{ display: 'flex', flex: 1, height: '100%', width: '100%', alignItems: 'center' }}>
                                <Grid container>
                                    <Typography variant='body1' sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>Commitments</Typography>
                                </Grid>
                                <Grid container>
                                    <Typography variant='body2' sx={{ color: theme.palette.mode === 'light' ? 'rgba(69, 69, 69, 0.7)' : darken(theme.palette.text.primary, 0.4), fontWeight: 400, fontSize: '14px' }}>10 Commitments</Typography>
                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails
                            sx={{
                                backgroundColor: theme.palette.background.paper,
                                width: '100%', padding: '0.1em', display: 'flex', height: '100%', pointerEvents: 'auto'
                            }}>

                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Grid>
            <Grid item>
            <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <Accordion
                        key={`card-commitments`}
                        sx={{ marginBottom: '0.5em', backgroundColor: theme.palette.background.paper, width: '435px', borderLeft:`1px solid rgba(133, 133, 133,0.5)`,borderRight:`1px solid rgba(133, 133, 133,0.5)`,borderTop:`1px solid rgba(133, 133, 133,0.5)`, borderBottom:'none' }}
                    >
                        <AccordionSummary
                        sx={{height:'40px'}}
                            /* sx={{
                                'cursor': 'pointer',
                                'width': '100%',
                                'minHeight': '68px !important',
                                'paddingTop': 0,
                                'backgroundColor': theme.palette.background.paper,
                               
                            }} */
                            expandIcon={
                                <IconButton>
                                    <ExpandMoreIcon
                                        sx={{ pointerEvents: 'auto', cursor: 'pointer' }} />
                                </IconButton>
                            }
                        >
                            <Grid container
                                sx={{ display: 'flex', flex: 1, height: '100%', width: '100%', alignItems: 'center' }}>
                                <Grid container>
                                    <Typography variant='body1' sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>Funds</Typography>
                                </Grid>
                                <Grid container>
                                    <Typography variant='body2' sx={{ color: theme.palette.mode === 'light' ? 'rgba(69, 69, 69, 0.7)' : darken(theme.palette.text.primary, 0.4), fontWeight: 400, fontSize: '14px' }}>10 Funds</Typography>
                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails
                            sx={{
                                backgroundColor: theme.palette.background.paper,
                                width: '100%', padding: '0.1em', display: 'flex', height: '100%', pointerEvents: 'auto'
                            }}>

                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Grid>
            <Grid item style={{ paddingTop: '3em' }}>
            <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <Accordion
                        key={`card-commitments`}
                        sx={{ marginBottom: '0.5em', backgroundColor: theme.palette.background.paper, width: '435px', borderLeft:`1px solid rgba(133, 133, 133,0.5)`,borderRight:`1px solid rgba(133, 133, 133,0.5)`,borderTop:`1px solid rgba(133, 133, 133,0.5)`, borderBottom:'none' }}
                    >
                        <AccordionSummary
                        sx={{height:'40px'}}
                            /* sx={{
                                'cursor': 'pointer',
                                'width': '100%',
                                'minHeight': '68px !important',
                                'paddingTop': 0,
                                'backgroundColor': theme.palette.background.paper,
                               
                            }} */
                            expandIcon={
                                <IconButton>
                                    <ExpandMoreIcon
                                        sx={{ pointerEvents: 'auto', cursor: 'pointer' }} />
                                </IconButton>
                            }
                        >
                            <Grid container
                                sx={{ display: 'flex', flex: 1, height: '100%', width: '100%', alignItems: 'center' }}>
                                <Grid container>
                                    <Typography variant='body1' sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>PCOs</Typography>
                                </Grid>
                                <Grid container>
                                    <Typography variant='body2' sx={{ color: theme.palette.mode === 'light' ? 'rgba(69, 69, 69, 0.7)' : darken(theme.palette.text.primary, 0.4), fontWeight: 400, fontSize: '14px' }}>10 PCOs</Typography>
                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails
                            sx={{
                                backgroundColor: theme.palette.background.paper,
                                width: '100%', padding: '0.1em', display: 'flex', height: '100%', pointerEvents: 'auto'
                            }}>

                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Grid>
            <Grid item style={{ paddingBottom: '2em' }}>
            <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <Accordion
                        key={`card-commitments`}
                        sx={{ marginBottom: '0.5em', backgroundColor: theme.palette.background.paper, width: '435px', borderLeft:`1px solid rgba(133, 133, 133,0.5)`,borderRight:`1px solid rgba(133, 133, 133,0.5)`,borderTop:`1px solid rgba(133, 133, 133,0.5)`, borderBottom:'none' }}
                    >
                        <AccordionSummary
                        sx={{height:'40px'}}
                            /* sx={{
                                'cursor': 'pointer',
                                'width': '100%',
                                'minHeight': '68px !important',
                                'paddingTop': 0,
                                'backgroundColor': theme.palette.background.paper,
                               
                            }} */
                            expandIcon={
                                <IconButton>
                                    <ExpandMoreIcon
                                        sx={{ pointerEvents: 'auto', cursor: 'pointer' }} />
                                </IconButton>
                            }
                        >
                            <Grid container
                                sx={{ display: 'flex', flex: 1, height: '100%', width: '100%', alignItems: 'center' }}>
                                <Grid container>
                                    <Typography variant='body1' sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>Exits</Typography>
                                </Grid>
                                <Grid container>
                                    <Typography variant='body2' sx={{ color: theme.palette.mode === 'light' ? 'rgba(69, 69, 69, 0.7)' : darken(theme.palette.text.primary, 0.4), fontWeight: 400, fontSize: '14px' }}>10 Exits</Typography>
                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails
                            sx={{
                                backgroundColor: theme.palette.background.paper,
                                width: '100%', padding: '0.1em', display: 'flex', height: '100%', pointerEvents: 'auto'
                            }}>

                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Grid>S
        </Grid>
    );
};

export default CommitmentsStepContentComponent;