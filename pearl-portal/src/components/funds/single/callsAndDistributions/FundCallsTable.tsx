import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridOptions, GridReadyEvent, INumberFilterParams } from 'ag-grid-community';
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

const CustomStatusBar = (props: any) => {
    const theme = useTheme();

    const sumCommittedAmount = () => {
        const api = props.api;
        let sumCommitted = 0;
        api.forEachNode((node: any) => {
            if (node.group) {
                return;
            }
            sumCommitted += Number(node.data.amount);
        });
        return <div>Total Amount: <strong>{amountValueFormatter(sumCommitted ?? 0, '')}</strong></div>;
    };


    return (
        <div className="ag-status-bar" role="status">
            <div className="ag-status-bar-part ag-status-name-value" style={{ fontFamily: 'Raleway', color: theme.palette.mode==='dark'?'white':'black', lineHeight:1.5, fontWeight:500}}>
                {sumCommittedAmount()}
            </div>
        </div>
    );
};

interface SingleFundCallsTableProps {
    setGridApi: any
}

const SingleFundCallsTable = ({ setGridApi }: SingleFundCallsTableProps) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const { selectedFund } = useSelector((state: RootState) => state.funds);
    const { cashCalls } = useSelector((state: RootState) => state.cashCalls);
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
                headerName: 'Call ID',
                headerTooltip:'Call ID',
                field: 'id',
                tooltipField: 'id',
                suppressFiltersToolPanel: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                filterParams: {
                    buttons: ['reset'],
                  } as INumberFilterParams,
            },
            {
                headerName: 'LP Short Name',
                headerTooltip:'Limited Partner Short Name',
                field: 'lpShortName',
                tooltipField:'lpShortName',
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueGetter: (params) => {
                    return params.data?.lpShortName ? capitalizeLetters(params.data?.lpShortName) : params.data?.lpId;
                },
                filterParams: {
                    buttons: ['reset'],
                  } as INumberFilterParams,
            },
            {
                headerName: 'LP ID',
                headerTooltip:'Limited Partner ID',
                field: 'lpId',
                hide: true,
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                filterParams: {
                    buttons: ['reset'],
                  } as INumberFilterParams,
            },
            {
                headerName: 'Transaction Type',
                headerTooltip:'Transaction Type',
                field: 'lpType',
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                filterParams: {
                    buttons: ['reset'],
                  } as INumberFilterParams,
            },
            {
                headerName: 'PCO Short Name',
                headerTooltip:'Portfolio Company Short Name',
                field: 'pcoShortName',
                tooltipField:'pcoShortName',
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
                headerTooltip:'Call Date',
                field: 'callDate',
                enableRowGroup: true,
                filter: 'agDateColumnFilter',
                filterParams: dateFilterParams,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: dateValueFormatter,
            },
            {
                headerName: 'Due Date',
                headerTooltip:'Due Date',
                field: 'dueDate',
                enableRowGroup: true,
                filter: 'agDateColumnFilter',
                filterParams: dateFilterParams,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: dateValueFormatter,
            },
            {
                headerName: 'Amount',
                headerTooltip:'Amount',
                field: 'amount',
                enableRowGroup: true,
                enableValue: true,
                type: 'numericColumn',
                tooltipField: 'amount',
                tooltipComponentParams: { valueType: 'number' },
                filter: 'agNumberColumnFilter',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: quantityValueFormatter,
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
        if (selectedFund && selectedFund.pcos && selectedFund.pcos.length > 0 && cashCalls) {
            let data = cashCalls?.filter(x => x.fundId === selectedFund.id);
            data = data.map((item) => ({
                ...item,
                pcoShortName: selectedFund?.pcos?.filter(x => x.id?.toLowerCase() === item.pcoId?.toLowerCase())[0]?.shortName ?? '',
                lpShortName: selectedFund?.lps?.filter(x => x.id?.toLowerCase() === item.lpId?.toLowerCase())[0]?.shortName ?? ''
            }))
            setRowData(data ?? []);
        }
    }, [cashCalls, selectedFund])

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
            />
        </div>

    );
};


export default SingleFundCallsTable;
