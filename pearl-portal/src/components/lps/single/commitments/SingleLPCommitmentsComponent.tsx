import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridOptions, GridReadyEvent, INumberFilterParams } from 'ag-grid-community';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { ColDef, Column } from 'ag-grid-community';
import clsx from 'clsx';
import { ColGroupDef, ValueSetterParams } from 'ag-grid-community/dist/lib/entities/colDef';
import { useAppDispatch } from '../../../../redux/store';
import { RootState } from '../../../../redux/slices/rootSlice';
import { CommitmentBasic } from '../../../../models/lps/lpModels';
import { dateValueFormatter, getGridTheme, DefaultColumnDef, DefaultStatusPanelDef, quantityValueFormatter, DefaultSideBarDef, filterParams, dateFilterParams } from '../../../../helpers/agGrid';
import AGGridLoader from '../../../shared/AGGridLoader';
import { fetchCashCalls } from '../../../../redux/thunks/cashCallsThunk';

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

const SingleLPCommitments = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const { selectedLP } = useSelector((state: RootState) => state.lps);
    const [, setGridApi] = useState<GridApi>();
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
        statusBar: DefaultStatusPanelDef,
        sideBar: DefaultSideBarDef,
        groupIncludeFooter: true,
        groupIncludeTotalFooter: true
    };

    const getColumnDefs = useMemo((): (ColDef | ColGroupDef)[] => {
        return [
            {
                headerName: 'CRM ID',
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
                field: 'fundId',
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                filterParams: {
                    buttons: ['reset'],
                  } as INumberFilterParams,
            },
            {
                headerName: 'Fund Name',
                field: 'fundName',
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                filterParams: {
                    buttons: ['reset'],
                  } as INumberFilterParams,
            },
            {
                headerName: 'Currency',
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
                headerName: 'Commitment',
                field: 'committedAmount',
                type: 'numericColumn',
                tooltipField: 'committedAmount',
                filter: 'agNumberColumnFilter',
                aggFunc: 'sum',
                enableValue: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: quantityValueFormatter,
                filterParams: {
                    buttons: ['reset'],
                  } as INumberFilterParams,
            },
            {
                headerName: 'Commitment Date',
                field: 'date',
                filter: 'agDateColumnFilter',
                filterParams: dateFilterParams,
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: dateValueFormatter,
            },
            {
                headerName: 'End of IP Date',
                field: 'ipDate',
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                filterParams: {
                    buttons: ['reset'],
                  } as INumberFilterParams,
            },
            {
                headerName: 'Transfer',
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
        ];
    }, [theme]);

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
                frameworkComponents={frameworkComponents}
                context={{ totals }}
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
