import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { capitalize, Grid, useTheme } from '@mui/material';
import { RootState } from '../../../redux/slices/rootSlice';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridOptions, GridReadyEvent, INumberFilterParams, ITooltipParams, ValueGetterParams } from 'ag-grid-community';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {
    DefaultColumnDef,
    DefaultSideBarDef,
    DefaultStatusPanelDef,
    filterParams,
    getGridTheme,
    quantityValueFormatter,
} from '../../../helpers/agGrid';
import clsx from 'clsx';
import { amountValueFormatter, capitalizeLetters } from '../../../helpers/app';
import { ColDef, ColGroupDef, ValueSetterParams } from 'ag-grid-community/dist/lib/entities/colDef';
import { useAppDispatch } from '../../../redux/store';
import { Fund, LP, LPFundsOverview } from '../../../models/lps/lpModels';
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

const CustomStatusBar = (props: any) => {
    const theme = useTheme();

    const sumInvestedAmount = () => {
        const api = props.api;
        let sumInvested = 0;
        api.forEachNode((node: any) => {
            if (node.group) {
                return;
            }
            sumInvested += Number(node.data.amountInvestedLocalCcy ?? 0);
        });
        return <div>Invested Amount: <strong>{amountValueFormatter(sumInvested ?? 0, '')}</strong></div>;
    };


    return (
        <div className="ag-status-bar" role="status">
            <div className="ag-status-bar-part ag-status-name-value" style={{ fontFamily: 'Raleway', color: theme.palette.mode === 'dark' ? 'white' : 'black', lineHeight: 1.5, fontWeight: 500 }}>
                {sumInvestedAmount()}
            </div>
        </div>
    );
};

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
    const [selectedFundValues, setSelectedFundValues] = useState<FundSummary[] | null>([]);
    const [selectedLPValues, setSelectedLPValues] = useState<LP[] | null>([]);
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
        statusBar: {
            statusPanels: [
                {
                    statusPanel: 'agTotalRowCountComponent',
                    align: 'left',
                },
                {
                    statusPanelFramework: CustomStatusBar,
                },
            ],
        }
    };

    const getColumnDefs = useMemo((): (ColDef | ColGroupDef)[] => {
        return [
            {
                headerName: 'Short Name',
                headerTooltip:'Portfolio Company Short Name',
                field: 'shortName',
                minWidth: 115,
                enableRowGroup: true,
                tooltipField: 'shortName',
                valueGetter: (params) => {
                    return params.data?.shortName;
                },
                valueSetter: (params) => valueSetter(params, 'shortName'),
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Name',
                headerTooltip:'Portfolio Company Name',
                field: 'pcoName',
                suppressFiltersToolPanel: true,
                minWidth: 160,
                tooltipField: 'pcoName',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Headquarters',
                headerTooltip:'Portfolio Company Headquarters',
                field: 'country',
                enableRowGroup: true,
                minWidth: 110,
                maxWidth: 140,
                valueGetter: (params) => {
                    return params.data?.country ? capitalize(params.data?.country.toString()) : '';
                },
                valueSetter: (params) => valueSetter(params, 'country'),
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Local Currency',
                headerTooltip:'Portfolio Company Currency',
                field: 'localCurrency',
                enableRowGroup: true,
                minWidth: 110,
                maxWidth: 140,
                valueGetter: (params) => {
                    return params.data?.localCurrency ? params.data?.localCurrency.toUpperCase() : '';
                },
                valueSetter: (params) => valueSetter(params, 'localCurrency'),
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Invested Capital',
                headerTooltip:'Portfolio Company Invested Capital',
                field: 'amountInvestedLocalCcy',
                enableRowGroup: true,
                enableValue: true,
                minWidth: 220,
                type: 'numericColumn',
                filter: 'agNumberColumnFilter',
                tooltipField: 'amountInvestedLocalCcy',
                tooltipComponentParams: { valueType: 'number' },
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                valueFormatter: quantityValueFormatter,
                valueGetter: (params: ValueGetterParams) => {
                    if (params && params.data) {
                        if (selectedFundValues && selectedFundValues.length > 0) {
                            const fundsSelected: Fund[] | null = params.data.funds?.filter((item2: Fund) => selectedFundValues.some(val => val.id === item2.id));
                            return fundsSelected && fundsSelected.length > 0 ? fundsSelected.reduce((a: number, v: Fund) => a = a + (v.amountInvested ?? 0), 0) : params.data.amountInvestedLocalCcy ?? 0
                        } else {
                            return params.data.amountInvestedLocalCcy ?? 0
                        }
                    } else {
                        return 0;
                    }
                },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Funds',
                headerTooltip:'Number of Funds that invested in PCO',
                field: 'numOfFunds',
                minWidth: 90,
                maxWidth: 100,
                enableRowGroup: true,
                tooltipComponentParams: { type: 'funds' },
                tooltipValueGetter: (params: ITooltipParams<any, any>) => {
                    if (params && params.data) {
                        if (selectedFundValues && selectedFundValues.length > 0) {
                            const fundsSelected: Fund[] | null = params.data.funds?.filter((item2: Fund) => selectedFundValues.some(val => val.id === item2.id));
                            return fundsSelected ?? params.data.funds;
                        }
                        else {
                            return params.data.funds;
                        }
                    }
                    else
                        return 0;
                },
                valueGetter: (params: ValueGetterParams) => {
                    if (params && params.data) {
                        if (selectedFundValues && selectedFundValues.length > 0) {
                            const fundsSelected: Fund[] | null = params.data.funds?.filter((item2: Fund) => selectedFundValues.some(val => val.id === item2.id));
                            return fundsSelected && fundsSelected.length > 0 ? fundsSelected.length : params.data.numOfFunds ?? 0
                        }
                        else {
                            return params.data.numOfFunds ?? 0
                        }
                    }
                    else
                        return 0;
                },
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                filterParams: filterParams,
            },
            {
                headerName: 'LPs',
                headerTooltip:'Number of LPs that invested in PCO',
                field: 'numOfLPS',
                minWidth: 100,
                maxWidth: 140,
                enableRowGroup: true,
                tooltipComponentParams: { type: 'lps' },
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                filterParams: filterParams,
                tooltipValueGetter: (params: ITooltipParams<any, any>) => {
                    if (params && params.data) {
                        if (selectedLPValues && selectedLPValues.length > 0) {
                            const lpsSelected: LPFundsOverview[] | null = params.data.lps?.filter((item2: LPFundsOverview) => selectedLPValues.some(val => val.id === item2.id));
                            return lpsSelected ?? params.data.lps;
                        }
                        else {
                            return params.data.lps;
                        }
                    }
                    else
                        return 0;
                },
                valueGetter: (params: ValueGetterParams) => {
                    if (params && params.data) {
                        if (selectedLPValues && selectedLPValues.length > 0) {
                            const lpsSelected: LPFundsOverview[] | null = params.data.lps?.filter((item2: LPFundsOverview) => selectedLPValues.some(val => val.id === item2.id));
                            return lpsSelected && lpsSelected.length > 0 ? lpsSelected.length : params.data.numOfLPS ?? 0
                        }
                        else {
                            return params.data.numOfLPS ?? 0
                        }
                    }
                    else
                        return 0;
                },
            },
            {
                headerName: 'Status',
                headerTooltip:'Portfolio Company Status',
                field: 'status',
                valueGetter: (params: ValueGetterParams) => {
                    return params?.data?.status ? capitalizeLetters(params.data.status) : '';
                },
                suppressFiltersToolPanel: true,
                minWidth: 110,
                maxWidth: 130,
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            }
        ];
    }, [theme, selectedFundValues, selectedLPValues]);

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

    const onFundChange = (event: React.SyntheticEvent, values: FundSummary[] | null) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.nativeEvent.type === 'focusout') return;
        setSelectedFundValues(values);
        let result = pcos;
        if (values && values.length > 0) {
            result = pcos.filter(item1 =>
                item1?.funds?.some(item2 => values.some(val => val.id === item2.id))
            );
            if (selectedLPValues && selectedLPValues.length > 0 && !searchTextValue) {
                result = result.filter(item1 =>
                    item1?.lps?.some(item2 => selectedLPValues.some(val => val.id === item2.id))
                );
                setRowData(result);
            } else if (searchTextValue && !selectedLPValues) {
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            } else if (selectedLPValues && selectedLPValues.length > 0 && searchTextValue) {
                result = result.filter(item1 =>
                    item1?.lps?.some(item2 => selectedLPValues.some(val => val.id === item2.id))
                );
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            }
            else {
                setRowData(result);
            }
        } else {
            if (selectedLPValues && selectedLPValues.length > 0 && !searchTextValue) {
                result = pcos.filter(item1 =>
                    item1?.lps?.some(item2 => selectedLPValues.some(val => val.id === item2.id))
                );
                setRowData(result);
            } else if (searchTextValue && !selectedLPValues) {
                setRowData(pcos);
                gridApi?.setQuickFilter(searchTextValue);
            } else if (selectedLPValues && selectedLPValues.length > 0 && searchTextValue) {
                result = pcos.filter(item1 =>
                    item1?.lps?.some(item2 => selectedLPValues.some(val => val.id === item2.id))
                );
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            }
            else {
                setRowData(pcos);
            }
        }
    };

    const onLPChange = (event: React.SyntheticEvent, values: LP[] | null) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.nativeEvent.type === 'focusout') return;
        setSelectedLPValues(values);
        let result = pcos;
        if (values && values.length > 0) {
            result = pcos.filter(item1 =>
                item1?.lps?.some(item2 => values.some(val => val.id === item2.id))
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
                result = pcos.filter(item1 =>
                    item1?.funds?.some(item2 => selectedFundValues.some(val => val.id === item2.id)));
                setRowData(result);
            } else if (searchTextValue && !selectedFundValues) {
                setRowData(pcos);
                gridApi?.setQuickFilter(searchTextValue);
            } else if (selectedFundValues && selectedFundValues?.length > 0 && searchTextValue) {
                result = pcos.filter(item1 =>
                    item1?.funds?.some(item2 => selectedFundValues.some(val => val.id === item2.id)));
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            }
            else {
                setRowData(pcos);
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
                selectedFundValue={selectedFundValues}
                selectedLPValue={selectedLPValues}
                searchTextValue={searchTextValue}
                onValueChange={onValueChange}
                onCancelClick={onCancelClick}
                onFundChange={onFundChange}
                onLPChange={onLPChange}
            />
            <div className={clsx(getGridTheme(isDarkTheme), classes.fill)} style={{ height: selectedLPValues?.length === 0 && selectedFundValues?.length === 0 ? '93%' : ((selectedLPValues && selectedLPValues.length > 2) || (selectedFundValues && selectedFundValues.length > 3)) ? '84.5%' : '93%' }}>
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
