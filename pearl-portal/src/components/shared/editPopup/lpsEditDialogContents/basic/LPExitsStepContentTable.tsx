import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { ColDef, ColGroupDef, ValueSetterParams } from 'ag-grid-community/dist/lib/entities/colDef';
import { RootState } from '../../../../../redux/slices/rootSlice';
import { Exits } from '../../../../../models/lps/lpModels';
import { dateValueFormatter, getGridTheme, DefaultColumnDef, DefaultStatusPanelDef, quantityValueFormatter } from '../../../../../helpers/agGrid';
import AGGridLoader from '../../../../shared/AGGridLoader';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useAppDispatch } from '../../../../../redux/store';
import { setEditChildDiaogOpen } from '../../../../../redux/slices/appSlice';
import { setSelectedExit } from '../../../../../redux/slices/lps/lpsSlice';

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


interface LPExitsStepContentTableProps {
    setEditPageName: any,
}

const LPExitsStepContentTable = ({setEditPageName}:LPExitsStepContentTableProps) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const { isDarkTheme, editChildDialogOpen } = useSelector((state: RootState) => state.app);
    const { selectedLP } = useSelector((state: RootState) => state.lps);
    const [, setGridApi] = useState<GridApi>();
    const theme = useTheme();
    const [rowData, setRowData] = useState<Exits[]>([]);
    const [editCommitmentDialogOpen, setEditCommitmentDialogOpen] = useState<boolean>(false);
    const [editialogOpen, setEditDialogOpen] = useState<boolean>(false);
    const [selectedExitLocal, setSelectedExitLocal] = useState<any>(null);

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

    const ButtonCellRenderer = (props: any) => {
      const handleEditClick = () => {
            if (props.data) {
                setSelectedExitLocal(props.data);
                setEditPageName('lpExits');
                setEditDialogOpen(!editChildDialogOpen);
                //handleOpenEditChildDialog('investments');
            }
        };
        return <span key={props.data.id} style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
            <EditRoundedIcon style={{ color: theme.palette.primary.main, width: '100%', alignSelf: 'center' }} onClick={() => handleEditClick()} />
        </span>;
    };

    const getColumnDefs = useMemo((): (ColDef | ColGroupDef)[] => {
        return [
            {
                headerName: 'Date',
                field: 'date',
                minWidth: 100,
                maxWidth: 140,
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
                headerName: 'Amount Returned',
                field: 'amountGained',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'amountGained',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: quantityValueFormatter,
            },
            {
                headerName: 'Currency',
                field: 'fundCurrency',
                enableRowGroup: true,
                minWidth: 90,
                maxWidth: 120,
                valueGetter: (params) => {
                    return params.data?.fundCurrency ? params.data?.fundCurrency.toUpperCase() : '';
                },
                valueSetter: (params) => valueSetter(params, 'fundCurrency'),
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
            },
            {
                headerName: '',
                maxWidth: 60,
                cellRenderer: 'buttonCellRenderer',
                editable: false
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
        setRowData(selectedLP?.exits ?? []);
    }, [selectedLP])

    useEffect(() => {
        if (selectedExitLocal && editialogOpen) {
            dispatch(setSelectedExit(selectedExitLocal));
            dispatch(setEditChildDiaogOpen(!editChildDialogOpen));
        }
    }, [selectedExitLocal, editialogOpen, dispatch])

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
                components={{
                    buttonCellRenderer: ButtonCellRenderer
                }}
            />
        </div>

    );
};


export default LPExitsStepContentTable;
