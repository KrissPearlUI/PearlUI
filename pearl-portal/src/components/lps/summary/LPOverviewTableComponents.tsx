import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { capitalize, Grid, useTheme } from '@mui/material';
import { RootState } from '../../../redux/slices/rootSlice';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridOptions, GridReadyEvent, ISetFilterParams, ValueGetterParams } from 'ag-grid-community';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {
    DefaultColumnDef,
    DefaultSideBarDef,
    DefaultStatusPanelDef,
    filterParams,
    getGridTheme,
    quantityValueFormatter
} from '../../../helpers/agGrid';
import clsx from 'clsx';
import { ColDef, ColGroupDef, ValueSetterParams } from 'ag-grid-community/dist/lib/entities/colDef';
import { useAppDispatch } from '../../../redux/store';
import { LP } from '../../../models/lps/lpModels';
import AGGridLoader from '../../shared/AGGridLoader';
import LPToolbar from './LPToolbar';
import { setSelectedLP } from '../../../redux/slices/lps/lpsSlice';
import { fetchLPs } from '../../../redux/thunks/lpThunk';
import { FundSummary } from '../../../models/funds/fundModels';
import { fetchFunds } from '../../../redux/thunks/fundThunk';
import { PCOSummary } from '../../../models/pcos/pcoModels';
import { fetchPCOs } from '../../../redux/thunks/pcoThunk';
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

