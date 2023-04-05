import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, useTheme } from '@mui/material';
import { RootState } from '../../../redux/slices/rootSlice';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {
    dateValueFormatter,
    DefaultColumnDef,
    DefaultSideBarDef,
    DefaultStatusPanelDef,
    getGridTheme,
    quantityValueFormatter,
} from '../../../helpers/agGrid';
import clsx from 'clsx';
import { ColDef, ColGroupDef, ValueSetterParams } from 'ag-grid-community/dist/lib/entities/colDef';
import { useAppDispatch } from '../../../redux/store';
import { LP } from '../../../models/lps/lpModels';
import AGGridLoader from '../../shared/AGGridLoader';
import { fetchLPs } from '../../../redux/thunks/lpThunk';
import { FundSummary } from '../../../models/funds/fundModels';
import { fetchFunds } from '../../../redux/thunks/fundThunk';
import { PCOSummary } from '../../../models/pcos/pcoModels';
import { fetchPCOs } from '../../../redux/thunks/pcoThunk';
import FundsToolbar from './FundsToolbar';
import { useNavigate } from 'react-router-dom';
import { setSelectedFund } from '../../../redux/slices/funds/fundsSlice';

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

const FundsOverviewTable = () => {
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
    const [allLPs, setAllLPs] = useState<LP[] | null>([]);
    const [allPCOs, setAllPCOs] = useState<PCOSummary[] | null>([]);
    const [rowData, setRowData] = useState<FundSummary[]>([]);
    const [selectedLPValue, setSelectedLPValue] = useState<LP | null>(null);
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
                headerName: 'Id',
                field: 'id',
                minWidth: 90,
                maxWidth: 100,
                enableRowGroup: true,
                valueGetter: (params) => {
                    return params.data?.id;
                },
                valueSetter: (params) => valueSetter(params, 'id'),
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
            },
            {
                headerName: 'Short',
                field: 'shortName',
                minWidth: 100,
                maxWidth: 150,
                enableRowGroup: true,
                valueGetter: (params) => {
                    return params.data?.shortName;
                },
                valueSetter: (params) => valueSetter(params, 'shortName'),
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
            },
            {
                headerName: 'Name',
                field: 'fundName',
                suppressFiltersToolPanel: true,
                minWidth: 200,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
            },
            {
                headerName: 'Currency',
                field: 'currency',
                enableRowGroup: true,
                minWidth: 80,
                valueGetter: (params) => {
                    return params.data?.currency ? params.data?.currency.toUpperCase() : '';
                },
                valueSetter: (params) => valueSetter(params, 'currency'),
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
            },
            {
                headerName: 'Vintage',
                field: 'vintage',
                minWidth: 100,
                maxWidth: 150,
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                valueFormatter: dateValueFormatter,
            },
            {
                headerName: 'Commited Capital',
                field: 'totalCommitmentsFundCcy',
                enableRowGroup: true,
                minWidth: 220,
                type: 'numericColumn',
                filter: 'agNumberColumnFilter',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                valueFormatter: quantityValueFormatter,
            },
            {
                headerName: 'LPs',
                field: 'numOfLPs',
                minWidth: 90,
                maxWidth: 100,
                enableRowGroup: true,
                tooltipField: 'lps',
                tooltipComponentParams: { type: 'lps' },
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
            },
            {
                headerName: 'Active PCOs',
                field: 'numOFPCOs',
                minWidth: 100,
                maxWidth: 140,
                tooltipField: 'pcos',
                tooltipComponentParams: { type: 'pcos' },
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
            },
            {
                headerName: 'Domicile',
                field: 'domicile',
                suppressFiltersToolPanel: true,
                minWidth: 110,
                maxWidth: 130,
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
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

    const onLPChange = (event: any) => {
        setSelectedLPValue(event);
        let result = funds;
        if (event) {
            result = funds
                .map(item => ({
                    ...item,
                    lps: item.lps?.filter(child => child.id === event.id) ?? []
                }))
                .filter(item => item?.lps?.length > 0);

            if (selectedPCOValue && !searchTextValue) {
                result = result.map(item => ({
                    ...item,
                    pcos: item.pcos?.filter(child => child.id === selectedPCOValue.id) ?? []
                }))
                    .filter(item => item?.pcos?.length > 0);
                setRowData(result);
            } else if (searchTextValue && !selectedPCOValue) {
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            } else if (selectedPCOValue && searchTextValue) {
                result = result.map(item => ({
                    ...item,
                    pcos: item.pcos?.filter(child => child.id === selectedPCOValue.id) ?? []
                }))
                    .filter(item => item?.pcos?.length > 0);
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            }
            else {
                setRowData(result);
            }
        } else {
            if (selectedPCOValue && !searchTextValue) {
                result = funds.map(item => ({
                    ...item,
                    pcos: item.pcos?.filter(child => child.id === selectedPCOValue.id) ?? []
                }))
                    .filter(item => item?.pcos?.length > 0);
                setRowData(result);
            } else if (searchTextValue && !selectedPCOValue) {
                setRowData(funds);
                gridApi?.setQuickFilter(searchTextValue);
            } else if (selectedPCOValue && searchTextValue) {
                result = funds.map(item => ({
                    ...item,
                    pcos: item.pcos?.filter(child => child.id === selectedPCOValue.id) ?? []
                }))
                    .filter(item => item?.pcos?.length > 0);
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            }
            else {
                setRowData(funds);
            }
        }
    };

    const onPCOChange = (event: any) => {
        setSelectedPCOValue(event);
        let result = funds;
        if (event) {
            result = funds
                .map(item => ({
                    ...item,
                    pcos: item.pcos?.filter(child => child.id === event.id) ?? []
                }))
                .filter(item => item?.pcos?.length > 0);

            if (selectedLPValue && !searchTextValue) {
                result = result.map(item => ({
                    ...item,
                    lps: item.lps?.filter(child => child.id === selectedLPValue.id) ?? []
                }))
                    .filter(item => item?.lps?.length > 0);
                    setRowData(result);
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
            if (selectedLPValue && !searchTextValue) {
                result = funds.map(item => ({
                    ...item,
                    lps: item.lps?.filter(child => child.id === selectedLPValue.id) ?? []
                }))
                    .filter(item => item?.lps?.length > 0);
                    setRowData(result);
            } else if (searchTextValue && !selectedLPValue) {
                setRowData(funds);
                gridApi?.setQuickFilter(searchTextValue);
            } else if (selectedLPValue && searchTextValue) {
                result = funds.map(item => ({
                    ...item,
                    lps: item.lps?.filter(child => child.id === selectedLPValue.id) ?? []
                }))
                    .filter(item => item?.lps?.length > 0);
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            }
            else {
                setRowData(funds);
            }
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
            loadingMessage: 'Loading Funds Overview...',
        };
    }, []);

    function handleRowClick(event: any) {
        const rowData = event.data;
        if (rowData) {
            dispatch(setSelectedFund(rowData));
        }
        // Assuming you have a unique ID for each row, you can use it to construct the URL for the other page
        const otherPageUrl = `/fundsOverview/singleFund`;
        navigate(otherPageUrl);
    }

    useEffect(() => {
        dispatch(fetchLPs());
        dispatch(fetchFunds());
        dispatch(fetchPCOs());
    }, [dispatch])

    useEffect(() => {
        console.log(funds);
        setRowData(funds);
    }, [funds])

    useEffect(() => {
        console.log(lps);
        setAllLPs(lps);
    }, [lps])

    useEffect(() => {
        console.log(pcos);
        setAllPCOs(pcos);
    }, [pcos])

    return (
        <Grid container className={classes.root}>
            <FundsToolbar searchText={searchText}
                lps={allLPs}
                pcos={allPCOs}
                selectedLPValue={selectedLPValue}
                selectedPCOValue={selectedPCOValue}
                searchTextValue={searchTextValue}
                onValueChange={onValueChange}
                onCancelClick={onCancelClick}
                onLPChange={onLPChange}
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


export default FundsOverviewTable;
