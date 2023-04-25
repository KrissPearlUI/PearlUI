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
//and (PCO_ID='Actn01' or PCO_ID='Agan01' or PCO_ID='Alph01' or PCO_ID='Elco01' or PCO_ID='Ensp01' or PCO_ID='Fido01' or PCO_ID='Futu01' or PCO_ID='GeoD01' or PCO_ID='Hydr01' or PCO_ID='Imag01' or PCO_ID='Libr01' or PCO_ID='Meea01' or PCO_ID='MetG01' or PCO_ID='Open01' or PCO_ID='Opti01' or PCO_ID='P9701' or PCO_ID='Phas01' or PCO_ID='Powe02' or PCO_ID='Rhom01' or PCO_ID='Secu01' or PCO_ID='Sewe01' or PCO_ID='Skyl01' or PCO_ID='Sofi01' or PCO_ID='Spea01' or PCO_ID='Trop01' or PCO_ID='Urge01' or PCO_ID='Ushr01' or PCO_ID='Vise01' or PCO_ID='Xfar01')

const CustomStatusBar = (props: any) => {
    const theme = useTheme();

    const sumCommittedAmount = () => {
        const api = props.api;
        let sumAmountFundCcy = 0;
        let sumAmountLocalCcy = 0;
        api.forEachNode((node: any) => {
            if (node.group) {
                return;
            }
            sumAmountFundCcy += Number(node.data.amountFundCurrency ?? 0);
            sumAmountLocalCcy += Number(node.data.amountLocalCurrency ?? 0);
        });
        return <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', flexDirection: 'row', flex: 1 }}>
            <span style={{ marginRight: '1em' }}>Total Amount Fund Ccy: <strong>{amountValueFormatter(sumAmountFundCcy ?? 0, '')}</strong></span>
            <span style={{ marginRight: '1em' }}>Total Amount Local Ccy: <strong>{amountValueFormatter(sumAmountLocalCcy ?? 0, '')}</strong></span>
        </div>
    };

    return (
        <div className="ag-status-bar" role="status">
            <div className="ag-status-bar-part ag-status-name-value" style={{ fontFamily: 'Raleway', color: theme.palette.mode === 'dark' ? 'white' : 'black', lineHeight: 1.5, fontWeight: 500 }}>
                {sumCommittedAmount()}
            </div>
        </div>
    );
};

interface SingleFundTransactionsProps {
    setGridApi: any
}

const SingleFundTransactions = ({ setGridApi }: SingleFundTransactionsProps) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const { selectedFund } = useSelector((state: RootState) => state.funds);
    const { transactions } = useSelector((state: RootState) => state.transactions);
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
                headerName: 'Transaction ID',
                headerTooltip:'Transaction ID',
                field: 'id',
                tooltipField: 'id',
                suppressFiltersToolPanel: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                filterParams: {
                    buttons: ['reset'],
                  } as INumberFilterParams,
            },
            {
                headerName: 'Date',
                headerTooltip:'Date of Transaction',
                field: 'date',
                enableRowGroup: true,
                filter: 'agDateColumnFilter',
                filterParams: dateFilterParams,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: dateValueFormatter,
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
                headerName: 'Investment Type',
                headerTooltip:'Investment type',
                field: 'investmentType',
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
                headerName: 'Security Type',
                headerTooltip:'Security Type',
                field: 'securityType',
                tooltipField:'securityType',
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                filterParams: {
                    buttons: ['reset'],
                  } as INumberFilterParams,
            },
            {
                headerName: 'Amount Fund Currency',
                headerTooltip:'Amount in Fund Currency',
                field: 'amountFundCurrency',
                enableRowGroup: true,
                type: 'numericColumn',
                enableValue: true,
                tooltipField: 'amountFundCurrency',
                tooltipComponentParams: { valueType: 'number' },
                filter: 'agNumberColumnFilter',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: quantityValueFormatter,
                filterParams: {
                    buttons: ['reset'],
                  } as INumberFilterParams,
            },
            {
                headerName: 'Amount Local Currency',
                headerTooltip:'Amount in PCO Currency',
                field: 'amountLocalCurrency',
                enableRowGroup: true,
                enableValue: true,
                type: 'numericColumn',
                tooltipField: 'amountLocalCurrency',
                tooltipComponentParams: { valueType: 'number' },
                filter: 'agNumberColumnFilter',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: quantityValueFormatter,
                filterParams: {
                    buttons: ['reset'],
                  } as INumberFilterParams,
            },
            {
                headerName: 'Forex NT',
                headerTooltip:'Forex NT',
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
                headerTooltip:'Pre Money Valuation',
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
                headerTooltip:'Post Money Valuation',
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
                headerTooltip:'Warrant Security Type',
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
                headerTooltip:'Warrant Strike',
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
                headerTooltip:'Due Date',
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
        if (selectedFund && selectedFund.pcos && selectedFund.pcos.length > 0 && transactions) {
            let filteredData = transactions?.filter(item => item.fundId === selectedFund.id);
            filteredData = filteredData.map((item) => ({
                ...item,
                pcoShortName: selectedFund?.pcos?.filter(x => x.id?.toLowerCase() === item?.pcoId?.toLowerCase())[0]?.shortName ?? '',
                lpShortName: selectedFund?.lps?.filter(x => x.id?.toLowerCase() === item.lpId?.toLowerCase())[0]?.shortName ?? ''
            }))
            setRowData(filteredData ?? []);
        }
    }, [transactions, selectedFund])

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
            />
        </div>

    );
};


export default SingleFundTransactions;