const LPOverviewTable = () => {
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
    const [allPCOs, setAllPCOs] = useState<PCOSummary[] | null>([]);
    const [rowData, setRowData] = useState<LP[]>([]);
    const [selectedFundValues, setSelectedFundValues] = useState<FundSummary[] | null>([]);
    const [selectedPCOValues, setSelectedPCOValues] = useState<PCOSummary[] | null>([]);
    const [searchTextValue, setSearchTextValue] = useState<string | null>(null);

    const gridOptions: GridOptions = {
        defaultColDef: DefaultColumnDef,
        enableCellChangeFlash: true,
        enableRangeSelection: true,
        animateRows: true,
        pagination: false,
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
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
            },
            {
                headerName: 'Name',
                field: 'name',
                suppressFiltersToolPanel: true,
                minWidth: 120,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
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
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
            },
            {
                headerName: 'Commited Capital',
                field: 'totalCommitments',
                enableRowGroup: true,
                minWidth: 220,
                filter: 'agNumberColumnFilter',
                type: 'numericColumn',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                valueFormatter: quantityValueFormatter,
            },
            {
                headerName: 'Funds',
                field: 'funds',
                minWidth: 90,
                maxWidth: 100,
                tooltipField: 'funds',
                tooltipComponentParams: { type: 'funds' },
                enableRowGroup: true,
                valueGetter: (params: ValueGetterParams) => {
                    if (params?.data?.funds) {
                        return params.data.funds.length ?? 0
                    }
                    else
                        return 0;
                },
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                filterParams: filterParams,
            },
            {
                headerName: 'Active PCOs',
                field: 'pcos',
                minWidth: 100,
                maxWidth: 140,
                tooltipField: 'pcos',
                tooltipComponentParams: { type: 'pcos' },
                enableRowGroup: true,
                valueGetter: (params: ValueGetterParams) => {
                    if (params?.data?.pcos) {
                        return params.data.pcos.length ?? 0
                    }
                    else
                        return 0;
                },
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                filterParams: filterParams,
            },
            {
                headerName: 'Type',
                field: 'type',
                minWidth: 100,
                maxWidth: 150,
                enableRowGroup: true,
                valueGetter: (params: ValueGetterParams) => {
                    if (params.data.type) {
                        return capitalize(params?.data?.type);
                    }
                    else
                        return '';
                },
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
            },
            {
                headerName: 'Capital Invested',
                field: 'totalInvestments',
                minWidth: 80,
                type: 'numericColumn',
                filter: 'agNumberColumnFilter',
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                valueFormatter: quantityValueFormatter,
            },
            {
                headerName: 'Reserved',
                field: 'reservesFees',
                enableRowGroup: true,
                minWidth: 185,
                filter: 'agNumberColumnFilter',
                type: 'numericColumn',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                valueFormatter: quantityValueFormatter,
            },
            {
                headerName: 'Capital Distributed',
                field: 'totalDistributions',
                filter: 'agNumberColumnFilter',
                tooltipField: 'totalDistributions',
                type: 'numericColumn',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                suppressFiltersToolPanel: true,
                minWidth: 80,
                valueFormatter: quantityValueFormatter,
            },
            {
                headerName: 'Tapped Out',
                field: 'tappedOot',
                valueGetter: (params: ValueGetterParams) => {
                    return params?.data?.tappedOot ? 'Yes' : 'No'
                },
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

    const onFundChange = (event: FundSummary[] | null) => {
        setSelectedFundValues(event);
        let result = lps;
        if (event && event.length > 0) {
            result = lps.filter(item1 =>
                item1?.funds?.some(item2 => event.some(val => val.id === item2.id))
            );
            /*  result = result
                 .map(item => ({
                     ...item,
                     funds: lps.filter(item1 =>
                         item1?.funds?.some(item2 => event.some(val => val.id === item2.id)))
                 }))
                 .filter(item => item?.funds?.length > 0); */
            if (selectedPCOValues && selectedPCOValues.length > 0 && !searchTextValue) {
                result = result.filter(item1 =>
                    item1?.pcos?.some(item2 => selectedPCOValues.some(val => val.id === item2.id)));
                setRowData(result);
            } else if (searchTextValue && !selectedPCOValues) {
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            } else if (selectedPCOValues && selectedPCOValues.length > 0 && searchTextValue) {
                result = result.filter(item1 =>
                    item1?.pcos?.some(item2 => selectedPCOValues.some(val => val.id === item2.id)));
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            }
            else {
                setRowData(result);
            }
        } else {
            if (selectedPCOValues && selectedPCOValues.length > 0 && !searchTextValue) {
                result = lps?.filter(item1 =>
                    item1?.pcos?.some(item2 => selectedPCOValues.some(val => val.id === item2.id)));
                setRowData(result);
            } else if (searchTextValue && !selectedPCOValues) {
                setRowData(lps);
                gridApi?.setQuickFilter(searchTextValue);
            } else if (selectedPCOValues && selectedPCOValues.length > 0 && searchTextValue) {
                result = lps?.filter(item1 =>
                    item1?.pcos?.some(item2 => selectedPCOValues.some(val => val.id === item2.id)));
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            }
            else {
                setRowData(lps);
            }
        }
    };

    const onPCOChange = (event: PCOSummary[] | null) => {
        setSelectedPCOValues(event);
        let result = lps;
        if (event && event.length > 0) {
            result = lps.filter(item1 =>
                item1?.pcos?.some(item2 => event.some(val => val.id === item2.id))
            );

            if (selectedFundValues && selectedFundValues?.length > 0 && !searchTextValue) {
                result = result.filter(item1 =>
                    item1?.funds?.some(item2 => selectedFundValues.some(val => val.id === item2.id)));
                setRowData(result);
            } else if (searchTextValue && !selectedFundValues) {
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            } else if (selectedFundValues && selectedFundValues?.length > 0 && searchTextValue) {
                result = result.filter(item1 =>
                    item1?.funds?.some(item2 => selectedFundValues.some(val => val.id === item2.id)));
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            }
            else {
                setRowData(result);
            }
        } else {
            if (selectedFundValues && selectedFundValues?.length > 0 && !searchTextValue) {
                result = lps?.filter(item1 =>
                    item1?.funds?.some(item2 => selectedFundValues.some(val => val.id === item2.id)));
                setRowData(result);
            } else if (searchTextValue && !selectedFundValues) {
                setRowData(lps);
                gridApi?.setQuickFilter(searchTextValue);
            } else if (selectedFundValues && selectedFundValues?.length > 0 && searchTextValue) {
                result = lps?.filter(item1 =>
                    item1?.funds?.some(item2 => selectedFundValues.some(val => val.id === item2.id)));
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            }
            else {
                setRowData(lps);
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
            loadingMessage: 'Loading LPs Overview...',
        };
    }, []);

    function handleRowClick(event: any) {
        const rowData = event.data;
        if (rowData) {
            dispatch(setSelectedLP(rowData));
        }
        // Assuming you have a unique ID for each row, you can use it to construct the URL for the other page
        const otherPageUrl = `/lpsOverview/singleLP`;
        navigate(otherPageUrl);
    }

    useEffect(() => {
        dispatch(fetchLPs());
        dispatch(fetchFunds());
        dispatch(fetchPCOs());
    }, [dispatch])

    useEffect(() => {
        console.log(lps);
        if (lps && lps.length > 0) {
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
    }, [lps])

    useEffect(() => {
        console.log(funds);
        setAllFunds(funds);
    }, [funds])

    useEffect(() => {
        console.log(pcos);
        setAllPCOs(pcos);
    }, [pcos])

    return (
        <Grid container className={classes.root}>
            <LPToolbar searchText={searchText}
                funds={allFunds}
                pcos={allPCOs}
                selectedFundValue={selectedFundValues}
                selectedPCOValue={selectedPCOValues}
                searchTextValue={searchTextValue}
                onValueChange={onValueChange}
                onCancelClick={onCancelClick}
                onFundChange={onFundChange}
                onPCOChange={onPCOChange}
            />
            <div className={clsx(getGridTheme(isDarkTheme), classes.fill)} style={{ height: selectedFundValues?.length === 0 && selectedPCOValues?.length === 0 ? '93%' : ((selectedFundValues && selectedFundValues.length > 3) || (selectedPCOValues && selectedPCOValues.length > 2)) ? '84.5%' : '93%' }}>
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
        </Grid>
    );
};


export default LPOverviewTable;