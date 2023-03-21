import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { useSelector} from 'react-redux';
import {Alert,Autocomplete,AutocompleteRenderInputParams,capitalize, Grid, IconButton, InputAdornment, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, useTheme} from '@mui/material';
import {AgGridReact} from 'ag-grid-react';
import {GridApi, GridOptions, GridReadyEvent, ICellRendererParams, ValueGetterParams} from 'ag-grid-community';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import {ColDef, ColGroupDef, ValueSetterParams} from 'ag-grid-community/dist/lib/entities/colDef';
import { useAppDispatch } from '../../../../redux/store';
import { RootState } from '../../../../redux/slices/rootSlice';
import { CommitmentBasic, Fund, LP, PCO } from '../../../../models/lps/lpModels';
import { FundSummary } from '../../../../models/funds/fundModels';
import { dateValueFormatter, DefaultSideBarDef, getGridTheme, DefaultColumnDef,DefaultStatusPanelDef, quantityValueFormatter, percentageyValueFormatter } from '../../../../helpers/agGrid';
import AGGridLoader from '../../../shared/AGGridLoader';
import { PCOSummary } from '../../../../models/pcos/pcoModels';
import { fetchCashCalls } from '../../../../redux/thunks/cashCallsThunk';
import { ContractDocument } from '../../../../models/documents/documentsModels';


const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flex: 1,
            height:'100%',
            overflow:'hidden',
        },
        fill: {
            flex: 1,
            width: '100%',
            height: '100%',
            paddingRight:'0.7em',
        }
    })
);

const CompaniesTable = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const {lps,selectedLP} = useSelector((state: RootState) => state.lps);
    const {funds} = useSelector((state: RootState) => state.funds);
    const [gridApi, setGridApi] = useState<GridApi>();
    const [value, setValue] = useState<string>('');
    const [hasError, setHasError] = useState(false);
    const [searchText, setSearchText] = useState<string | null>(null);
    const theme = useTheme();
    const [rowData,setRowData]=useState<ContractDocument[]>([]);
    const [selectedLPValue, setSelectedLPValue] = useState<LP | null>(null);
    const [selectedPCOValue, setSelectedPCOValue] = useState<PCOSummary | null>(null);
    const [searchTextValue, setSearchTextValue] = useState<string | null>(null);

      useEffect(()=>{
        dispatch(fetchCashCalls());
    },[dispatch])

    useEffect(()=>{
        setRowData([]);
    },[selectedLP])

    return (
        <Paper sx={{flex:1, display:'flex', height:'100%'}}>
            <TableContainer component={Paper} sx={{ minWidth:700, height:'100%', flex:1, minHeight:'32em'}}>
                    <Table stickyHeader aria-label="customized table">
                        <TableHead>
                        <TableRow>
                            <TableCell sx={{backgroundColor: theme.palette.mode==='light'? theme.palette.grey[400] : theme.palette.grey[800],
                            fontFamily:'Raleway',
                            color: theme.palette.text.primary,
                            width:'30%'}} align="left">Company</TableCell>
                            <TableCell sx={{backgroundColor: theme.palette.mode==='light'? theme.palette.grey[400] : theme.palette.grey[800],
                            fontFamily:'Raleway',
                            color: theme.palette.text.primary,
                            width:'50%'}} align="left">Document Name</TableCell>
                            <TableCell sx={{backgroundColor: theme.palette.mode==='light'? theme.palette.grey[400] : theme.palette.grey[800],
                            fontFamily:'Raleway',
                            color: theme.palette.text.primary,
                            width:'20%'}} align="left">Date</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {rowData.map((row) => (
                            <TableRow key={`${row.shortDocumentName}-${row.documentName}`}>
                            <TableCell align="left">
                                {row.shortDocumentName}
                            </TableCell>
                            <TableCell align="left">{row.documentName}</TableCell>
                            <TableCell align="left">{row.date}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
        </Paper>
            
    );
};


export default CompaniesTable;
