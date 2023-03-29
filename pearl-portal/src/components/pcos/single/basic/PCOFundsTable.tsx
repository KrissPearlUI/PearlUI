import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { useSelector} from 'react-redux';
import {useTheme} from '@mui/material';
import {AgGridReact} from 'ag-grid-react';
import {GridApi, GridOptions, GridReadyEvent} from 'ag-grid-community';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import {ColDef, ColGroupDef, ValueSetterParams} from 'ag-grid-community/dist/lib/entities/colDef';
import { useAppDispatch } from '../../../../redux/store';
import { RootState } from '../../../../redux/slices/rootSlice';
import { LP } from '../../../../models/lps/lpModels';
import { getGridTheme, DefaultColumnDef,DefaultStatusPanelDef, quantityValueFormatter } from '../../../../helpers/agGrid';
import AGGridLoader from '../../../shared/AGGridLoader';
import { PCOSummary } from '../../../../models/pcos/pcoModels';


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
        }
    })
);

const PCOFundsTable = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const {funds} = useSelector((state: RootState) => state.funds);
    const {selectedPCO} = useSelector((state: RootState) => state.pcos);
    const [gridApi, setGridApi] = useState<GridApi>();
    const [value, setValue] = useState<string>('');
    const [hasError, setHasError] = useState(false);
    const [searchText, setSearchText] = useState<string | null>(null);
    const theme = useTheme();
    const [rowData,setRowData]=useState<any[]>([]);
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
                headerName: 'Id',
                field: 'id',
                enableRowGroup: true,
                valueGetter: (params) => {
                    return params.data?.id;
                },
                tooltipField: 'id',
                valueSetter: (params) => valueSetter(params, 'id'),
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
            },
            {
                headerName: 'Name',
                field: 'fundName',
                tooltipField: 'fundName',
                suppressFiltersToolPanel: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
            },
            {
                headerName: 'Committed Amount',
                field: 'amountInvested',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'amountInvested',
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
                valueFormatter: quantityValueFormatter,
            },
            {
                headerName: 'Currency',
                field:'fundCurrency',
                enableRowGroup: true,
                valueGetter: (params) => {
                    return params.data?.fundCurrency ? params.data?.fundCurrency.toUpperCase() : '';
                },
                valueSetter: (params) => valueSetter(params, 'fundCurrency'),
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
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
        if(selectedPCO && funds){
            const data=selectedPCO.funds?.map(fund=>({
                ...fund,
                fundCurrency:funds?.filter(x=>x.id===fund.id)[0]?.currency
            }));
            setRowData(data??[]);
        }
    },[selectedPCO, funds])

    return (
            <div className={clsx(getGridTheme(isDarkTheme), classes.fill)} style={{flex:1}}>
                <AgGridReact gridOptions={gridOptions}
                            columnDefs={getColumnDefs}
                            rowData={rowData}
                            domLayout={'autoHeight'}
                            onGridReady={onGridReady}
                            loadingOverlayComponentParams={loadingOverlayRendererParams}
                            loadingOverlayComponent={AGGridLoader}
                            tooltipShowDelay={0}
                            tooltipHideDelay={10000}
                            />
            </div>
            
    );
};


export default PCOFundsTable;