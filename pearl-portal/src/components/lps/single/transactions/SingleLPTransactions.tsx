import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { useSelector} from 'react-redux';
import {Alert,Autocomplete,AutocompleteRenderInputParams,capitalize, Grid, IconButton, InputAdornment, Paper, Snackbar, TextField, useTheme} from '@mui/material';
import {AgGridReact} from 'ag-grid-react';
import {GridApi, GridOptions, GridReadyEvent, ICellRendererParams, ValueGetterParams} from 'ag-grid-community';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import {ColDef, ColGroupDef, ValueSetterParams} from 'ag-grid-community/dist/lib/entities/colDef';
import { useAppDispatch } from '../../../../redux/store';
import { RootState } from '../../../../redux/slices/rootSlice';
import { Fund, LP, PCO } from '../../../../models/lps/lpModels';
import { FundSummary } from '../../../../models/funds/fundModels';
import { dateValueFormatter, DefaultSideBarDef, getGridTheme, DefaultColumnDef,DefaultStatusPanelDef, quantityValueFormatter, percentageyValueFormatter } from '../../../../helpers/agGrid';
import AGGridLoader from '../../../shared/AGGridLoader';
import { PCOSummary } from '../../../../models/pcos/pcoModels';
import { capitalizeLetters } from '../../../../helpers/app';
import { fetchTransactions } from '../../../../redux/thunks/transactionsThunk';
import { Transaction } from '../../../../models/transactions/transactionsModels';


const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flex: 1,
            overflow:'hidden',
        },
        fill: {
            flex: 1,
            width: '100%',
            height: '100%',
            paddingRight:'0.7em'
        }
    })
);
//and (PCO_ID='Actn01' or PCO_ID='Agan01' or PCO_ID='Alph01' or PCO_ID='Elco01' or PCO_ID='Ensp01' or PCO_ID='Fido01' or PCO_ID='Futu01' or PCO_ID='GeoD01' or PCO_ID='Hydr01' or PCO_ID='Imag01' or PCO_ID='Libr01' or PCO_ID='Meea01' or PCO_ID='MetG01' or PCO_ID='Open01' or PCO_ID='Opti01' or PCO_ID='P9701' or PCO_ID='Phas01' or PCO_ID='Powe02' or PCO_ID='Rhom01' or PCO_ID='Secu01' or PCO_ID='Sewe01' or PCO_ID='Skyl01' or PCO_ID='Sofi01' or PCO_ID='Spea01' or PCO_ID='Trop01' or PCO_ID='Urge01' or PCO_ID='Ushr01' or PCO_ID='Vise01' or PCO_ID='Xfar01')

