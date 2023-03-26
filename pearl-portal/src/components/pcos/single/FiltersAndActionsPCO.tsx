import {Box, Button, ButtonGroup, Fab, Grid,IconButton,InputAdornment,Paper,TextField,Typography} from '@mui/material';
import {darken, useTheme} from "@mui/material/styles";
import { useCallback, useEffect, useState } from 'react';
import { setTopBarTitle } from '../../../redux/slices/appSlice';
import { useAppDispatch } from '../../../redux/store';
import {Theme} from "@mui/material";
import {createStyles,makeStyles} from '@mui/styles';
import LPChartComponent from '../../landing/LPChart';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { GridApi } from 'ag-grid-community';
import { isValueEmpty } from '../../../helpers/app';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AddButton from '../../shared/AddButton';
import ExportButton from '../../shared/ExportButton';

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
            width: '320px',
            marginRight: '1em',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontFamily: 'Raleway',
            borderRadius: 5,
        },
    }),
);

interface SingleSelectionProps {
    selectedItem:string
    handleButtonClick:any
}

const FiltersAndActionsPCOComponent = ({selectedItem,handleButtonClick}:SingleSelectionProps) => {
    const classes=useStyles();
    const theme=useTheme();
    const dispatch = useAppDispatch();
    const [searchText, setSearchText] = useState<string | null>(null);
    const [searchTextValue, setSearchTextValue] = useState<string | null>(null);
    const [gridApi, setGridApi] = useState<GridApi>();

    const onValueChange =  useCallback((event: any) => {
        setSearchTextValue(event.target.value)
        if(gridApi){
            gridApi.setQuickFilter(event.target.value);
        }
    },[gridApi]);

    const onCancelClick = useCallback(() => {
        setSearchTextValue('');
        if(gridApi){
            gridApi.setQuickFilter('');
        }
    },[gridApi]);

    return (
       <>
            {selectedItem==='basic'?<Fab
                    color={'primary'}
                    size="small"
                    sx={{boxShadow:'none', alignSelf:'end'}}
                    aria-label="editBtn" 
                    onFocus={(e: any) => (e.target.blur())}                            
                    className={classes.fabIcon}>
                <EditRoundedIcon />
                </Fab>
                : <Grid container>
                    <Grid item>
                    <TextField
                        className={classes.searchBox}
                        variant="outlined"
                        size="small"
                        placeholder="Search"
                        aria-label="search"
                        sx={{marginRight:'0.5em'}}
                        value={searchTextValue}
                        onChange={onValueChange}
                        inputProps={{
                            style: {height:'1.5em'},
                        }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon
                                color="disabled"/></InputAdornment>,
                            endAdornment: isValueEmpty(searchTextValue) ? null :
                                <InputAdornment position="end">
                                    <IconButton onClick={onCancelClick}><CloseIcon fontSize='small'/></IconButton>
                                </InputAdornment>,
                        }}
                    />
                    </Grid>
                    <Grid item sx={{marginRight:'0.5em'}} >
                   <AddButton pageName='singleFund'/>
                    </Grid>
                    <Grid item sx={{marginRight:'0.5em'}} >
                    <Fab
                        color={'primary'}
                        size="small"
                        sx={{boxShadow:'none', alignSelf:'end'}}
                        aria-label="editBtn" 
                        onFocus={(e: any) => (e.target.blur())}                            
                        className={classes.fabIcon}>
                    <EditRoundedIcon />
                    </Fab>
                    </Grid>
                    <Grid item >
                    <ExportButton pageName='singleFund'/>
                    </Grid>
                  </Grid>}
        </>
    );
};

export default FiltersAndActionsPCOComponent;