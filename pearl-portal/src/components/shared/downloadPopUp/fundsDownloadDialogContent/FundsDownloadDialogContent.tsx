import { Autocomplete, AutocompleteRenderInputParams, Box, Fab, Grid, IconButton, InputAdornment, Paper, Popper, TextField, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { Theme } from "@mui/material";
import { createStyles, makeStyles } from '@mui/styles';
import { GridApi } from 'ag-grid-community';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CountryList } from '../../../../models/shared/sharedModels';
import { LP, NewLP } from '../../../../models/lps/lpModels';
import { useTheme } from "@mui/material/styles";
import { FundSummary } from '../../../../models/funds/fundModels';
import { PCOSummary } from '../../../../models/pcos/pcoModels';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/slices/rootSlice';

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
        height: '2.4em',
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
            width: '400px',
            marginRight: '1em',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontFamily: 'Raleway',
            borderRadius: 5,
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
interface AutocompletePopperProps {
    children: React.ReactNode;
    anchorEl: HTMLElement | null;
    // add any other props that your component needs
}

const AutocompletePopper = (props: any) => {
    const { children, ...popperProps } = props;
    const inputWidth = props.anchorEl?.clientWidth;

    return (
        <Popper {...popperProps} style={{ width: inputWidth }}>
            <Paper>{children}</Paper>
        </Popper>
    );
}

const FundsDownloadDialogContentComponent = () => {
    const classes = useStyles();
    const theme = useTheme();
    const autocompleteInputClasses = autocompleteInputStyles();
    const [selectedLPValue, setSelectedLPValue] = useState<LP | null>(null);
    const [selectedPCOValue, setSelectedPCOValue] = useState<PCOSummary | null>();
    const { lps } = useSelector((state: RootState) => state.lps);
    const { pcos } = useSelector((state: RootState) => state.pcos);

    const onLPChange = (event: React.SyntheticEvent, value: LP | null) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.nativeEvent.type === 'focusout') return;
        setSelectedLPValue(value);
    };

    const onPCOChange = (event: React.SyntheticEvent, value: PCOSummary | null) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.nativeEvent.type === 'focusout') return;
        setSelectedPCOValue(value);
    };

    return (
        <Grid container spacing={2}>
            <Grid item>
                <Typography variant='body2'>Select an LP</Typography>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, width: '400px', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                <Autocomplete
                    id={'lpdAutocomplete'}
                    popupIcon={<ExpandMoreIcon />}
                    size={'small'}
                    autoHighlight={true}
                    autoSelect={true}
                    autoComplete={false}
                    classes={classes}
                    limitTags={5}
                    sx={{ marginRight: '1em', width:'400px'  }}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(e, value) => onLPChange(e, value)}
                    value={selectedLPValue ?? null}
                    options={lps ?? []}
                    getOptionLabel={(option: LP) => option ? option.shortName : ''}
                    renderInput={(params: AutocompleteRenderInputParams) => {
                        params.InputProps.className = autocompleteInputClasses.textInput;
                        return <TextField {...params}
                            className={autocompleteInputClasses.autocomplete}
                            variant="outlined"
                            autoComplete="off"
                            type={'text'}
                             />;
                    }}
                />
                </Box>
            </Grid>
            <Grid item>
                <Typography variant='body2'>Select a PCO</Typography>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, width: '400px', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <Autocomplete
                        popupIcon={<ExpandMoreIcon />}
                        size={'small'}
                        id={'pcoAutocomplete'}
                        autoHighlight={true}
                        limitTags={5}
                        autoSelect={true}
                        autoComplete={false}
                        classes={classes}
                        sx={{ marginRight: '1em', width: '400px' }}
                        isOptionEqualToValue={(option, value) => option === value}
                        onChange={(e, value) => onPCOChange(e, value)}
                        value={selectedPCOValue ?? null}
                        options={pcos ?? []}
                        getOptionLabel={(option: PCOSummary) => option ? option.shortName : ''}
                        renderInput={(params: AutocompleteRenderInputParams) => {
                            params.InputProps.className = autocompleteInputClasses.textInput;
                            return <TextField {...params}
                                className={autocompleteInputClasses.autocomplete}
                                variant="outlined"
                                autoComplete="off"
                                type={'text'}
                            />
                        }}
                    />
                </Box>
            </Grid>
        </Grid>
    );
};

export default FundsDownloadDialogContentComponent;