const SingleLPTransactions = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const {lps,selectedLP} = useSelector((state: RootState) => state.lps);
    const {transactions} = useSelector((state: RootState) => state.transactions);
    const [gridApi, setGridApi] = useState<GridApi>();
    const [value, setValue] = useState<string>('');
    const [hasError, setHasError] = useState(false);
    const [searchText, setSearchText] = useState<string | null>(null);
    const theme = useTheme();
    const [rowData,setRowData]=useState<Transaction[]>([]);
    const [selectedLPValue, setSelectedLPValue] = useState<LP | null>(null);
    const [selectedPCOValue, setSelectedPCOValue] = useState<PCOSummary | null>(null);
    const [searchTextValue, setSearchTextValue] = useState<string | null>(null);

    const gridOptions: GridOptions = {
        defaultColDef: DefaultColumnDef,
        enableCellChangeFlash: true,
        enableRangeSelection: true,
        animateRows: true,
        pagination: true,
        enableCellTextSelection: true,
        groupDisplayType: 'multipleColumns',
        statusBar: DefaultStatusPanelDef,
    };

    const getColumnDefs = useMemo((): (ColDef | ColGroupDef)[] => {
        return [
            {
                headerName: 'Transaction ID',
                field: 'id',
                tooltipField: 'id',
                suppressFiltersToolPanel: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
            },
            {
                headerName: 'Date',
                field: 'date',
                enableRowGroup: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
                valueFormatter: dateValueFormatter,
            },
            {
                headerName: 'Fund ID',
                field: 'fundId',
                enableRowGroup: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
            },
            {
                headerName: 'Investment Type',
                field: 'investmentType',
                enableRowGroup: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
            },
            {
                headerName: 'PCO ID',
                field: 'pcoId',
                enableRowGroup: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
            },
            {
                headerName: 'Security Type',
                field: 'securityType',
                enableRowGroup: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
            },
            {
                headerName: 'Amount Fund Currency',
                field: 'amountFundCurrency',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'amountFundCurrency',
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
                valueFormatter: quantityValueFormatter,
            },
            {
                headerName: 'Amount Local Currency',
                field: 'amountLocalCurrency',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'amountLocalCurrency',
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
                valueFormatter: quantityValueFormatter,
            },
            {
                headerName: 'Forex NT',
                field: 'forexNT',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'forexNT',
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
                valueFormatter: quantityValueFormatter,
            },
            {
                headerName: 'Pre Money Valuation',
                field: 'preMoneyValuation',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'preMoneyValuation',
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
                valueFormatter: quantityValueFormatter,
            },
            {
                headerName: 'Post Money Valuation',
                field: 'postMoneyValuation',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'postMoneyValuation',
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
                valueFormatter: quantityValueFormatter,
            },
            {
                headerName: 'Warrant Security Type',
                field: 'warrantSecurityType',
                enableRowGroup: true,
                hide:true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
            },
            {
                headerName: 'Warrant Strike',
                field: 'warrantStrike',
                enableRowGroup: true,
                hide:true,
                type: 'numericColumn',
                tooltipField: 'warrantStrike',
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
                valueFormatter: quantityValueFormatter,
            },
            {
                headerName: 'Due Date',
                field: 'dueDate',
                hide:true,
                enableRowGroup: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
                valueFormatter: dateValueFormatter,
            },
        ];
    }, [theme]);

    const onValueChange =  useCallback((event: any) => {
        setSearchTextValue(event.target.value)
        if(gridApi){
            gridApi.setQuickFilter(event.target.value);
        }
    },[gridApi]);

    const onCancelClick = useCallback(() => {
        setSearchTextValue('');
        if(gridApi){
            gridApi.setQuickFilter('');
        }
    },[gridApi]);

    const onGridReady = (params:GridReadyEvent) => {
        setGridApi(params?.api);
    };

    const valueSetter = (params:ValueSetterParams, field:string) => {
        const value = params.newValue;
        const data = params.data;
        if (data[field] !== value) {
            data[field] = value;
            return true;
        } else {
            return false;
        }
    };

    const handleClose = () => {
        setHasError(false);
    };

    const loadingOverlayRendererParams = useMemo(() => {
        return {
            loadingMessage: 'Loading Funds Overview...',
        };
    }, []);

   /*  const autoGroupColumnDef = useMemo<ColDef>(() => {
        return {
          minWidth: 300,
          cellRendererParams: {
            footerValueGetter: (params: any) => {
              const isRootLevel = params.node.level === -1;
              if (isRootLevel) {
                return 'Total';
              }
              else
               return `Sub Total (${params.value})`;
            },
          },
        };
      }, []);

      const createData: (count: number, gridApi:GridApi|null) => any[] = (
        count: number,
      ) => {
        var result: any[] = [];
        for (var i = 0; i < count; i++) {
          result.push({
            short: 'Total',
            name: gridApi?gridApi.paginationGetRowCount():0,
            totalCommitments: count,
            totalInvestments:count,
            reservesFees:count,
          });
        }
        return result;
      };

      const pinnedBottomRowData = useMemo<any[]>(() => {
        return createData(1, gridApi??null);
      }, [gridApi]);
 */

    useEffect(()=>{
        dispatch(fetchTransactions());
    },[dispatch])

    useEffect(()=>{
        if(selectedLP && transactions){
            const filteredData = transactions?.filter(item =>item.lpId===selectedLP.id);
            
            setRowData(filteredData??[]);
        }
    },[transactions,selectedLP])

    return (
            <div className={clsx(getGridTheme(isDarkTheme), classes.fill)} style={{flex:1}}>
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


export default SingleLPTransactions;
