import React from 'react';
import { Autocomplete, AutocompleteRenderInputParams, Grid, IconButton, InputAdornment, TextField, Theme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import makeStyles from '@mui/styles/makeStyles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { isValueEmpty } from '../../../helpers/app';
import { LP } from '../../../models/lps/lpModels';
import ExportButton from '../../shared/ExportButton';
import AddButton from '../../shared/AddButton';
import { FundSummary } from '../../../models/funds/fundModels';

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

const useStyles = makeStyles((theme: Theme) => ({
    searchBox: {
        width: '320px',
        marginRight: '1em',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        fontFamily: 'Raleway',
        borderRadius: 5,
    },
    inputRoot: {
        'borderRadius': 5,
        'backgroundColor': theme.palette.background.paper,
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
            backgroundColor: theme.palette.background.paper,
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
}));

interface PCOToolbarProps {
    searchText: string | null;
    funds: FundSummary[] | null;
    lps: LP[] | null;
    selectedFundValue: FundSummary[] | null,
    selectedLPValue: LP[] | null,
    searchTextValue: string | null,
    onValueChange: (v: any) => void,
    onCancelClick: (v: any) => void,
    onFundChange: (v: any, s: any) => void,
    onLPChange: (v: any, s: any) => void,
}

const PCOToolbar = ({ searchText,
    funds,
    lps,
    selectedFundValue,
    selectedLPValue,
    searchTextValue,
    onValueChange,
    onCancelClick,
    onFundChange,
    onLPChange }: PCOToolbarProps) => {
    const classes = useStyles();
    const autocompleteInputClasses = autocompleteInputStyles();

    return (
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginBottom: '0.5em', width: '100%', overflow: 'hidden', paddingTop: { xs: '0.5em', md: '0.1em', lg: '0.1em' } }}>
            <Grid container item xs={12} sm={12} md={6} lg={6}
                sx={{ display: 'flex' }}>
                <Autocomplete
                    id={'fundAutocomplete'}
                    popupIcon={<ExpandMoreIcon />}
                    size={'small'}
                    autoHighlight={true}
                    autoSelect={true}
                    autoComplete={false}
                    classes={classes}
                    multiple
                    sx={{ marginRight: '1em', width: selectedFundValue && selectedFundValue.length > 3 ? '730px' : '320px', marginBottom: { xs: '1em', md: selectedFundValue && selectedFundValue.length > 3 ? '1em' : 0, lg: selectedFundValue && selectedFundValue.length > 3 ? '1em' : 0 } }}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(e, value) => onFundChange(e, value)}
                    value={selectedFundValue ?? []}
                    options={funds ?? []}
                    getOptionLabel={(option: FundSummary) => option ? option.id : ''}
                    renderInput={(params: AutocompleteRenderInputParams) => {
                        params.InputProps.className = autocompleteInputClasses.textInput;
                        return <TextField {...params}
                            className={autocompleteInputClasses.autocomplete}
                            variant="outlined"
                            autoComplete="off"
                            type={'text'}
                            style={{ width: selectedFundValue && selectedFundValue.length > 3 ? '730px' : '320px' }}
                            label='Select a fund' />;
                    }}
                />
                <Autocomplete
                    popupIcon={<ExpandMoreIcon />}
                    size={'small'}
                    id={'pcoAutocomplete'}
                    autoHighlight={true}
                    autoSelect={true}
                    autoComplete={false}
                    classes={classes}
                    multiple
                    limitTags={5}
                    sx={{ marginRight: '1em', width: selectedLPValue && selectedLPValue.length > 2 ? '730px' : '320px' }}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(e, value) => onLPChange(e, value.slice(0, 5))}
                    value={selectedLPValue ?? []}
                    options={lps ?? []}
                    getOptionLabel={(option: LP) => option ? option.shortName : ''}
                    renderInput={(params: AutocompleteRenderInputParams) => {
                        params.InputProps.className = autocompleteInputClasses.textInput;
                        return <TextField {...params}
                            className={autocompleteInputClasses.autocomplete}
                            variant="outlined"
                            autoComplete="off"
                            type={'text'}
                            style={{ width: selectedLPValue && selectedLPValue.length > 2 ? '730px' : '320px' }}
                            label='Select an LP'
                        />;
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}
                sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end', lg: 'flex-end' } }}>
                <TextField
                    className={classes.searchBox}
                    variant="outlined"
                    size="small"
                    placeholder="Search"
                    aria-label="search"
                    sx={{ marginRight: '0.5em' }}
                    value={searchTextValue}
                    onChange={onValueChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon
                            color="disabled" /></InputAdornment>,
                        endAdornment: isValueEmpty(searchTextValue) ? null :
                            <InputAdornment position="end">
                                <IconButton onClick={onCancelClick}><CloseIcon fontSize='small' /></IconButton>
                            </InputAdornment>,
                    }}
                />
                <Grid item sx={{ marginRight: '0.5em' }}>
                    <AddButton pageName='Add a PCO' />
                </Grid>
                <ExportButton pageName='lpsOverview' />
            </Grid>
        </Grid>
    );
};


export default PCOToolbar;
