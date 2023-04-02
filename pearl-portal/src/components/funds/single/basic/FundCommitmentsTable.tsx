import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { ColDef, ColGroupDef, ValueSetterParams } from 'ag-grid-community/dist/lib/entities/colDef';
import { RootState } from '../../../../redux/slices/rootSlice';
import { CommitmentBasic } from '../../../../models/lps/lpModels';
import { dateValueFormatter, getGridTheme, DefaultColumnDef, DefaultStatusPanelDef, quantityValueFormatter } from '../../../../helpers/agGrid';
import AGGridLoader from '../../../shared/AGGridLoader';


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
        }
    })
);

const FundCommitmentsTable = () => {
    const classes = useStyles();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const { selectedLP } = useSelector((state: RootState) => state.lps);
    const [, setGridApi] = useState<GridApi>();
    const theme = useTheme();
    const [rowData, setRowData] = useState<CommitmentBasic[]>([]);

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
                headerName: 'Date',
                field: 'date',
                minWidth: 100,
                maxWidth: 150,
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: dateValueFormatter,
            },
            {
                headerName: 'Short Name',
                field: 'shortName',
                tooltipField: 'shortName',
                suppressFiltersToolPanel: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
            },
            {
                headerName: 'Committed Amount',
                field: 'committedAmount',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'committedAmount',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: quantityValueFormatter,
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
            },
        ];
    }, [theme]);

    const onGridReady = (params: GridReadyEvent) => {
        setGridApi(params?.api);
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

    useEffect(() => {
        setRowData(selectedLP?.commitments ?? []);
    }, [selectedLP])

    return (
        <div className={clsx(getGridTheme(isDarkTheme), classes.fill)} style={{ flex: 1 }}>
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


export default FundCommitmentsTable;
