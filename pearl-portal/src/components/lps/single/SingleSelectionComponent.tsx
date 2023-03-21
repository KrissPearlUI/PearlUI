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

const SingleSelection = ({selectedItem,handleButtonClick}:SingleSelectionProps) => {
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
        <Grid container spacing={1} sx={{display:'flex',flex:1, justifyContent:'space-betweeen', alignItems:'flex-start', flexDirection:'row', width:'100%'}}>
        <Grid item xs={8} md={8} lg={8}>
            <ButtonGroup variant="outlined"  aria-label="outlined primary button group" sx={{height:36}}>
                <Button sx={{fontSize:12,
                backgroundColor:selectedItem==='basic'?theme.palette.primary.main:theme.palette.background.paper,
                color: selectedItem==='basic'?'white':theme.palette.primary.main}}
                onClick={() => handleButtonClick('basic')}>
                    Basic Information</Button>
                <Button sx={{fontSize:12,backgroundColor:selectedItem==='commitments'?theme.palette.primary.main:theme.palette.background.paper,
                color: selectedItem==='commitments'?'white':theme.palette.primary.main}} onClick={() => handleButtonClick('commitments')}>
                    Commitments</Button>
                <Button sx={{fontSize:12,backgroundColor:selectedItem==='coinvestments'?theme.palette.primary.main:theme.palette.background.paper,
                color: selectedItem==='coinvestments'?'white':theme.palette.primary.main}} onClick={() => handleButtonClick('coinvestments')}>
                    Co-Investments</Button>
                <Button sx={{fontSize:12,backgroundColor:selectedItem==='portfolio'?theme.palette.primary.main:theme.palette.background.paper,
                color: selectedItem==='portfolio'?'white':theme.palette.primary.main}} onClick={() => handleButtonClick('portfolio')}>
                    Portfolio</Button>
                <Button sx={{fontSize:12,backgroundColor:selectedItem==='callsDist'?theme.palette.primary.main:theme.palette.background.paper,
                color: selectedItem==='callsDist'?'white':theme.palette.primary.main}} onClick={() => handleButtonClick('callsDist')}>
                    Calls & Distributions</Button>
                <Button sx={{fontSize:12,backgroundColor:selectedItem==='transactions'?theme.palette.primary.main:theme.palette.background.paper,
                color: selectedItem==='transactions'?'white':theme.palette.primary.main}} onClick={() => handleButtonClick('transactions')}>
                    Transactions</Button>
                <Button sx={{fontSize:12,backgroundColor:selectedItem==='documents'?theme.palette.primary.main:theme.palette.background.paper,
                color: selectedItem==='documents'?'white':theme.palette.primary.main}} onClick={() => handleButtonClick('documents')}>
                    Documents</Button>
            </ButtonGroup>
        </Grid>
        <Grid item xs={4} md={4} lg={4} sx={{display:'flex', justifyContent:'flex-end',alignItems:'center',paddingRight:'0.7em'}}>
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
                   <AddButton pageName='singleLP'/>
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
                    <ExportButton pageName='singleLP'/>
                    </Grid>
                  </Grid>}
        </Grid>
    </Grid>
    );
};

export default SingleSelection;