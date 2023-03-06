import React, {useCallback, useState} from 'react';
import { useSelector} from 'react-redux';
import {Autocomplete,AutocompleteRenderInputParams,capitalize, Grid, IconButton, InputAdornment,TextField, useTheme} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import {RootState} from '../../../redux/slices/rootSlice';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {isValueEmpty} from '../../../helpers/app';
import { useAppDispatch } from '../../../redux/store';
import { Fund } from '../../../models/lps/lpModels';
import ExportButton from '../../shared/ExportButton';
import AddButton from '../../shared/AddButton';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
        },
        fill: {
            flex: 1,
            width: '100%',
            height: '100%'
        },
        searchBox: {
            width: '320px',
            marginRight: '1em'
        }
    })
);

const LPToolbar = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const [selectedFundValue, setSelectedFundValue] = useState<Fund | null>(null);
    const [value, setValue] = useState<string>('');
    const [searchText, setSearchText] = useState<string | null>(null);
    const theme = useTheme();
    const [funds,setFunds]=useState<Fund[]>([]);

    const onValueChange = (event: any) => {
        setValue(event.target.value);
        onSearchBoxChange(event.target.value);
    };

    const onCancelClick = () => {
        setValue('');
        onSearchBoxChange('');
    };

    const onFundChange = (event: any) => {
        setSelectedFundValue(event);
    };

    const onSearchBoxChange = useCallback((value: string) => {
        setSearchText(value);
    }, [selectedFundValue]);

    return (
        <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'space-between', flexDirection:'row', alignItems:'center', marginBottom: '0.5em', width:'100%', overflow:'hidden'}}>
        <Grid container item xs={12} sm={12} md={6} lg={6}
              sx={{display: 'flex'}}>
                <Autocomplete
                popupIcon={<ExpandMoreIcon/>}
                size={'small'}
                autoHighlight={true}
                autoSelect={true}
                sx={{marginRight:'1em', width:'320px'}}
                isOptionEqualToValue={(option, value) => option === value}
                onChange={(e, value: Fund | null) => onFundChange(value)}
                value={selectedFundValue ?? null}
                options={funds ?? []}
                getOptionLabel={(option: Fund) => option ? option.Name : ''}
                renderInput={(params: AutocompleteRenderInputParams) => {
                    return <TextField {...params} 
                                    variant="outlined" required
                                    placeholder='Select a fund'/>;
                }}
                />
                <Autocomplete
                popupIcon={<ExpandMoreIcon/>}
                size={'small'}
                autoHighlight={true}
                autoSelect={true}
                sx={{width:'320px'}}
                isOptionEqualToValue={(option, value) => option === value}
                onChange={(e, value: Fund | null) => onFundChange(value)}
                value={selectedFundValue ?? null}
                options={funds ?? []}
                getOptionLabel={(option: Fund) => option ? option.Name : ''}
                renderInput={(params: AutocompleteRenderInputParams) => {
                    return <TextField {...params} 
                                    variant="outlined" required
                                    placeholder='Select a PCO'/>;
                }}
                />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} justifyContent='flex-end'
              sx={{display:'flex'}}>
            <TextField
                className={classes.searchBox}
                variant="outlined"
                size="small"
                placeholder="Search"
                aria-label="search"
                sx={{marginRight:'0.5em'}}
                value={value}
                onChange={onValueChange}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon
                        color="disabled"/></InputAdornment>,
                    endAdornment: isValueEmpty(value) ? null :
                        <InputAdornment position="end">
                            <IconButton onClick={onCancelClick}><CancelIcon/></IconButton>
                        </InputAdornment>,
                }}
            />
            <Grid item sx={{marginRight:'0.5em'}}>
                 <AddButton pageName='lpsOverview'/>
            </Grid>
            <ExportButton pageName='lpsOverview'/>
        </Grid>
    </Grid>
    );
};


export default LPToolbar;
