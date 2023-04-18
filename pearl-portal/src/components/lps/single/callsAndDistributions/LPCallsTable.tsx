import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridOptions, GridReadyEvent, ICellRendererParams, INumberFilterParams } from 'ag-grid-community';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';
import { useAppDispatch } from '../../../../redux/store';
import { RootState } from '../../../../redux/slices/rootSlice';
import { dateValueFormatter, getGridTheme, DefaultColumnDef, DefaultStatusPanelDef, quantityValueFormatter, DefaultSideBarDef, dateFilterParams } from '../../../../helpers/agGrid';
import AGGridLoader from '../../../shared/AGGridLoader';
import { fetchCashCalls } from '../../../../redux/thunks/cashCallsThunk';
import { CashCall } from '../../../../models/cashCalls/cashCallsModels';
import { amountValueFormatter, capitalizeLetters } from '../../../../helpers/app';


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
        }
    })
);

const SingleLPCallsTable = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const { selectedLP } = useSelector((state: RootState) => state.lps);
    const { cashCalls } = useSelector((state: RootState) => state.cashCalls);
    const [, setGridApi] = useState<GridApi>();
    const theme = useTheme();
    const [rowData, setRowData] = useState<CashCall[]>([]);

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
    };

    const getColumnDefs = useMemo((): (ColDef | ColGroupDef)[] => {
        return [
            {
                headerName: 'Call ID',
                field: 'id',
                tooltipField: 'id',
                suppressFiltersToolPanel: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary, marginLeft: 30 },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
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
                headerName: 'LP ID',
                field: 'lpId',
                hide: true,
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'LP Type',
                field: 'lpType',
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'PCO Short Name',
                field: 'pcoShortName',
                tooltipField: 'pcoShortName',
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueGetter: (params) => {
                    return params.data?.pcoShortName ? capitalizeLetters(params.data?.pcoShortName) : params.data?.pcoId;
                },
                filterParams: {
                    buttons: ['reset'],
                } as INumberFilterParams,
            },
            {
                headerName: 'Call Date',
                field: 'callDate',
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: dateValueFormatter,
                filter: 'agDateColumnFilter',
                filterParams: dateFilterParams,
            },
            {
                headerName: 'Due Date',
                field: 'dueDate',
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: dateValueFormatter,
                filter: 'agDateColumnFilter',
                filterParams: dateFilterParams,
            },
            {
                headerName: 'Amount',
                field: 'amount',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'amount',
                filter: 'agNumberColumnFilter',
                tooltipComponentParams: { valueType: 'number' },
                aggFunc: 'sum',
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
        ];
    }, [theme]);

    const onGridReady = (params: GridReadyEvent) => {
        setGridApi(params?.api);
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
        if (selectedLP && selectedLP.pcos && selectedLP.pcos.length > 0 && cashCalls) {
            let data = cashCalls?.filter(x => x.lpId === selectedLP.id);
            data = data.map((item) => ({
                ...item,
                pcoShortName: selectedLP?.pcos?.filter(x => x.id?.toLowerCase() === item.pcoId?.toLowerCase())[0]?.shortName ?? ''
            }))
            setRowData(data ?? []);
        }
    }, [cashCalls, selectedLP])

    return (
        <div className={clsx(getGridTheme(isDarkTheme), classes.fill)}>
            <AgGridReact gridOptions={gridOptions}
                columnDefs={getColumnDefs}
                rowData={rowData}
                onGridReady={onGridReady}
                loadingOverlayComponentParams={loadingOverlayRendererParams}
                loadingOverlayComponent={AGGridLoader}
                tooltipShowDelay={0}
                tooltipHideDelay={10000}
                groupDisplayType={'singleColumn'}
                showOpenedGroup={true}
                suppressAggFuncInHeader={true}
            />
        </div>

    );
};


export default SingleLPCallsTable;
