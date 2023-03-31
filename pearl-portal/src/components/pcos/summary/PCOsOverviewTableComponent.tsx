import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { capitalize, Grid, useTheme } from '@mui/material';
import { RootState } from '../../../redux/slices/rootSlice';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridOptions, GridReadyEvent, ValueGetterParams } from 'ag-grid-community';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {
    DefaultColumnDef,
    DefaultSideBarDef,
    DefaultStatusPanelDef,
    getGridTheme,
    quantityValueFormatter,
} from '../../../helpers/agGrid';
import clsx from 'clsx';
import { capitalizeLetters } from '../../../helpers/app';
import { ColDef, ColGroupDef, ValueSetterParams } from 'ag-grid-community/dist/lib/entities/colDef';
import { useAppDispatch } from '../../../redux/store';
import { LP } from '../../../models/lps/lpModels';
import AGGridLoader from '../../shared/AGGridLoader';
import { fetchLPs } from '../../../redux/thunks/lpThunk';
import { FundSummary } from '../../../models/funds/fundModels';
import { fetchFunds } from '../../../redux/thunks/fundThunk';
import { PCOSummary } from '../../../models/pcos/pcoModels';
import { fetchPCOs } from '../../../redux/thunks/pcoThunk';
import PCOToolbar from './PCOToolbar';
import { setSelectedPCO } from '../../../redux/slices/pcos/pcosSlice';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '0.2em',
            overflow: 'hidden',
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

