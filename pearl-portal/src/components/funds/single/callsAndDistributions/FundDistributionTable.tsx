import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { DistributionBasic } from '../../../../models/distributions/distributionsModels';
import { fetchAllDistributions } from '../../../../redux/thunks/distributionsThunk';
import { capitalizeLetters } from '../../../../helpers/app';


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

const SingleFundDistributionsTable = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const { selectedFund } = useSelector((state: RootState) => state.funds);
    const { distributions } = useSelector((state: RootState) => state.distributions);
    const [gridApi, setGridApi] = useState<GridApi>();
    const theme = useTheme();
    const [rowData, setRowData] = useState<DistributionBasic[]>([]);

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
                headerName: 'Distribution ID',
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
                field: 'lpShortName',
                enableRowGroup: true,
                tooltipField:'lpShortName',
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
                field: 'lpId',
                enableRowGroup: true,
                hide: true,
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
                enableRowGroup: true,
                tooltipField:'pcoShortName',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                filterParams: {
                    buttons: ['reset'],
                  } as INumberFilterParams,
            },
            {
                headerName: 'Notice Date',
                field: 'noticeDate',
                enableRowGroup: true,
                filter: 'agDateColumnFilter',
                filterParams: dateFilterParams,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: dateValueFormatter,
            },
            {
                headerName: 'Distribution Date',
                field: 'distDate',
                filter: 'agDateColumnFilter',
                filterParams: dateFilterParams,
                enableRowGroup: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: dateValueFormatter,
            },
            {
                headerName: 'Amount',
                field: 'amount',
                enableRowGroup: true,
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
        dispatch(fetchAllDistributions());
    }, [dispatch])

    useEffect(() => {
        if (selectedFund && selectedFund.pcos && selectedFund.pcos.length > 0 && distributions) {
            let data = distributions?.filter(x => x.fundId === selectedFund.id);
            data = data.map((item) => ({
                ...item,
                pcoShortName: selectedFund?.pcos?.filter(x => x.id?.toLowerCase() === item.pcoId?.toLowerCase())[0]?.shortName ?? '',
                lpShortName: selectedFund?.lps?.filter(x => x.id?.toLowerCase() === item.lpId?.toLowerCase())[0]?.shortName ?? ''
            }))
            setRowData(data ?? []);
        }
    }, [distributions, selectedFund])

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


export default SingleFundDistributionsTable;
