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
import { dateValueFormatter, getGridTheme, DefaultColumnDef, DefaultStatusPanelDef, quantityValueFormatter, prePostmoneyValueFormatter, forexValueFormatter, DefaultSideBarDef, dateFilterParams } from '../../../../helpers/agGrid';
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
//and (PCO_ID='Actn01' or PCO_ID='Agan01' or PCO_ID='Alph01' or PCO_ID='Elco01' or PCO_ID='Ensp01' or PCO_ID='Fido01' or PCO_ID='Futu01' or PCO_ID='GeoD01' or PCO_ID='Hydr01' or PCO_ID='Imag01' or PCO_ID='Libr01' or PCO_ID='Meea01' or PCO_ID='MetG01' or PCO_ID='Open01' or PCO_ID='Opti01' or PCO_ID='P9701' or PCO_ID='Phas01' or PCO_ID='Powe02' or PCO_ID='Rhom01' or PCO_ID='Secu01' or PCO_ID='Sewe01' or PCO_ID='Skyl01' or PCO_ID='Sofi01' or PCO_ID='Spea01' or PCO_ID='Trop01' or PCO_ID='Urge01' or PCO_ID='Ushr01' or PCO_ID='Vise01' or PCO_ID='Xfar01')

const SinglePCOTransactions = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const { selectedPCO } = useSelector((state: RootState) => state.pcos);
    const { transactions } = useSelector((state: RootState) => state.transactions);
    const [, setGridApi] = useState<GridApi>();
    const theme = useTheme();
    const [rowData, setRowData] = useState<Transaction[]>([]);

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
                headerName: 'LP Short Name',
                field: 'lpShortName',
                tooltipField: 'lpShortName',
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
                field: 'amountFundCurrency',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'amountFundCurrency',
                tooltipComponentParams: { valueType: 'number' },
                filter: 'agNumberColumnFilter',
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
            {
                headerName: 'Amount Local Currency',
                field: 'amountLocalCurrency',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'amountLocalCurrency',
                tooltipComponentParams: { valueType: 'number' },
                filter: 'agNumberColumnFilter',
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

    const onGridReady = (params: GridReadyEvent) => {
        setGridApi(params?.api);
    };

    const loadingOverlayRendererParams = useMemo(() => {
        return {
            loadingMessage: 'Loading Funds Overview...',
        };
    }, []);

    useEffect(() => {
        dispatch(fetchTransactions());
    }, [dispatch])

    useEffect(() => {
        if (selectedPCO && selectedPCO.lps && selectedPCO.lps.length > 0 && transactions) {
            let filteredData = transactions?.filter(item => item.pcoId === selectedPCO.id);
            filteredData = filteredData.map((item) => ({
                ...item,
                lpShortName: selectedPCO?.lps?.filter(x => x.id?.toLowerCase() === item.lpId?.toLowerCase())[0]?.shortName ?? ''
            }))
            setRowData(filteredData ?? []);
        }
    }, [transactions, selectedPCO])

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
                groupDisplayType={'singleColumn'}
                showOpenedGroup={true}
                suppressAggFuncInHeader={true}
            />
        </div>

    );
};


export default SinglePCOTransactions;