const PCOsOverviewTable = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const { lps } = useSelector((state: RootState) => state.lps);
    const { funds } = useSelector((state: RootState) => state.funds);
    const { pcos } = useSelector((state: RootState) => state.pcos);
    const [gridApi, setGridApi] = useState<GridApi>();
    const [searchText,] = useState<string | null>(null);
    const theme = useTheme();
    const [allFunds, setAllFunds] = useState<FundSummary[] | null>([]);
    const [allLPs, setAllLPs] = useState<LP[] | null>([]);
    const [rowData, setRowData] = useState<PCOSummary[]>([]);
    const [selectedFundValue, setSelectedFundValue] = useState<FundSummary | null>(null);
    const [selectedLPValue, setSelectedLPValue] = useState<LP | null>(null);
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
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
            },
            {
                headerName: 'Name',
                field: 'pcoName',
                suppressFiltersToolPanel: true,
                minWidth: 160,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
            },
            {
                headerName: 'Headquarters',
                field: 'country',
                enableRowGroup: true,
                minWidth: 110,
                maxWidth: 140,
                valueGetter: (params) => {
                    return params.data?.country ? capitalize(params.data?.country.toString()) : '';
                },
                valueSetter: (params) => valueSetter(params, 'country'),
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
            },
            {
                headerName: 'Local Currency',
                field: 'localCurrency',
                enableRowGroup: true,
                minWidth: 110,
                maxWidth: 140,
                valueGetter: (params) => {
                    return params.data?.localCurrency ? params.data?.localCurrency.toUpperCase() : '';
                },
                valueSetter: (params) => valueSetter(params, 'localCurrency'),
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
            },
            {
                headerName: 'Total Investments',
                field: 'amountInvestedLocalCcy',
                enableRowGroup: true,
                minWidth: 220,
                type: 'numericColumn',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: quantityValueFormatter,
            },
            {
                headerName: 'Funds',
                field: 'numOfFunds',
                minWidth: 90,
                maxWidth: 100,
                enableRowGroup: true,
                tooltipField: 'funds',
                tooltipComponentParams: { type: 'funds' },
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
            },
            {
                headerName: 'LPs',
                field: 'numOfLPS',
                minWidth: 100,
                maxWidth: 140,
                enableRowGroup: true,
                tooltipField: 'lps',
                tooltipComponentParams: { type: 'lps' },
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
            },
            {
                headerName: 'Status',
                field: 'status',
                valueGetter: (params: ValueGetterParams) => {
                    return params?.data?.status ? capitalizeLetters(params.data.status) : '';
                },
                suppressFiltersToolPanel: true,
                minWidth: 110,
                maxWidth: 130,
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
            }
        ];
    }, [theme]);

    const onValueChange = useCallback((event: any) => {
        setSearchTextValue(event.target.value)
        if (gridApi) {
            gridApi.setQuickFilter(event.target.value);
        }
    }, [gridApi]);

    const onCancelClick = useCallback(() => {
        setSearchTextValue('');
        if (gridApi) {
            gridApi.setQuickFilter('');
        }
    }, [gridApi]);

    const onFundChange = (event: any) => {
        setSelectedFundValue(event);
        let result = pcos;
        if (event) {
            result = pcos
                .map(item => ({
                    ...item,
                    funds: item.funds?.filter(child => child.id === event.id) ?? []
                }))
                .filter(item => item?.funds?.length > 0);

            if (selectedLPValue && !searchTextValue) {
                result = result.map(item => ({
                    ...item,
                    lps: item.lps?.filter(child => child.id === selectedLPValue.id) ?? []
                }))
                    .filter(item => item?.lps?.length > 0);
            } else if (searchTextValue && !selectedLPValue) {
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            } else if (selectedLPValue && searchTextValue) {
                result = result.map(item => ({
                    ...item,
                    lps: item.lps?.filter(child => child.id === selectedLPValue.id) ?? []
                }))
                    .filter(item => item?.lps?.length > 0);
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            }
            else {
                setRowData(result);
            }
        } else {
            setRowData(result);
        }
    };

    const onLPChange = (event: any) => {
        setSelectedLPValue(event);
        let result = pcos;
        if (event) {
            result = pcos
                .map(item => ({
                    ...item,
                    lps: item.lps?.filter(child => child.id === event.id) ?? []
                }))
                .filter(item => item?.lps?.length > 0);

            if (selectedFundValue && !searchTextValue) {
                result = result.map(item => ({
                    ...item,
                    funds: item.funds?.filter(child => child.id === selectedFundValue.id) ?? []
                }))
                    .filter(item => item?.funds?.length > 0);
            } else if (searchTextValue && !selectedFundValue) {
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            } else if (selectedFundValue && searchTextValue) {
                result = result.map(item => ({
                    ...item,
                    funds: item.funds?.filter(child => child.id === selectedFundValue.id) ?? []
                }))
                    .filter(item => item?.funds?.length > 0);
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            }
            else {
                setRowData(result);
            }
        } else {
            setRowData(result);
        }
    };

    const onGridReady = (params: GridReadyEvent) => {
        setGridApi(params?.api);
    };

    const valueSetter = (params: ValueSetterParams, field: string) => {
        const value = params.newValue;
        const data = params.data;
        if (data[field] !== value) {
            data[field] = value;
            return true;
        } else {
            return false;
        }
    };

    const loadingOverlayRendererParams = useMemo(() => {
        return {
            loadingMessage: 'Loading PCOs Overview...',
        };
    }, []);


    function handleRowClick(event: any) {
        const rowData = event.data;
        if (rowData) {
            dispatch(setSelectedPCO(rowData));
        }
        // Assuming you have a unique ID for each row, you can use it to construct the URL for the other page
        const otherPageUrl = `/pcosOverview/singlePCO`;
        navigate(otherPageUrl);
    }
    
    useEffect(() => {
        dispatch(fetchLPs());
        dispatch(fetchFunds());
        dispatch(fetchPCOs());
    }, [dispatch])

    useEffect(() => {
        console.log(pcos);
        setRowData(pcos);
    }, [pcos])

    useEffect(() => {
        console.log(funds);
        setAllFunds(funds);
    }, [funds])

    useEffect(() => {
        console.log(lps);
        setAllLPs(lps);
    }, [lps])

    return (
        <Grid container className={classes.root}>
            <PCOToolbar searchText={searchText}
                funds={allFunds}
                lps={allLPs}
                selectedFundValue={selectedFundValue}
                selectedLPValue={selectedLPValue}
                searchTextValue={searchTextValue}
                onValueChange={onValueChange}
                onCancelClick={onCancelClick}
                onFundChange={onFundChange}
                onLPChange={onLPChange}
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


export default PCOsOverviewTable;
