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
import moment from 'moment';

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
            width: '440px',
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

interface GeneralInformationStepContentProps {
    selectedLP: LP | null,
    setSelectedLP: React.Dispatch<React.SetStateAction<LP | null>>,
    disabled: boolean,
    setDisabled: any
}

const GeneralInformationStepContentComponent = ({ selectedLP, setSelectedLP, disabled, setDisabled }: GeneralInformationStepContentProps) => {
    const classes = useStyles();
    const theme = useTheme();
    const autocompleteInputClasses = autocompleteInputStyles();
    const [domicile, setDomicile] = useState<string | null>(selectedLP?.country ?? '');
    const [mainContact, setmainContact] = useState<string | null>(selectedLP?.mainContact ?? '');
    const [relationshipPartner, setRelationshipPartner] = useState<string>(selectedLP?.relationshipPartner ?? '');
    const [relationshipSS, setRelationshipSS] = useState<string>(selectedLP?.relationshipSS ?? '');
    const [address, setAddress] = useState<string>(selectedLP?.address ? selectedLP.address?.split(',')[0] : '');
    const [city, setCity] = useState<string>(selectedLP?.city ? selectedLP.city : selectedLP?.address ? selectedLP.address?.split(',')[1].split(' ')[2] : '');
    const [postalCode, setPostalCode] = useState<string | number>(selectedLP?.postalCode ? selectedLP.postalCode : selectedLP?.address ? selectedLP.address?.split(',')[1].split(' ')[1] : '');
    const [firstInvestment, setFirstInvestment] = useState<string>(selectedLP?.firstInvestment ?? '');
    const [website, setWebsite] = useState<string>(selectedLP?.website ?? '');
    const [type, setType] = useState<string | null>(selectedLP?.type ?? '');

    const onValueChange = (value: string, field: string) => {
        if (selectedLP) {
            switch (field) {
                case 'domicile':
                    setDomicile(value);
                    setSelectedLP({
                        ...selectedLP,
                        country: value
                    });
                    setDisabled(value === '');
                    break;
                case 'address':
                    setAddress(value);
                    setSelectedLP({
                        ...selectedLP,
                        address: value
                    });
                    setDisabled(value === '');
                    break;
                case 'city':
                    setCity(value);
                    setSelectedLP({
                        ...selectedLP,
                        city: value
                    });
                    setDisabled(value === '');
                    break;
                case 'postalCode':
                    setPostalCode(value);
                    setSelectedLP({
                        ...selectedLP,
                        postalCode: value
                    });
                    setDisabled(value === '');
                    break;
                case 'type':
                    setType(value);
                    setSelectedLP({
                        ...selectedLP,
                        type: value
                    });
                    setDisabled(value === '');
                    break;
                case 'website':
                    setWebsite(value);
                    setSelectedLP({
                        ...selectedLP,
                        website: value
                    });
                    setDisabled(value === '');
                    break;
                case 'mainContact':
                    setmainContact(value);
                    setSelectedLP({
                        ...selectedLP,
                        mainContact: value
                    });
                    setDisabled(value === '');
                    break;
                case 'relationshipPartner':
                    setRelationshipPartner(value);
                    setSelectedLP({
                        ...selectedLP,
                        relationshipPartner: value
                    });
                    setDisabled(value === '');
                    break;
                case 'relationshipSS':
                    setRelationshipSS(value);
                    setSelectedLP({
                        ...selectedLP,
                        relationshipSS: value
                    });
                    setDisabled(value === '');
                    break;
                default:
                    break;
            }
        }
    };

    const onDateChange = (value: any, field: string) => {
        if (field === 'firstInvestment') {
            setFirstInvestment(value);
            if (selectedLP) {
                setSelectedLP({
                    ...selectedLP,
                    firstInvestment: value
                });
            }
        }
    }

    return (
        <Grid container spacing={2} sx={{ flex: 1, width: '100%', marginTop: '0.2em' }}>
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        label='Domicile'
                        aria-label="name"
                        value={domicile}
                        onChange={(e) => onValueChange(e.target.value, 'domicile')}
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
                        label='Address'
                        aria-label="name"
                        value={address}
                        onChange={(e) => onValueChange(e.target.value, 'address')}
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
            <Grid container item sx={{ display: 'flex', justifyContent: 'space-between', flex: 1 }} spacing={4}>
                <Grid item xs={8}>
                    <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, width: '280px', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                        <TextField
                            className={classes.textFildsSmall}
                            sx={{ width: '280px' }}
                            variant="outlined"
                            size="small"
                            label='City'
                            aria-label="city"
                            value={city}
                            onChange={(e) => onValueChange(e.target.value, 'city')}
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
                <Grid item xs={4}>
                    <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, minWidth: '130px', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                        <TextField
                            className={classes.textFildsSmall}
                            variant="outlined"
                            sx={{ minWidth: '130px' }}
                            size="small"
                            aria-label="city"
                            label='Postal Code'
                            value={postalCode}
                            onChange={(e) => onValueChange(e.target.value, 'postalCode')}
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
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        aria-label="website"
                        label='Website'
                        value={website}
                        onChange={(e) => onValueChange(e.target.value, 'website')}
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
            <Divider sx={{ marginTop: '1.5em', marginBottom: '0.5em', marginLeft: '1em', minWidth: '440px' }} />
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, width: '440px', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <DatePicker
                        className={classes.datePickers}
                        inputFormat={'dd/MM/yyyy'}
                        disableFuture
                        value={firstInvestment ? moment(new Date(firstInvestment)).format('DD MMM YYYY') : null}
                        disableHighlightToday
                        onChange={(e) => onDateChange(e ?? '', 'firstInvestment')}
                        renderInput={(props: any) =>
                            <TextField {...props}
                                label={'First Investment'}
                                variant={'outlined'}
                                size={'small'}
                                className={classes.textField}
                                InputLabelProps={{
                                    sx: {
                                        fontSize: 'small'
                                    }
                                }}
                            />}
                    />
                </Box>
            </Grid>
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, width: '440px', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <Autocomplete
                        id={'fundsAutocomplete'}
                        popupIcon={<ExpandMoreIcon />}
                        size={'small'}
                        autoHighlight={true}
                        autoSelect={true}
                        autoComplete={false}
                        classes={classes}
                        sx={{ marginRight: '1em', width: '440px' }}
                        isOptionEqualToValue={(option, value) => option === value}
                        value={type ?? ''}
                        onChange={(e, value: any) => onValueChange(value, 'type')}
                        options={LPTypes.slice()}
                        renderInput={(params: AutocompleteRenderInputParams) => {
                            params.InputProps.className = autocompleteInputClasses.textInput;
                            return <TextField {...params}
                                className={autocompleteInputClasses.autocomplete}
                                variant="outlined"
                                autoComplete="off"
                                label='Type'
                                type={'text'}
                                InputLabelProps={{
                                    sx: {
                                        fontSize: 'small'
                                    }
                                }}
                            />;
                        }}
                    />
                </Box>
            </Grid>
            <Divider sx={{ marginTop: '1.5em', marginBottom: '0.5em', marginLeft: '1em', minWidth: '440px' }} />
            <Grid item>
                <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        aria-label="baseCapital"
                        label='Main Contact'
                        value={mainContact}
                        onChange={(e) => onValueChange(e.target.value, 'mainContact')}
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
                        label='Relationship Partner'
                        value={relationshipPartner}
                        onChange={(e) => onValueChange(e.target.value, 'relationshipPartner')}
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
                        label='Relationship SS'
                        value={relationshipSS}
                        onChange={(e) => onValueChange(e.target.value, 'relationshipSS')}
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

export default GeneralInformationStepContentComponent;