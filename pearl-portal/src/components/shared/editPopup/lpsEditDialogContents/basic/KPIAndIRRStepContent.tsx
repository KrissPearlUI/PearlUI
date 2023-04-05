import { Autocomplete, AutocompleteRenderInputParams, Box, Divider, Fab, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { Theme } from "@mui/material";
import { createStyles, makeStyles } from '@mui/styles';
import { GridApi } from 'ag-grid-community';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CountryList } from '../../../../../models/shared/sharedModels';
import { LP, NewLP } from '../../../../../models/lps/lpModels';
import { useTheme } from "@mui/material/styles";
import { DatePicker } from '@mui/x-date-pickers';

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
            width: '440px',
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

interface KPIAndIRRStepContentProps {
    selectedLP: LP | null,
    setSelectedLP: React.Dispatch<React.SetStateAction<LP | null>>,
    disabled: boolean,
    setDisabled: any
}

const KPIAndIRRStepContentComponent = ({ selectedLP, setSelectedLP, disabled, setDisabled }: KPIAndIRRStepContentProps) => {
    const classes = useStyles();
    const theme = useTheme();
    const autocompleteInputClasses = autocompleteInputStyles();
    const [netDPI, setNetDPI] = useState<number | null>(selectedLP?.kpis?.netDPI ? selectedLP?.kpis?.netDPI : null);
    const [grossDPI, setGrossDPI] = useState<number | null>(selectedLP?.kpis?.grossDPI ? selectedLP?.kpis?.grossDPI : null);
    const [netTVPI, setNetTVPI] = useState<number | null>(selectedLP?.kpis?.netTVPI ? selectedLP?.kpis?.netTVPI : null);
    const [grossTVPI, setGrossTVPI] = useState<number | null>(selectedLP?.kpis?.grossTVPI ? selectedLP?.kpis?.grossTVPI : null);
    const [netIRR, setNetIRR] = useState<number | null>(selectedLP?.kpis?.netIRR ? selectedLP?.kpis?.netIRR : null);
    const [grossIRR, setGrossIRR] = useState<number | null>(selectedLP?.kpis?.grossIRR ? selectedLP?.kpis?.grossIRR : null);

    const onValueChange = (value: string, field: string) => {
        if (selectedLP) {
            switch (field) {
                case 'netDPI':
                    setNetDPI(+value);
                    setSelectedLP({
                        ...selectedLP,
                        kpis: {
                            ...selectedLP.kpis,
                            netDPI: +value
                        }
                    });
                    setDisabled(value === '');
                    break;
                case 'grossDPI':
                    setGrossDPI(+value);
                    setSelectedLP({
                        ...selectedLP,
                        kpis: {
                            ...selectedLP.kpis,
                            grossDPI: +value
                        }
                    });
                    setDisabled(value === '');
                    break;
                case 'netTVPI':
                    setNetTVPI(+value);
                    setSelectedLP({
                        ...selectedLP,
                        kpis: {
                            ...selectedLP.kpis,
                            netTVPI: +value
                        }
                    });
                    setDisabled(value === '');
                    break;
                case 'grossTVPI':
                    setGrossTVPI(+value);
                    setSelectedLP({
                        ...selectedLP,
                        kpis: {
                            ...selectedLP.kpis,
                            grossTVPI: +value
                        }
                    });
                    setDisabled(value === '');
                    break;
                case 'netIRR':
                    setNetIRR(+value);
                    setSelectedLP({
                        ...selectedLP,
                        kpis: {
                            ...selectedLP.kpis,
                            netIRR: +value
                        }
                    });
                    setDisabled(value === '');
                    break;
                case 'grossIRR':
                    setGrossIRR(+value);
                    setSelectedLP({
                        ...selectedLP,
                        kpis: {
                            ...selectedLP.kpis,
                            grossIRR: +value
                        }
                    });
                    setDisabled(value === '');
                    break;
                default:
                    break;
            }
        }
    };

    return (
        <Grid container spacing={2} sx={{ flex: 1, width: '100%', marginTop: '0.2em' }}>
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        label='Net DPI'
                        aria-label="name"
                        value={netDPI}
                        onChange={(e) => onValueChange(e.target.value, 'netDPI')}
                        inputProps={{
                            style: { height: '1em' },
                        }}
                        InputLabelProps={{
                            sx: {
                                fontSize: 'small'
                            }
                        }}
                    />
                </Box>
            </Grid>
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        label='Gross DPI'
                        aria-label="name"
                        value={grossDPI}
                        onChange={(e) => onValueChange(e.target.value, 'grossDPI')}
                        inputProps={{
                            style: { height: '1em' },
                        }}
                        InputLabelProps={{
                            sx: {
                                fontSize: 'small'
                            }
                        }}
                    />
                </Box>
            </Grid>
            <Grid item style={{ paddingTop: '3em' }}>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        aria-label="website"
                        label='Net TVPI'
                        value={netTVPI}
                        onChange={(e) => onValueChange(e.target.value, 'netTVPI')}
                        inputProps={{
                            style: { height: '1em' },
                        }}
                        InputLabelProps={{
                            sx: {
                                fontSize: 'small'
                            }
                        }}
                    />
                </Box>
            </Grid>
            <Grid item style={{ paddingBottom: '2em' }}>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        aria-label="baseCapital"
                        label='Gross TVPI'
                        value={grossTVPI}
                        onChange={(e) => onValueChange(e.target.value, 'grossTVPI')}
                        inputProps={{
                            style: { height: '1em' },
                        }}
                        InputLabelProps={{
                            sx: {
                                fontSize: 'small'
                            }
                        }}
                    />
                </Box>
            </Grid>
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        aria-label="website"
                        label='Net IRR'
                        value={netIRR ? (netIRR * 100).toFixed(2) : null}
                        onChange={(e) => onValueChange(e.target.value, 'netIRR')}
                        inputProps={{
                            style: { height: '1em' },
                        }}
                        InputLabelProps={{
                            sx: {
                                fontSize: 'small'
                            }
                        }}
                    />
                </Box>
            </Grid>
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        aria-label="website"
                        label='Gross IRR'
                        value={grossIRR}
                        onChange={(e) => onValueChange(e.target.value, 'grossIRR')}
                        inputProps={{
                            style: { height: '1em' },
                        }}
                        InputLabelProps={{
                            sx: {
                                fontSize: 'small'
                            }
                        }}
                    />
                </Box>
            </Grid>
        </Grid>
    );
};

export default KPIAndIRRStepContentComponent;