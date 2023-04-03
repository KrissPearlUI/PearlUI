import { Autocomplete, AutocompleteRenderInputParams, Fab, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { Theme } from "@mui/material";
import { createStyles, makeStyles } from '@mui/styles';
import { GridApi } from 'ag-grid-community';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CountryList } from '../../../../models/shared/sharedModels';
import { NewLP } from '../../../../models/lps/lpModels';

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
const LPTypes = [
    "Corporate",
    "General Partner",
    "Individual",
    "Institutional",
];

interface AddNewLPContentProps {
    disabled: boolean,
    setDisabled: any,
    newLP: NewLP | null,
    setNewLP: (newState: any) => void,
}

const AddNewLPContentComponent = ({ setDisabled, disabled, newLP, setNewLP }: AddNewLPContentProps) => {
    const classes = useStyles();
    const autocompleteInputClasses = autocompleteInputStyles();
    const [selectedCountry, setSelectedCountry] = useState<string | null>('');
    const [selectedType, setSelectedType] = useState<string | null>('');
    const [name, setName] = useState<string>('');
    const [shortName, setShortName] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [postalCode, setPostalCode] = useState<string | number>('');
    const [baseCapital, setBaseCapital] = useState<number>(0);
    const [website, setWebsite] = useState<string | null>('');

    const onValueChange = (value: string, field: string) => {
        switch (field) {
            case 'name':
                setName(value);
                setNewLP({
                    ...newLP,
                    ['name']: value
                });
                setDisabled(value === '' || shortName === '' || selectedCountry === '' || selectedType === '' || city === '');
                break;
            case 'shortName':
                setShortName(value);
                setNewLP({
                    ...newLP,
                    ['shortName']: value
                });
                setDisabled(value === '' || name === '' || selectedCountry === '' || selectedType === '' || city === '');
                break;
            case 'address':
                setAddress(value);
                setNewLP({
                    ...newLP,
                    ['address']: value
                });
                setDisabled(name === '' || shortName === '' || selectedCountry === '' || selectedType === '' || city === '');
                break;
            case 'city':
                setCity(value);
                setNewLP({
                    ...newLP,
                    ['city']: value
                });
                setDisabled(name === '' || shortName === '' || selectedCountry === '' || selectedType === '' || value === '');
                break;
            case 'postalCode':
                setPostalCode(value);
                setNewLP({
                    ...newLP,
                    ['postalCode']: value
                });
                setDisabled(name === '' || shortName === '' || selectedCountry === '' || selectedType === '' || city === '');
                break;
            case 'country':
                setSelectedCountry(value);
                setNewLP({
                    ...newLP,
                    ['country']: value
                });
                setDisabled(value === '' || name === '' || shortName === '' || selectedType === '' || city === '');
                break;
            case 'type':
                setSelectedType(value);
                setNewLP({
                    ...newLP,
                    ['type']: value
                });
                setDisabled(value === '' || name === '' || selectedCountry === '' || shortName === '' || city === '');
                break;
            case 'baseCapital':
                setBaseCapital(+value);
                setNewLP({
                    ...newLP,
                    ['baseCapital']: +value
                });
                setDisabled(city === '' || name === '' || selectedCountry === '' || selectedType === '' || shortName === '');
                break;
            case 'website':
                setWebsite(value);
                setNewLP({
                    ...newLP,
                    ['website']: value
                });
                setDisabled(city === '' || name === '' || selectedCountry === '' || selectedType === '' || shortName === '');
                break;
            default:
                break;
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item>
                <Typography variant='body2'>Name*</Typography>
                <TextField
                    className={classes.searchBox}
                    variant="outlined"
                    size="small"
                    aria-label="name"
                    value={name}
                    helperText={!disabled && name === '' ? 'Required' : ''}
                    onChange={(e) => onValueChange(e.target.value, 'name')}
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
                    helperText={!disabled && address === '' ? 'Required' : ''}
                    onChange={(e) => onValueChange(e.target.value, 'address')}
                    inputProps={{
                        style: { height: '1em' },
                    }}
                />
            </Grid>
            <Grid container item sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Grid item xs={8}>
                    <Typography variant='body2'>City*</Typography>
                    <TextField
                        className={classes.textFildsSmall}
                        sx={{ width: '250px' }}
                        variant="outlined"
                        size="small"
                        aria-label="city"
                        value={city}
                        helperText={!disabled && city === '' ? 'Required' : ''}
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
                        helperText={!disabled && postalCode === '' ? 'Required' : ''}
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
                    disableClearable
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
                    disableClearable
                    classes={classes}
                    sx={{ marginRight: '1em', width: '400px' }}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(e, value: any) => onValueChange(value, 'type')}
                    value={selectedType ?? ''}
                    options={LPTypes.slice()}
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
                <Typography variant='body2'>Base Capital</Typography>
                <TextField
                    className={classes.searchBox}
                    variant="outlined"
                    size="small"
                    aria-label="baseCapital"
                    value={baseCapital}
                    type={'number'}
                    onChange={(e) => onValueChange(e.target.value, 'baseCapital')}
                    inputProps={{
                        style: { height: '1em' },
                    }}
                />
            </Grid>
            <Grid item>
                <Typography variant='body2'>Website</Typography>
                <TextField
                    className={classes.searchBox}
                    variant="outlined"
                    size="small"
                    aria-label="website"
                    value={website}
                    onChange={(e) => onValueChange(e.target.value, 'website')}
                    inputProps={{
                        style: { height: '1em' },
                    }}
                />
            </Grid>

        </Grid>
    );
};

export default AddNewLPContentComponent;