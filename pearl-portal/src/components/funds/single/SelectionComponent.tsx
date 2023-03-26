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

const SelectionFundComponent = ({selectedItem,handleButtonClick}:SingleSelectionProps) => {
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
            <ButtonGroup variant="outlined"  aria-label="outlined primary button group" sx={{height:36}}>
                <Button sx={{fontSize: { xs: 10, md: 12, lg:12 },
                backgroundColor:selectedItem==='basic'?theme.palette.primary.main:theme.palette.background.paper,
                color: selectedItem==='basic'?'white':theme.palette.primary.main}}
                onClick={() => handleButtonClick('basic')}>
                    Basic Information</Button>
                <Button sx={{fontSize: { xs: 10, md: 12, lg:12 },backgroundColor:selectedItem==='commitments'?theme.palette.primary.main:theme.palette.background.paper,
                color: selectedItem==='commitments'?'white':theme.palette.primary.main}} onClick={() => handleButtonClick('commitments')}>
                    Commitments</Button>
                <Button sx={{fontSize: { xs: 10, md: 12, lg:12 },backgroundColor:selectedItem==='portfolio'?theme.palette.primary.main:theme.palette.background.paper,
                color: selectedItem==='portfolio'?'white':theme.palette.primary.main}} onClick={() => handleButtonClick('portfolio')}>
                    Portfolio</Button>
                <Button sx={{fontSize: { xs: 10, md: 12, lg:12 },backgroundColor:selectedItem==='callsDist'?theme.palette.primary.main:theme.palette.background.paper,
                color: selectedItem==='callsDist'?'white':theme.palette.primary.main}} onClick={() => handleButtonClick('callsDist')}>
                    Calls & Distributions</Button>
                <Button sx={{fontSize: { xs: 10, md: 12, lg:12 },backgroundColor:selectedItem==='transactions'?theme.palette.primary.main:theme.palette.background.paper,
                color: selectedItem==='transactions'?'white':theme.palette.primary.main}} onClick={() => handleButtonClick('transactions')}>
                    Transactions</Button>
                <Button sx={{fontSize: { xs: 10, md: 12, lg:12 },backgroundColor:selectedItem==='documents'?theme.palette.primary.main:theme.palette.background.paper,
                color: selectedItem==='documents'?'white':theme.palette.primary.main}} onClick={() => handleButtonClick('documents')}>
                    Documents</Button>
            </ButtonGroup>
    );
};

export default SelectionFundComponent;