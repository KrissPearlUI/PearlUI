import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { useSelector} from 'react-redux';
import {Alert,Autocomplete,AutocompleteRenderInputParams,capitalize, Grid, IconButton, InputAdornment, Paper, Snackbar, TextField, useTheme} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import {RootState} from '../../../redux/slices/rootSlice';
import {AgGridReact} from 'ag-grid-react';
import {GridApi, GridOptions, GridReadyEvent, ICellRendererParams, ValueGetterParams} from 'ag-grid-community';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    dateValueFormatter,
    DefaultColumnDef,
    DefaultSideBarDef,
    DefaultStatusPanelDef,
    getGridTheme,
    guidValueFormatter,
    priceValueFormatter,
    quantityValueFormatter,
    timeValueFormatter,
} from '../../../helpers/agGrid';
import clsx from 'clsx';
import {amountValueFormatter, amountValueGetter, capitalizeLetters, isValueEmpty} from '../../../helpers/app';
import {ColDef, ColGroupDef, ValueSetterParams} from 'ag-grid-community/dist/lib/entities/colDef';
import { useAppDispatch } from '../../../redux/store';
import { Fund, LP } from '../../../models/lps/lpModels';
import AGGridLoader from '../../shared/AGGridLoader';
import ExportButton from '../../shared/ExportButton';
import LPToolbar from './LPToolbar';
import { setLPs, setSelectedLP } from '../../../redux/slices/lps/lpsSlice';
import { fetchLPs } from '../../../redux/thunks/lpThunk';
import { FundSummary } from '../../../models/funds/fundModels';
import { fetchFunds } from '../../../redux/thunks/fundThunk';
import { PCOSummary } from '../../../models/pcos/pcoModels';
import { fetchPCOs } from '../../../redux/thunks/pcoThunk';
import CustomTooltip from '../../cellRenderers/CustomTooltipCellRenderer';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '0.2em',
            overflow:'hidden',
        },
        fill: {
            flex: 1,
            width: '100%',
            height: '100%'
        },
        searchBox: {
            width: '40%',
            marginRight: '1em'
        },
        buttons: {
            marginLeft: 5
        }
    })
);

