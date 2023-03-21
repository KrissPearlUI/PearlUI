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
import { CommitmentBasic, Fund, LP, PCO } from '../../../../models/lps/lpModels';
import { FundSummary } from '../../../../models/funds/fundModels';
import { dateValueFormatter, DefaultSideBarDef, getGridTheme, DefaultColumnDef,DefaultStatusPanelDef, quantityValueFormatter, percentageyValueFormatter } from '../../../../helpers/agGrid';
import AGGridLoader from '../../../shared/AGGridLoader';
import { PCOSummary } from '../../../../models/pcos/pcoModels';
import { fetchCashCalls } from '../../../../redux/thunks/cashCallsThunk';
import { CashCall } from '../../../../models/cashCalls/cashCallsModels';
import { DistributionBasic } from '../../../../models/distributions/distributionsModels';
import { fetchAllDistributions } from '../../../../redux/thunks/distributionsThunk';


const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flex: 1,
            height:'100%',
            overflow:'hidden',
        },
        fill: {
            flex: 1,
            width: '100%',
            height: '100%',
        }
    })
);

const SingleLPDistributionsTable = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const {lps,selectedLP} = useSelector((state: RootState) => state.lps);
    const {distributions} = useSelector((state: RootState) => state.distributions);
    const [gridApi, setGridApi] = useState<GridApi>();
    const [value, setValue] = useState<string>('');
    const [hasError, setHasError] = useState(false);
    const [searchText, setSearchText] = useState<string | null>(null);
    const theme = useTheme();
    const [rowData,setRowData]=useState<DistributionBasic[]>([]);
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
                headerName: 'Distribution ID',
                field: 'id',
                tooltipField: 'id',
                suppressFiltersToolPanel: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
            },
            {
                headerName: 'Fund ID',
                field: 'fundId',
                enableRowGroup: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
            },
            {
                headerName: 'LP ID',
                field: 'lpId',
                enableRowGroup: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
            },
            {
                headerName: 'LP Type',
                field: 'lpType',
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
                headerName: 'Notice Date',
                field: 'noticeDate',
                enableRowGroup: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
                valueFormatter: dateValueFormatter,
            },
            {
                headerName: 'Distribution Date',
                field: 'distDate',
                enableRowGroup: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
                valueFormatter: dateValueFormatter,
            },
            {
                headerName: 'Amount',
                field: 'amount',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'amount',
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
                valueFormatter: quantityValueFormatter,
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
        dispatch(fetchAllDistributions());
    },[dispatch])

    useEffect(()=>{
        setRowData(distributions?.filter(x=>x.lpId===selectedLP?.id)??[]);
    },[distributions,selectedLP])

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


export default SingleLPDistributionsTable;
