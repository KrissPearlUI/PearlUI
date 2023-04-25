import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, useTheme } from '@mui/material';
import { RootState } from '../../../redux/slices/rootSlice';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridOptions, GridReadyEvent, INumberFilterParams, ITooltipParams } from 'ag-grid-community';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {
    dateFilterParams,
    dateValueFormatter,
    DefaultColumnDef,
    DefaultSideBarDef,
    DefaultStatusPanelDef,
    filterParams,
    getGridTheme,
    quantityValueFormatter,
} from '../../../helpers/agGrid';
import clsx from 'clsx';
import { ColDef, ColGroupDef, ValueGetterParams, ValueSetterParams } from 'ag-grid-community/dist/lib/entities/colDef';
import { useAppDispatch } from '../../../redux/store';
import { LP, LPFundsOverview, PCO } from '../../../models/lps/lpModels';
import AGGridLoader from '../../shared/AGGridLoader';
import { fetchLPs } from '../../../redux/thunks/lpThunk';
import { FundSummary } from '../../../models/funds/fundModels';
import { fetchFunds } from '../../../redux/thunks/fundThunk';
import { PCOSummary } from '../../../models/pcos/pcoModels';
import { fetchPCOs } from '../../../redux/thunks/pcoThunk';
import FundsToolbar from './FundsToolbar';
import { useNavigate } from 'react-router-dom';
import { setSelectedFund } from '../../../redux/slices/funds/fundsSlice';
import { amountValueFormatter } from '../../../helpers/app';

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

    const sumCommittedAmount = () => {
        const api = props.api;
        let sumCommitted = 0;
        api.forEachNode((node: any) => {
            if (node.group) {
                return;
            }
            sumCommitted += Number(node.data.totalCommitmentsFundCcy);
        });
        return <div>Committed Amount: <strong>{amountValueFormatter(sumCommitted ?? 0, '')}</strong></div>;
    };


    return (
        <div className="ag-status-bar" role="status">
            <div className="ag-status-bar-part ag-status-name-value" style={{ fontFamily: 'Raleway', color: theme.palette.mode==='dark'?'white':'black', lineHeight:1.5, fontWeight:500}}>
                {sumCommittedAmount()}
            </div>
        </div>
    );
};

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
    const [selectedLPValues, setSelectedLPValues] = useState<LP[] | null>([]);
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
                headerName: 'Id',
                headerTooltip:'Fund ID',
                field: 'id',
                minWidth: 90,
                maxWidth: 100,
                enableRowGroup: true,
                valueGetter: (params) => {
                    return params.data?.id;
                },
                valueSetter: (params) => valueSetter(params, 'id'),
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Short Name',
                headerTooltip:'Fund Short Name',
                field: 'shortName',
                minWidth: 100,
                maxWidth: 150,
                enableRowGroup: true,
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
                headerTooltip:'Fund Name',
                field: 'fundName',
                suppressFiltersToolPanel: true,
                minWidth: 200,
                tooltipField: 'fundname',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Currency',
                headerTooltip:'Fund Currency',
                field: 'currency',
                enableRowGroup: true,
                minWidth: 80,
                valueGetter: (params) => {
                    return params.data?.currency ? params.data?.currency.toUpperCase() : '';
                },
                valueSetter: (params) => valueSetter(params, 'currency'),
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Vintage',
                headerTooltip:'Fund Vintage',
                field: 'vintage',
                minWidth: 100,
                maxWidth: 150,
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                valueFormatter: dateValueFormatter,
                filter: 'agDateColumnFilter',
                filterParams: dateFilterParams,
            },
            {
                headerName: 'Committed Capital',
                headerTooltip:'Fund Committed Capital',
                field: 'totalCommitmentsFundCcy',
                enableRowGroup: true,
                minWidth: 220,
                type: 'numericColumn',
                enableValue: true,
                filter: 'agNumberColumnFilter',
                tooltipComponentParams: { valueType: 'number' },
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                valueFormatter: quantityValueFormatter,
                tooltipValueGetter: (params: ITooltipParams<any, any>) => {
                    if (params && params.data) {
                        if (selectedLPValues && selectedLPValues.length > 0) {
                            const lpsSelected: LPFundsOverview[] | null = params.data.lps?.filter((item2: LPFundsOverview) => selectedLPValues.some(val => val.id === item2.id));
                            return lpsSelected && lpsSelected.length > 0 ? lpsSelected.reduce((a: number, v: LPFundsOverview) => a = a + (v.committedAmount ?? 0), 0) : params.data.totalCommitmentsFundCcy ?? 0
                        } else {
                            return params.data.totalCommitmentsFundCcy ?? 0
                        }
                    } else {
                        return 0;
                    }
                },
                valueGetter: (params: ValueGetterParams) => {
                    if (params && params.data) {
                        if (selectedLPValues && selectedLPValues.length > 0) {
                            const lpsSelected: LPFundsOverview[] | null = params.data.lps?.filter((item2: LPFundsOverview) => selectedLPValues.some(val => val.id === item2.id));
                            return lpsSelected && lpsSelected.length > 0 ? lpsSelected.reduce((a: number, v: LPFundsOverview) => a = a + (v.committedAmount ?? 0), 0) : params.data.totalCommitmentsFundCcy ?? 0
                        } else {
                            return params.data.totalCommitmentsFundCcy ?? 0
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
                headerName: 'LPs',
                headerTooltip:'Number of LPs that committed to the Fund',
                field: 'numOfLPs',
                minWidth: 90,
                maxWidth: 100,
                enableRowGroup: true,
                tooltipComponentParams: { type: 'lps' },
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                filterParams: filterParams,
                tooltipValueGetter: (params: ITooltipParams<any, any>) => {
                    if (params && params.data) {
                        if (selectedLPValues && selectedLPValues.length > 0) {
                            const lpsSelected: LPFundsOverview[] | null = params.data.lps?.filter((item2: LPFundsOverview) => selectedLPValues.some(val => val.id === item2.id));
                            return lpsSelected ?? params.data.lps
                        }
                        else {
                            return params.data.lps
                        }
                    }
                    else
                        return 0;
                },
                valueGetter: (params: ValueGetterParams) => {
                    if (params && params.data) {
                        if (selectedLPValues && selectedLPValues.length > 0) {
                            const lpsSelected: LPFundsOverview[] | null = params.data.lps?.filter((item2: LPFundsOverview) => selectedLPValues.some(val => val.id === item2.id));
                            return lpsSelected && lpsSelected.length > 0 ? lpsSelected.length : params.data.lps?.length ?? 0
                        }
                        else {
                            return params.data.lps?.length ?? 0
                        }
                    }
                    else
                        return 0;
                },
            },
            {
                headerName: 'Active PCOs',
                headerTooltip:'Number of PCOs that the Fund invested in',
                field: 'numOFPCOs',
                minWidth: 100,
                maxWidth: 140,
                tooltipComponentParams: { type: 'pcos' },
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, cursor: 'pointer' },
                filterParams: filterParams,
                tooltipValueGetter: (params: ITooltipParams<any, any>) => {
                    if (params && params.data) {
                        if (selectedPCOValues && selectedPCOValues.length > 0) {
                            const pcosSelected: PCO[] | null = params.data.pcos?.filter((item2: PCO) => selectedPCOValues.some(val => val.id === item2.id));
                            return pcosSelected ?? params.data.pcos
                        }
                        else {
                            return params.data.pcos
                        }
                    }
                    else
                        return 0;
                },
                valueGetter: (params: ValueGetterParams) => {
                    if (params && params.data) {
                        if (selectedPCOValues && selectedPCOValues.length > 0) {
                            const pcosSelected: PCO[] | null = params.data.pcos?.filter((item2: PCO) => selectedPCOValues.some(val => val.id === item2.id));
                            return pcosSelected && pcosSelected.length > 0 ? pcosSelected.length : params.data.pcos?.length ?? 0
                        }
                        else {
                            return params.data.pcos?.length ?? 0
                        }
                    }
                    else
                        return 0;
                },
            },
            {
                headerName: 'Domicile',
                headerTooltip:'Fund Domicile',
                field: 'domicile',
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
    }, [theme, selectedLPValues, selectedPCOValues]);

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

    const onLPChange = (event: React.SyntheticEvent, values: LP[] | null) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.nativeEvent.type === 'focusout') return;
        setSelectedLPValues(values);
        let result = funds;
        if (values && values.length > 0) {
            result = funds.filter(item1 =>
                item1?.lps?.some(item2 => values.some(val => val.id === item2.id))
            );

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
                result = funds.filter(item1 =>
                    item1?.pcos?.some(item2 => selectedPCOValues.some(val => val.id === item2.id)));
                setRowData(result);
            } else if (searchTextValue && !selectedPCOValues) {
                setRowData(funds);
                gridApi?.setQuickFilter(searchTextValue);
            } else if (selectedPCOValues && selectedPCOValues.length > 0 && searchTextValue) {
                result = funds.filter(item1 =>
                    item1?.pcos?.some(item2 => selectedPCOValues.some(val => val.id === item2.id)));
                setRowData(result);
                gridApi?.setQuickFilter(searchTextValue);
            }
            else {
                setRowData(funds);
            }
        }
    };

    const onPCOChange = (event: React.SyntheticEvent, values: PCOSummary[] | null) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.nativeEvent.type === 'focusout') return;
        setSelectedPCOValues(values);
        let result = funds;
        if (values && values.length > 0) {
            result = funds.filter(item1 =>
                item1?.pcos?.some(item2 => values.some(val => val.id === item2.id))
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
                result = funds.filter(item1 =>
                    item1?.lps?.some(item2 => selectedLPValues.some(val => val.id === item2.id))
                );
                setRowData(result);
            } else if (searchTextValue && !selectedLPValues) {
                setRowData(funds);
                gridApi?.setQuickFilter(searchTextValue);
            } else if (selectedLPValues && selectedLPValues.length > 0 && searchTextValue) {
                result = funds.filter(item1 =>
                    item1?.lps?.some(item2 => selectedLPValues.some(val => val.id === item2.id))
                );
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
        setRowData(funds);
    }, [funds])

    useEffect(() => {
        setAllLPs(lps);
    }, [lps])

    useEffect(() => {
        setAllPCOs(pcos);
    }, [pcos])

    return (
        <Grid container className={classes.root}>
            <FundsToolbar searchText={searchText}
                lps={allLPs}
                pcos={allPCOs}
                selectedLPValue={selectedLPValues}
                selectedPCOValue={selectedPCOValues}
                searchTextValue={searchTextValue}
                onValueChange={onValueChange}
                onCancelClick={onCancelClick}
                onLPChange={onLPChange}
                onPCOChange={onPCOChange}
            />
            <div className={clsx(getGridTheme(isDarkTheme), classes.fill)} style={{ height: selectedLPValues?.length === 0 && selectedPCOValues?.length === 0 ? '93%' : ((selectedLPValues && selectedLPValues.length > 2) || (selectedPCOValues && selectedPCOValues.length > 2)) ? '84.5%' : '93%' }}>
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