const LPOverviewTable = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const {lps} = useSelector((state: RootState) => state.lps);
    const {funds} = useSelector((state: RootState) => state.funds);
    const {pcos} = useSelector((state: RootState) => state.pcos);
    const [gridApi, setGridApi] = useState<GridApi>();
    const [value, setValue] = useState<string>('');
    const [hasError, setHasError] = useState(false);
    const [searchText, setSearchText] = useState<string | null>(null);
    const theme = useTheme();
    const [allFunds,setAllFunds]=useState<FundSummary[]|null>([]);
    const [allPCOs,setAllPCOs]=useState<PCOSummary[]|null>([]);
    const [rowData,setRowData]=useState<LP[]>([]);
    const [selectedFundValue, setSelectedFundValue] = useState<FundSummary | null>(null);
    const [selectedPCOValue, setSelectedPCOValue] = useState<PCOSummary | null>(null);
    const [searchTextValue, setSearchTextValue] = useState<string | null>(null);

    const gridOptions: GridOptions = {
        defaultColDef: DefaultColumnDef,
        enableCellChangeFlash: true,
        enableRangeSelection: true,
        animateRows: true,
        pagination: true,
        enableCellTextSelection: true,
        groupDisplayType: 'multipleColumns',
        sideBar: DefaultSideBarDef,
        statusBar: DefaultStatusPanelDef,
    };

    const getColumnDefs = useMemo((): (ColDef | ColGroupDef)[] => {
        return [
            {
                headerName: 'Short',
                field: 'shortName',
                minWidth: 115,
                enableRowGroup: true,
                valueGetter: (params) => {
                    return params.data?.shortName;
                },
                valueSetter: (params) => valueSetter(params, 'shortName'),
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary, cursor:'pointer'},
            },
            {
                headerName: 'Name',
                field: 'name',
                suppressFiltersToolPanel: true,
                minWidth: 120,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary,cursor:'pointer'},
            },
            {
                headerName: 'Headquarters',
                field:'country',
                enableRowGroup: true,
                minWidth: 110,
                maxWidth:140,
                valueGetter: (params) => {
                    return params.data?.country ? capitalize(params.data?.country.toString()) : '';
                },
                valueSetter: (params) => valueSetter(params, 'country'),
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary,cursor:'pointer'},
            },
            {
                headerName: 'Total Commitments',
                field: 'totalCommitments',
                enableRowGroup: true,
                minWidth: 220,
                type: 'numericColumn',
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary,cursor:'pointer'},
                valueFormatter: quantityValueFormatter,
            },
            {
                headerName: 'Funds',
                field: 'funds',
                minWidth: 90,
                maxWidth:100,
                tooltipField: 'funds',
                tooltipComponentParams: {type: 'funds'},
                enableRowGroup: true,
                valueGetter: (params: ValueGetterParams) => {
                    if (params?.data?.funds) {
                        return params.data.funds.length??0
                    }
                    else 
                        return 0;
                },
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary,cursor:'pointer'},
            },
            {
                headerName: 'Active PCOs',
                field: 'pcos',
                minWidth: 100,
                maxWidth:140,
                tooltipField: 'pcos',
                tooltipComponentParams: {type: 'pcos'},
                enableRowGroup: true,
                valueGetter: (params: ValueGetterParams) => {
                    if (params?.data?.pcos) {
                        return params.data.pcos.length??0
                    }
                    else 
                        return 0;
                },
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary,cursor:'pointer'},
            },
             {
                headerName: 'Type',
                field: 'type',
                minWidth: 100,
                maxWidth:150,
                enableRowGroup: true,
                valueGetter: (params: ValueGetterParams) => {
                    if (params.data.type) {
                        return capitalize(params?.data?.type);
                    }
                    else 
                        return '';
                },
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary,cursor:'pointer'},
            }, 
            {
                headerName: 'Capital Invested',
                field: 'totalInvestments',
                minWidth: 80,
                type: 'numericColumn',
                enableRowGroup: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary,cursor:'pointer'},
                valueFormatter: quantityValueFormatter,
            },
            {
                headerName: 'Reserved',
                field: 'reservesFees',
                enableRowGroup: true,
                minWidth: 185,
                filter: 'agMultiColumnFilter',
                type: 'numericColumn',
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary,cursor:'pointer'},
                valueFormatter: quantityValueFormatter,
            },
            {
                headerName: 'Capital Distributed',
                field: 'totalDistributions',
                tooltipField: 'totalDistributions',
                type: 'numericColumn',
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary,cursor:'pointer'},
                suppressFiltersToolPanel: true,
                minWidth: 80,
                valueFormatter: quantityValueFormatter,
            },
            {
                headerName: 'Tapped Out',
                field: 'tappedOot',
                valueGetter:(params:ValueGetterParams)=>{
                    return params?.data?.tappedOot ? 'Yes':'No'
                },
                suppressFiltersToolPanel: true,
                minWidth: 110,
                maxWidth: 130,
                enableRowGroup: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary,cursor:'pointer'},
            }
        ];
    }, [theme]);

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

    const onFundChange = (event: any) => {
        setSelectedFundValue(event);
        let result=lps;
        if(event){
            result = lps
            .map(item => ({
                ...item,
                funds: item.funds?.filter(child => child.id===event.id)??[]
            }))
            .filter(item => item?.funds?.length > 0);

            if(selectedPCOValue && !searchTextValue){
                result=result.map(item => ({
                    ...item,
                    pcos: item.pcos?.filter(child => child.id===selectedPCOValue.id)??[]
                    }))
                    .filter(item => item?.pcos?.length > 0);
            } else if(searchTextValue&&!selectedPCOValue){
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            } else if(selectedPCOValue && searchTextValue){
                result=result.map(item => ({
                    ...item,
                    pcos: item.pcos?.filter(child => child.id===selectedPCOValue.id)??[]
                    }))
                    .filter(item => item?.pcos?.length > 0);
                    setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            }
            else{
                setRowData(result);
            }
        } else{
            setRowData(result);
        }
    };

    const onPCOChange=(event:any)=>{
        setSelectedPCOValue(event);
        let result = lps;
        if(event){
            result=result.map(item => ({
                ...item,
                pcos: item.pcos?.filter(child => child.id===event.id)??[]
            }))
            .filter(item => item?.pcos?.length > 0);

            if(selectedFundValue && !searchTextValue){
                result=result.map(item => ({
                    ...item,
                    funds: item.funds?.filter(child => child.id===selectedFundValue.id)??[]
                    }))
                    .filter(item => item?.funds?.length > 0);
            } else if(searchTextValue&&!selectedFundValue){
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            } else if(selectedFundValue && searchTextValue){
                result=result.map(item => ({
                    ...item,
                    funds: item.funds?.filter(child => child.id===selectedFundValue.id)??[]
                    }))
                    .filter(item => item?.funds?.length > 0);
                    setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            }
            else{
                setRowData(result);
            }
        } else{
            setRowData(result);
        }
    };

    const onGridReady = (params:GridReadyEvent) => {
        setGridApi(params?.api);
    };

    const valueSetter = (params:ValueSetterParams, field:string) => {
        const value = params.newValue;
        const data = params.data;
        if (data[field] !== value) {
            data[field] = value;
            return true;
        } else {
            return false;
        }
    };

    const handleClose = () => {
        setHasError(false);
    };

    const loadingOverlayRendererParams = useMemo(() => {
        return {
            loadingMessage: 'Loading LPs Overview...',
        };
    }, []);

    function handleRowClick(event:any) {
        const rowData = event.data;
        if(rowData){
            dispatch(setSelectedLP(rowData));
        }
        // Assuming you have a unique ID for each row, you can use it to construct the URL for the other page
        const otherPageUrl = `/lpsOverview/singleLP`;
        navigate(otherPageUrl);
      }

   /*  const autoGroupColumnDef = useMemo<ColDef>(() => {
        return {
          minWidth: 300,
          cellRendererParams: {
            footerValueGetter: (params: any) => {
              const isRootLevel = params.node.level === -1;
              if (isRootLevel) {
                return 'Total';
              }
              else
               return `Sub Total (${params.value})`;
            },
          },
        };
      }, []);

      const createData: (count: number, gridApi:GridApi|null) => any[] = (
        count: number,
      ) => {
        var result: any[] = [];
        for (var i = 0; i < count; i++) {
          result.push({
            short: 'Total',
            name: gridApi?gridApi.paginationGetRowCount():0,
            totalCommitments: count,
            totalInvestments:count,
            reservesFees:count,
          });
        }
        return result;
      };

      const pinnedBottomRowData = useMemo<any[]>(() => {
        return createData(1, gridApi??null);
      }, [gridApi]);
 */
    useEffect(()=>{
        dispatch(fetchLPs());
        dispatch(fetchFunds());
        dispatch(fetchPCOs());
    },[dispatch])

    useEffect(()=>{
        console.log(lps);
        if(lps && lps.length>0){
            setRowData(lps.slice().sort(function (a, b) {
                if (a.id?.toLowerCase() < b.id?.toLowerCase()) return -1;
                if (a.id?.toLowerCase() > b.id?.toLowerCase()) return 1;
                return 0;
            }));

            const test = lps.slice().sort(function (a, b) {
                if (a.id?.toLowerCase() < b.id?.toLowerCase()) return -1;
                if (a.id?.toLowerCase() > b.id?.toLowerCase()) return 1;
                return 0;
            });
            console.log(test);
        }
    },[lps])

     useEffect(()=>{
        console.log(funds);
        setAllFunds(funds);
    },[funds]) 

    useEffect(()=>{
        console.log(pcos);
        setAllPCOs(pcos);
    },[pcos]) 

    return (
        <Grid container className={classes.root}>
            <LPToolbar searchText={searchText}
            funds={allFunds}
            pcos={allPCOs}
            selectedFundValue={selectedFundValue}
            selectedPCOValue={selectedPCOValue}
            searchTextValue={searchTextValue}
            onValueChange={onValueChange}
            onCancelClick={onCancelClick}
            onFundChange={onFundChange}
            onPCOChange={onPCOChange}
            />
            <div className={clsx(getGridTheme(isDarkTheme), classes.fill)}>
                <AgGridReact gridOptions={gridOptions}
                            columnDefs={getColumnDefs}
                            rowData={rowData}
                            onGridReady={onGridReady}
                            loadingOverlayComponentParams={loadingOverlayRendererParams}
                            loadingOverlayComponent={AGGridLoader}
                            tooltipShowDelay={0}
                            tooltipHideDelay={10000}
                            onRowClicked={handleRowClick}
                            />
            </div>
                {/* {downloadPDFErrorMessage && downloadPDFErrorMessage.length > 0 &&
                    <div>
                        <Snackbar open={hasError} autoHideDuration={1500} onClose={handleClose}
                                anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                            <Alert onClose={handleClose} severity="error">
                                {downloadPDFErrorMessage}
                            </Alert>
                        </Snackbar>
                    </div>
                } */}
        </Grid>
    );
};


export default LPOverviewTable;
