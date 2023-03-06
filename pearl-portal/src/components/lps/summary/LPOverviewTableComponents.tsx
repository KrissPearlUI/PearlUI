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
import { setLPs } from '../../../redux/slices/lps/lpsSlice';
import { fetchLPs } from '../../../redux/thunks/lpThunk';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '0.2em',
            overflow:'hidden'
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
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const {lps} = useSelector((state: RootState) => state.lps);
    const [selectedFundValue, setSelectedFundValue] = useState<Fund | null>(null);
    const [gridApi, setGridApi] = useState<GridApi>();
    const [value, setValue] = useState<string>('');
    const [hasError, setHasError] = useState(false);
    const [searchText, setSearchText] = useState<string | null>(null);
    const theme = useTheme();
    const [funds,setFunds]=useState<Fund[]>([]);
    const [rowData,setRowData]=useState<LP[]>([]);

    const gridOptions: GridOptions = {
        defaultColDef: DefaultColumnDef,
        enableCellChangeFlash: true,
        enableRangeSelection: true,
        animateRows: true,
        pagination: true,
        paginationPageSize: 20,
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
                minWidth: 120,
                maxWidth: 200,
                enableRowGroup: true,
                valueGetter: (params) => {
                    return params.data?.shortName;
                },
                valueSetter: (params) => valueSetter(params, 'shortName'),
               // valueFormatter: dateValueFormatter,
                cellStyle: {color: theme.palette.text.primary}
            },
            {
                headerName: 'Name',
                field: 'name',
                suppressFiltersToolPanel: true,
                minWidth: 120,
                maxWidth: 200,
                //valueFormatter: timeValueFormatter,
                cellStyle: {color: theme.palette.text.primary}
            },
            {
                headerName: 'Headquarters',
                field:'country',
                enableRowGroup: true,
                minWidth: 160,
                maxWidth: 190,
                valueGetter: (params) => {
                    return params.data?.country ? capitalize(params.data?.country.toString()) : '';
                },
                valueSetter: (params) => valueSetter(params, 'country'),
                cellStyle: {color: theme.palette.text.primary}
            },
            {
                headerName: 'Total Commitments',
                field: 'totalCommitments',
                enableRowGroup: true,
                minWidth: 220,
                maxWidth: 230,
                cellStyle: {color: theme.palette.text.primary}
            },
            {
                headerName: 'Funds',
                field: 'funds',
                minWidth: 100,
                maxWidth: 110,
                enableRowGroup: true,
                valueGetter: (params: ValueGetterParams) => {
                    if (params?.data?.funds) {
                        return params.data.funds.length??0
                    }
                    else 
                        return 0;
                },
                cellStyle: {color: theme.palette.text.primary}
            },
            {
                headerName: 'Active PCOs',
                field: 'pcos',
                minWidth: 100,
                maxWidth: 110,
                enableRowGroup: true,
                valueGetter: (params: ValueGetterParams) => {
                    if (params?.data?.pcos) {
                        return params.data.pcos.length??0
                    }
                    else 
                        return 0;
                },
                cellStyle: {color: theme.palette.text.primary}
            },
            {
                headerName: 'Type',
                field: 'type',
                minWidth: 100,
                maxWidth: 110,
                enableRowGroup: true,
                valueGetter: (params: ValueGetterParams) => {
                    if (params.data.type) {
                        return capitalize(params?.data?.type);
                    }
                    else 
                        return '';
                },
                cellStyle: {color: theme.palette.text.primary}
            },
            {
                headerName: 'Capital Invested',
                field: 'totalInvestments',
                minWidth: 80,
                maxWidth: 90,
                type: 'numericColumn',
                enableRowGroup: true,
            },
            {
                headerName: 'Reserved',
                field: 'reservesFees',
                enableRowGroup: true,
                minWidth: 185,
                maxWidth: 190,
                filter: 'agMultiColumnFilter',
                type: 'numericColumn',
                cellStyle: {color: theme.palette.text.primary}
            },
            {
                headerName: 'Capital Distributed',
                field: 'totalDistributions',
                tooltipField: 'totalDistributions',
                type: 'numericColumn',
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
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
                enableRowGroup: true,
                cellStyle: {color: theme.palette.text.primary}
            }
        ];
    }, [theme]);


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

    useEffect(()=>{
        dispatch(fetchLPs());
    },[dispatch])

    useEffect(()=>{
        console.log(lps);
        setRowData(lps);
    },[lps])

    return (
        <Grid container className={classes.root}>
            <LPToolbar/>
            <div className={clsx(getGridTheme(isDarkTheme), classes.fill)}>
                <AgGridReact gridOptions={gridOptions}
                            columnDefs={getColumnDefs}
                            rowData={rowData}
                            onGridReady={onGridReady}
                            loadingOverlayComponentParams={loadingOverlayRendererParams}
                            loadingOverlayComponent={AGGridLoader}
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
