import { Autocomplete, AutocompleteRenderInputParams, Fab, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { Theme } from "@mui/material";
import { createStyles, makeStyles } from '@mui/styles';
import { GridApi } from 'ag-grid-community';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CountryList, CurrencyList } from '../../../../models/shared/sharedModels';
import {  NewFund } from '../../../../models/funds/fundModels';

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
const FundTypes = [
    "Flex-term",
    "General"
];

interface AddNewLPContentProps {
    disabled: boolean,
    setDisabled: any,
    newFund: NewFund | null,
    setNewFund: (newState: any) => void,
}

const AddNewFundContentComponent = ({ disabled, setDisabled, newFund, setNewFund }: AddNewLPContentProps) => {
    const classes = useStyles();
    const autocompleteInputClasses = autocompleteInputStyles();
    const [selectedCountry, setSelectedCountry] = useState<string | null>('');
    const [selectedType, setSelectedType] = useState<string | null>('');
    const [fundName, setFundName] = useState<string>('');
    const [shortName, setShortName] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [postalCode, setPostalCode] = useState<string | number>('');
    const [selectedCurrency, setSelectedCurrency] = useState<string | null>('');

    const onValueChange = (value: string, field: string) => {
        switch (field) {
            case 'fundName':
                setFundName(value);
                setNewFund({
                    ...newFund,
                    ['fundName']: value
                });
                setDisabled(value === '' || shortName === '' || selectedCountry === '' || selectedType === '' || selectedCurrency === '');
                break;
            case 'shortName':
                setShortName(value);
                setNewFund({
                    ...newFund,
                    ['shortName']: value
                });
                setDisabled(value === '' || fundName === '' || selectedCountry === '' || selectedType === '' || selectedCurrency === '');
                break;
            case 'address':
                setAddress(value);
                setNewFund({
                    ...newFund,
                    ['address']: value
                });
                setDisabled(fundName === '' || shortName === '' || selectedCountry === '' || selectedType === '' || selectedCurrency === '');
                break;
            case 'city':
                setCity(value);
                setNewFund({
                    ...newFund,
                    ['city']: value
                });
                setDisabled(fundName === '' || shortName === '' || selectedCountry === '' || selectedType === '' || selectedCurrency === '');
                break;
            case 'postalCode':
                setPostalCode(value);
                setNewFund({
                    ...newFund,
                    ['postalCode']: value
                });
                setDisabled(fundName === '' || shortName === '' || selectedCountry === '' || selectedType === '' || selectedCurrency === '');
                break;
            case 'country':
                setSelectedCountry(value);
                setNewFund({
                    ...newFund,
                    ['country']: value
                });
                setDisabled(value === '' || fundName === '' || shortName === '' || selectedType === '' || selectedCurrency === '');
                break;
            case 'type':
                setSelectedType(value);
                setNewFund({
                    ...newFund,
                    ['type']: value
                });
                setDisabled(value === '' || fundName === '' || selectedCountry === '' || shortName === '' || selectedCurrency === '');
                break;
            case 'currency':
                setSelectedCurrency(value);
                setNewFund({
                    ...newFund,
                    ['currency']: value
                });
                setDisabled(value === '' || fundName === '' || selectedCountry === '' || selectedType === '' || shortName === '');
                break;
            default:
                break;
        }
    };

    /*     const onCountryChange = (event: any) => {
            setSelectedCountry(event);
        };
    
        const onFundTypeChange = (event: any) => {
            setSelectedType(event);
        }; */

    return (
        <Grid container spacing={2}>
            <Grid item>
                <Typography variant='body2'>Name*</Typography>
                <TextField
                    className={classes.searchBox}
                    variant="outlined"
                    size="small"
                    aria-label="fundName"
                    value={fundName}
                    helperText={!disabled && fundName === '' ? 'Required' : ''}
                    onChange={(e) => onValueChange(e.target.value, 'fundName')}
                    inputProps={{
                        style: { height: '1em' },
                    }}
                />
            </Grid>
            <Grid item>
                <Typography variant='body2'>Short Name*</Typography>
                <TextField
                    className={classes.searchBox}
                    variant="outlined"
                    size="small"
                    aria-label="name"
                    value={shortName}
                    helperText={!disabled && shortName === '' ? 'Required' : ''}
                    onChange={(e) => onValueChange(e.target.value, 'shortName')}
                    inputProps={{
                        style: { height: '1em' },
                    }}
                />
            </Grid>
            <Grid item>
                <Typography variant='body2'>Address</Typography>
                <TextField
                    className={classes.searchBox}
                    variant="outlined"
                    size="small"
                    aria-label="address"
                    value={address}
                    onChange={(e) => onValueChange(e.target.value, 'address')}
                    inputProps={{
                        style: { height: '1em' },
                    }}
                />
            </Grid>
            <Grid container item sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Grid item xs={8}>
                    <Typography variant='body2'>City</Typography>
                    <TextField
                        className={classes.textFildsSmall}
                        sx={{ width: '250px' }}
                        variant="outlined"
                        size="small"
                        aria-label="city"
                        value={city}
                        onChange={(e) => onValueChange(e.target.value, 'city')}
                        inputProps={{
                            style: { height: '1em' },
                        }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Typography variant='body2'>Postal Code</Typography>
                    <TextField
                        className={classes.textFildsSmall}
                        variant="outlined"
                        size="small"
                        aria-label="city"
                        value={postalCode}
                        onChange={(e) => onValueChange(e.target.value, 'postalCode')}
                        inputProps={{
                            style: { height: '1em' },
                        }}
                    />
                </Grid>
            </Grid>
            <Grid item>
                <Typography variant='body2'>Country*</Typography>
                <Autocomplete
                    id={'fundsAutocomplete'}
                    popupIcon={<ExpandMoreIcon />}
                    size={'small'}
                    autoHighlight={true}
                    autoSelect={true}
                    autoComplete={false}
                    classes={classes}
                    sx={{ marginRight: '1em', width: '400px' }}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(e, value: any) => onValueChange(value, 'country')}
                    value={selectedCountry ?? ''}
                    options={CountryList.slice()}
                    renderInput={(params: AutocompleteRenderInputParams) => {
                        params.InputProps.className = autocompleteInputClasses.textInput;
                        return <TextField {...params}
                            className={autocompleteInputClasses.autocomplete}
                            variant="outlined"
                            autoComplete="off"
                            helperText={!disabled && selectedCountry === '' ? 'Required' : ''}
                            type={'text'}
                        />;
                    }}
                />
            </Grid>
            <Grid item>
                <Typography variant='body2'>Type*</Typography>
                <Autocomplete
                    id={'fundsAutocomplete'}
                    popupIcon={<ExpandMoreIcon />}
                    size={'small'}
                    autoHighlight={true}
                    autoSelect={true}
                    autoComplete={false}
                    classes={classes}
                    sx={{ marginRight: '1em', width: '400px' }}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(e, value: any) => onValueChange(value, 'type')}
                    value={selectedType ?? ''}
                    options={FundTypes.slice()}
                    renderInput={(params: AutocompleteRenderInputParams) => {
                        params.InputProps.className = autocompleteInputClasses.textInput;
                        return <TextField {...params}
                            className={autocompleteInputClasses.autocomplete}
                            variant="outlined"
                            autoComplete="off"
                            helperText={!disabled && selectedType === '' ? 'Required' : ''}
                            type={'text'}
                        />;
                    }}
                />
            </Grid>
            <Grid item>
                <Typography variant='body2'>Currency*</Typography>
                <Autocomplete
                    id={'fundsAutocomplete'}
                    popupIcon={<ExpandMoreIcon />}
                    size={'small'}
                    autoHighlight={true}
                    autoSelect={true}
                    autoComplete={false}
                    classes={classes}
                    sx={{ marginRight: '1em', width: '400px' }}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(e, value: any) => onValueChange(value, 'currency')}
                    value={selectedCurrency ?? ''}
                    options={CurrencyList?.map(x => x.code)?.slice()}
                    renderInput={(params: AutocompleteRenderInputParams) => {
                        params.InputProps.className = autocompleteInputClasses.textInput;
                        return <TextField {...params}
                            className={autocompleteInputClasses.autocomplete}
                            variant="outlined"
                            autoComplete="off"
                            helperText={!disabled && selectedCurrency === '' ? 'Required' : ''}
                            type={'text'}
                        />;
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default AddNewFundContentComponent;