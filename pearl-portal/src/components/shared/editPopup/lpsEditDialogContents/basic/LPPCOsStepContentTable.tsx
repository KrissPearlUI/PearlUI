import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';
import { RootState } from '../../../../../redux/slices/rootSlice';
import { PCO } from '../../../../../models/lps/lpModels';
import { getGridTheme, DefaultColumnDef, DefaultStatusPanelDef, percentageyValueFormatter } from '../../../../../helpers/agGrid';
import AGGridLoader from '../../../../shared/AGGridLoader';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useAppDispatch } from '../../../../../redux/store';
import { EditInvestment } from '../../../../../models/pcos/pcoModels';
import { setSelectedInvestment } from '../../../../../redux/slices/pcos/pcosSlice';
import { setEditChildDiaogOpen } from '../../../../../redux/slices/appSlice';

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


interface LPPCOsStepContentTableProps {
    setEditPageName: any,
}

const LPPCOsStepContentTable = ({setEditPageName}:LPPCOsStepContentTableProps) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const { isDarkTheme, editChildDialogOpen } = useSelector((state: RootState) => state.app);    
    const { selectedLP } = useSelector((state: RootState) => state.lps);
    const [, setGridApi] = useState<GridApi>();
    const theme = useTheme();
    const [rowData, setRowData] = useState<PCO[]>([]);
    const [editCommitmentDialogOpen, setEditCommitmentDialogOpen] = useState<boolean>(false);
    const [editialogOpen, setEditDialogOpen] = useState<boolean>(false);
    const [selectedInvetsmentLocal, setSelectedInvetsmentLocal] = useState<any>(null);

    const gridOptions: GridOptions = {
        defaultColDef: DefaultColumnDef,
        enableCellChangeFlash: true,
        enableRangeSelection: true,
        animateRows: true,
        pagination: true,
        paginationPageSize:5,
        enableCellTextSelection: true,
        groupDisplayType: 'multipleColumns',
        statusBar: DefaultStatusPanelDef,
    };

    const ButtonCellRenderer = (props: any) => {
        const handleEditClick = () => {
            if (props.data) {
                setEditPageName('lpPCOs');
                setEditDialogOpen(!editChildDialogOpen);
                const investment: EditInvestment = {
                    lpId: selectedLP?.id,
                    pcoId: props.data?.id,
                    participationPercentage: props.data?.participationPercentage
                }
                setSelectedInvetsmentLocal(investment);
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
                headerName: 'Short Name',
                field: 'shortName',
                tooltipField: 'fundName',
                suppressFiltersToolPanel: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
            },
            {
                headerName: 'Participation Percentage',
                field: 'participationPercentage',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'amountInvested',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: percentageyValueFormatter,
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


    const loadingOverlayRendererParams = useMemo(() => {
        return {
            loadingMessage: 'Loading Funds Overview...',
        };
    }, []);

    useEffect(() => {
        setRowData(selectedLP?.pcos ?? []);
    }, [selectedLP])


    useEffect(() => {
        if (selectedInvetsmentLocal && editialogOpen) {
            dispatch(setSelectedInvestment(selectedInvetsmentLocal));
            dispatch(setEditChildDiaogOpen(!editChildDialogOpen));
        }
    }, [selectedInvetsmentLocal, editialogOpen, dispatch])

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


export default LPPCOsStepContentTable;
