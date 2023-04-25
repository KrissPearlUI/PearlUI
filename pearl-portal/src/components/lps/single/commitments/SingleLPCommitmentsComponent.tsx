import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridOptions, GridReadyEvent, INumberFilterParams, IStatusPanelParams } from 'ag-grid-community';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { ColDef, Column } from 'ag-grid-community';
import clsx from 'clsx';
import { ColGroupDef, ValueGetterParams, ValueSetterParams } from 'ag-grid-community/dist/lib/entities/colDef';
import { useAppDispatch } from '../../../../redux/store';
import { RootState } from '../../../../redux/slices/rootSlice';
import { CommitmentBasic } from '../../../../models/lps/lpModels';
import { dateValueFormatter, getGridTheme, DefaultColumnDef, DefaultStatusPanelDef, quantityValueFormatter, DefaultSideBarDef, filterParams, dateFilterParams } from '../../../../helpers/agGrid';
import AGGridLoader from '../../../shared/AGGridLoader';
import { fetchCashCalls } from '../../../../redux/thunks/cashCallsThunk';
import { amountValueFormatter } from '../../../../helpers/app';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flex: 1,
            height: '100%',
            overflow: 'hidden',
        },
        fill: {
            flex: 1,
            width: '100%',
            height: '100%',
            paddingRight: '0.7em',
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
            sumCommitted += Number(node.data.committedAmount);
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

interface SingleLPCommitmentsProps {
    setGridApi: any
}

const SingleLPCommitments = ({ setGridApi }: SingleLPCommitmentsProps) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const { selectedLP } = useSelector((state: RootState) => state.lps);
    const theme = useTheme();
    const [rowData, setRowData] = useState<any[]>([]);
    const gridApiRef = useRef<GridApi>();
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
        groupDisplayType: 'multipleColumns',
        // statusBar: DefaultStatusPanelDef,
        sideBar: DefaultSideBarDef,
        // enableStatusBar: true,
        /* groupIncludeFooter: true,
        groupIncludeTotalFooter: true */
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

    const sumAggFunc = useCallback((params: any) => {
        let sum = 0;
        if (params.values) {
            params.values.forEach((value: any) => {
                if (typeof value === 'number') {
                    sum += value;
                }
            });
            return sum;
        }
    }, []);

    const getColumnDefs = useMemo((): (ColDef | ColGroupDef)[] => {
        return [
            {
                headerName: 'CRM ID',
                headerTooltip:'CRM ID',
                field: 'id',
                tooltipField: 'id',
                suppressFiltersToolPanel: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Fund ID',
                headerTooltip:'Fund ID',
                field: 'fundId',
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Fund Name',
                headerTooltip:'Fund Name',
                field: 'fundName',
                enableRowGroup: true,
                tooltipField: 'fundName',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Currency',
                headerTooltip:'Fund Currency',
                field: 'fundCurrency',
                enableRowGroup: true,
                valueGetter: (params) => {
                    return params.data?.fundCurrency ? params.data?.fundCurrency.toUpperCase() : '';
                },
                valueSetter: (params) => valueSetter(params, 'fundCurrency'),
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Committed Amount',
                headerTooltip:'Committed Amount',
                field: 'committedAmount',
                type: 'numericColumn',
                tooltipField: 'committedAmount',
                tooltipComponentParams: { valueType: 'number' },
                filter: 'agNumberColumnFilter',
                //aggFunc: sumAggFunc,
                enableValue: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: quantityValueFormatter,
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Commitment Date',
                headerTooltip:'Commitment Date',
                field: 'date',
                filter: 'agDateColumnFilter',
                filterParams: dateFilterParams,
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: dateValueFormatter,
            },
            {
                headerName: 'End of IP Date',
                headerTooltip:'End of IP Date',
                field: 'ipDate',
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Transfer',
                headerTooltip:'Transfer',
                field: 'transfer',
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueGetter: (params) => {
                    return params.data?.transfered ? 'x' : '';
                },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Tapped Out',
                headerTooltip:'Tapped Out',
                field: 'tappedOot',
                valueGetter: (params: ValueGetterParams) => {
                    return params?.data?.tappedOot ? 'Yes' : 'No'
                },
                minWidth: 110,
                maxWidth: 130,
                enableRowGroup: false,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            }
        ];
    }, [theme, sumAggFunc]);

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


    useEffect(() => {
        dispatch(fetchCashCalls());
    }, [dispatch])

    useEffect(() => {
        setRowData(selectedLP?.commitments ?? []);
    }, [selectedLP])


    const frameworkComponents: FrameworkComponentsProps = {
        agColumnHeader: ({ column }) => {
            const total = totals[column.getColId()];
            return (
                <div style={{ display: 'flex', justifyContent: total ? 'end' : 'start', flex: 1, textAlign: total ? 'right' : 'left' }}>
                    {column.getColDef().headerName}
                </div>
            );
        },
    };


    const statusPanelProps = useMemo(() => {
        return {
            statusPanel: {
                statusPanelRenderer: 'aggregators',
                statusPanelParams: {
                    aggFuncs: ['sum'],
                },
            },
        };
    }, []);

    return (
        <div className={clsx(getGridTheme(isDarkTheme), classes.fill)}>
            <AgGridReact gridOptions={gridOptions}
                columnDefs={getColumnDefs}
                rowData={rowData}
                loadingOverlayComponentParams={loadingOverlayRendererParams}
                loadingOverlayComponent={AGGridLoader}
                tooltipShowDelay={0}
                tooltipHideDelay={10000}
                getRowNodeId={(data) => data.id}
                onGridReady={onGridReady}

            /*                 frameworkComponents={frameworkComponents}
                            context={{ totals }} */

            /*  onGridReady={(params) => {
                 setGridApi(params.api);
                 if (!gridApiRef.current) {
                     gridApiRef.current = params.api;
                 }

                 const api = params.api;
                 const columnApi = params.columnApi;

                 const calculateTotals = () => {
                     let total = 0;
                     const displayedColumns = columnApi.getAllDisplayedColumns();
                     displayedColumns.forEach((column) => {
                         if (column.getColDef().type === 'numericColumn') {
                             const colId = column.getColId();
                             let sum = 0;

                             gridApiRef.current?.forEachNodeAfterFilterAndSort((node) => {
                                 const value = Number(node.data[colId]);
                                 if (!isNaN(value)) {
                                     sum += value;
                                 }
                             });

                             total=sum;
                             totals[colId] = sum;
                         }
                     });
                     setTotals({ ...totals, Total: total });
                 };

                 calculateTotals();

                 api.addEventListener('rowValueChanged', calculateTotals);
                 api.addEventListener('rowDataChanged', calculateTotals);
                 api.addEventListener('cellValueChanged', calculateTotals);
             }} */
            />
        </div>

    );
};


export default SingleLPCommitments;
