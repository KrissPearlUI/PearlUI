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


const PCOInvestmentsTableComponent = () => {
    const classes = useStyles();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const { selectedPCO } = useSelector((state: RootState) => state.pcos);
    const { funds } = useSelector((state: RootState) => state.funds);
    const { transactions } = useSelector((state: RootState) => state.transactions);
    const [, setGridApi] = useState<GridApi>();
    const theme = useTheme();
    const [rowData, setRowData] = useState<any[]>([]);

    const gridOptions: GridOptions = {
        defaultColDef: DefaultColumnDef,
        enableCellChangeFlash: true,
        enableRangeSelection: true,
        animateRows: true,
        pagination: true,
        paginationPageSize: 5,
        enableCellTextSelection: true,
        groupDisplayType: 'multipleColumns',
        statusBar: DefaultStatusPanelDef,
    };

    const getColumnDefs = useMemo((): (ColDef | ColGroupDef)[] => {
        return [
            {
                headerName: 'Date',
                headerTooltip:'Date Investment',
                field: 'date',
                minWidth: 100,
                maxWidth: 140,
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: dateValueFormatter,
            },
            {
                headerName: 'Short Name',
                headerTooltip:'Fund Short Name',
                field: 'shortName',
                tooltipField: 'shortName',
                suppressFiltersToolPanel: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
            },
            {
                headerName: 'Amount Invested',
                headerTooltip:'Amount Invetsed',
                field: 'amountLocalCurrency',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'amountLocalCurrency',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: quantityValueFormatter,
            },
            {
                headerName: 'Local Currency',
                headerTooltip:'Portfolio Company Currency',
                field: 'localCcy',
                minWidth:90,
                maxWidth:120,
                enableRowGroup: true,
                valueGetter: (params) => {
                    return params.data?.localCcy ? params.data?.localCcy.toUpperCase() : '';
                },
                valueSetter: (params) => valueSetter(params, 'localCcy'),
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


    useEffect(() => {
        if (transactions && selectedPCO && funds) {
            const data = transactions.filter(x => x.pcoId === selectedPCO.id)?.map(item => ({
                ...item,
                shortName: funds?.filter(x => x.id === item.fundId)[0]?.shortName ?? '',
                fundCcy: funds?.filter(x => x.id === item.fundId)[0]?.currency ?? '',
                localCcy: selectedPCO.localCurrency ?? ''
            }))

            setRowData(data)
        }
    }, [transactions, selectedPCO, funds]);


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


export default PCOInvestmentsTableComponent;
