import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { Column, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, INumberFilterParams } from 'ag-grid-community';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';
import { useAppDispatch } from '../../../../redux/store';
import { RootState } from '../../../../redux/slices/rootSlice';
import { dateValueFormatter, getGridTheme, DefaultColumnDef, DefaultStatusPanelDef, quantityValueFormatter, forexValueFormatter, prePostmoneyValueFormatter, DefaultSideBarDef, dateFilterParams } from '../../../../helpers/agGrid';
import AGGridLoader from '../../../shared/AGGridLoader';
import { fetchTransactions } from '../../../../redux/thunks/transactionsThunk';
import { Transaction } from '../../../../models/transactions/transactionsModels';
import { amountValueFormatter, capitalizeLetters } from '../../../../helpers/app';


const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flex: 1,
            overflow: 'hidden',
        },
        fill: {
            flex: 1,
            width: '100%',
            height: '100%',
            paddingRight: '0.7em'
        }
    })
);

const SingleLPTransactions = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const { selectedLP } = useSelector((state: RootState) => state.lps);
    const { transactions } = useSelector((state: RootState) => state.transactions);
    const [, setGridApi] = useState<GridApi>();
    const theme = useTheme();
    const [rowData, setRowData] = useState<Transaction[]>([]);
    const [totals, setTotals] = useState<Record<string, number>>({});

    interface FrameworkComponentsProps {
        agColumnHeader: React.FC<{
            column: Column;
            totals: Record<string, number>;
        }>;
    }

    const gridOptions: GridOptions = {
        defaultColDef: DefaultColumnDef,
        enableCellChangeFlash: true,
        enableRangeSelection: true,
        animateRows: true,
        pagination: true,
        enableCellTextSelection: true,
        /* groupDisplayType: 'multipleColumns', */
        statusBar: DefaultStatusPanelDef,
        /*  groupIncludeFooter: true,
         groupIncludeTotalFooter: true, */
        sideBar: DefaultSideBarDef,
    };

    const getColumnDefs = useMemo((): (ColDef | ColGroupDef)[] => {
        return [
            {
                headerName: 'Transaction ID',
                field: 'id',
                tooltipField: 'id',
                suppressFiltersToolPanel: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, marginLeft: 30 },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Date',
                field: 'date',
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: dateValueFormatter,
                filter: 'agDateColumnFilter',
                filterParams: dateFilterParams,
            },
            {
                headerName: 'Fund ID',
                field: 'fundId',
                rowGroup: true,
                hide: true,
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Investment Type',
                field: 'investmentType',
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'PCO Short Name',
                field: 'pcoShortName',
                enableRowGroup: true,
                tooltipField: 'pcoShortName',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueGetter: (params) => {
                    return params.data?.pcoShortName ? capitalizeLetters(params.data?.pcoShortName) : params.data?.pcoId;
                },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Security Type',
                field: 'securityType',
                tooltipField: 'securityType',
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Amount Fund Currency',
                headerValueGetter: (params) => {return params.colDef.headerName},
                field: 'amountFundCurrency',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'amountFundCurrency',
                tooltipComponentParams: { valueType: 'number' },
                filter: 'agNumberColumnFilter',
                aggFunc: 'sum',
                enableValue: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                cellRenderer: (params: ICellRendererParams) => {
                    if (params?.node?.group) {
                        return <span style={{ fontWeight: 600}}>{amountValueFormatter(params.value ?? 0, '')}</span>
                    } else {
                        return amountValueFormatter(params.value ?? 0, '');
                    }
                },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Amount Local Currency',
                headerValueGetter: () => {return 'Amount Local Currency'},
                field: 'amountLocalCurrency',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'amountLocalCurrency',
                tooltipComponentParams: { valueType: 'number' },
                filter: 'agNumberColumnFilter',
                aggFunc: 'sum',
                enableValue: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                cellRenderer: (params: ICellRendererParams) => {
                    if (params?.node?.group) {
                        return <span style={{ fontWeight: 600}}>{amountValueFormatter(params.value ?? 0, '')}</span>
                    } else {
                        return amountValueFormatter(params.value ?? 0, '');
                    }
                },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Forex NT',
                field: 'forexNT',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'forexNT',
                tooltipComponentParams: { valueType: 'number' },
                filter: 'agNumberColumnFilter',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: forexValueFormatter,
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Pre Money Valuation',
                field: 'preMoneyValuation',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'preMoneyValuation',
                tooltipComponentParams: { valueType: 'number' },
                filter: 'agNumberColumnFilter',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: prePostmoneyValueFormatter,
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Post Money Valuation',
                field: 'postMoneyValuation',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'postMoneyValuation',
                tooltipComponentParams: { valueType: 'number' },
                filter: 'agNumberColumnFilter',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: prePostmoneyValueFormatter,
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Warrant Security Type',
                field: 'warrantSecurityType',
                enableRowGroup: true,
                hide: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Warrant Strike',
                field: 'warrantStrike',
                enableRowGroup: true,
                hide: true,
                type: 'numericColumn',
                tooltipField: 'warrantStrike',
                tooltipComponentParams: { valueType: 'number' },
                filter: 'agNumberColumnFilter',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: quantityValueFormatter,
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Due Date',
                field: 'dueDate',
                hide: true,
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: dateValueFormatter,
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
        ];
    }, [theme]);

    const autoGroupColumnDef = useMemo<ColDef>(() => {
        return {
            headerName: 'Fund Id',
            minWidth: 300,
        };
    }, []);

    const onGridReady = (params: GridReadyEvent) => {
        setGridApi(params?.api);
        const api = params.api;
        const columnApi = params.columnApi;

        const calculateTotals = () => {
            let total = 0;
            const displayedColumns = columnApi.getAllDisplayedColumns();
            displayedColumns.forEach((column) => {
                if (column.getColDef().type === 'numericColumn') {
                    const colId = column.getColId();
                    let sum = 0;

                    api.forEachNodeAfterFilterAndSort((node) => {
                        const value = Number(node.data[colId]);
                        if (!isNaN(value)) {
                            sum += value;
                        }
                    });

                    total = sum;
                    totals[colId] = sum;
                }
            });
            setTotals({ ...totals, Total: total });
        };

        calculateTotals();
    };

    const loadingOverlayRendererParams = useMemo(() => {
        return {
            loadingMessage: 'Loading Funds Overview...',
        };
    }, []);

    interface FrameworkComponentsProps {
        agColumnFooter: React.FC<{
            column: Column;
            totals: Record<string, number>;
        }>;
    }

    const frameworkComponents: FrameworkComponentsProps = {
        agColumnHeader: ({ column }) => {
            const total = totals[column.getColId()];
            return (
                <div style={{ display: 'flex', justifyContent: total ? 'end' : 'start', flex: 1, textAlign: total ? 'right' : 'left' }}>
                    {column.getColDef().headerName}
                </div>
            );
        },
        agColumnFooter: ({ column }) => {
            const total = totals[column.getColId()];
            return <div style={{ fontWeight: 600 }}>Total: {total != null ? total.toFixed(2) : '-'}</div>;
        }
    };

    useEffect(() => {
        dispatch(fetchTransactions());
    }, [dispatch])

    useEffect(() => {
        if (selectedLP && selectedLP.pcos && selectedLP.pcos.length > 0 && transactions) {
            let filteredData = transactions?.filter(item => item.lpId === selectedLP.id);
            filteredData = filteredData.map((item) => ({
                ...item,
                pcoShortName: selectedLP?.pcos?.filter(x => x.id?.toLowerCase() === item?.pcoId?.toLowerCase())[0]?.shortName ?? ''
            }))
            setRowData(filteredData ?? []);
        }
    }, [transactions, selectedLP])

    return (
        <div className={clsx(getGridTheme(isDarkTheme), classes.fill)} style={{ flex: 1 }}>
            <AgGridReact gridOptions={gridOptions}
                columnDefs={getColumnDefs}
                rowData={rowData}
                onGridReady={onGridReady}
                loadingOverlayComponentParams={loadingOverlayRendererParams}
                loadingOverlayComponent={AGGridLoader}
                tooltipShowDelay={0}
                tooltipHideDelay={10000}
                /*  frameworkComponents={frameworkComponents}
                 context={{ totals }} */
                groupDisplayType={'singleColumn'}
                showOpenedGroup={true}
                autoGroupColumnDef={autoGroupColumnDef}
                suppressAggFuncInHeader={true}
            />
        </div>

    );
};


export default SingleLPTransactions;
