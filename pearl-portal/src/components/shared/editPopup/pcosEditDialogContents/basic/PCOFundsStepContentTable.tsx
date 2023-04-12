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
import { getGridTheme, DefaultColumnDef, DefaultStatusPanelDef, quantityValueFormatter } from '../../../../../helpers/agGrid';
import AGGridLoader from '../../../../shared/AGGridLoader';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { setSelectedInvestment } from '../../../../../redux/slices/pcos/pcosSlice';
import { useAppDispatch } from '../../../../../redux/store';
import { setEditChildDiaogOpen } from '../../../../../redux/slices/appSlice';
import { EditInvestment } from '../../../../../models/pcos/pcoModels';

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

interface PCOInvestmentsStepContentTableComponentProps {
    setEditPageName: any,
}

const PCOFundsStepContentTable = ({ setEditPageName }: PCOInvestmentsStepContentTableComponentProps) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const { isDarkTheme, editChildDialogOpen } = useSelector((state: RootState) => state.app);
    const { funds } = useSelector((state: RootState) => state.funds);
    const { selectedPCO } = useSelector((state: RootState) => state.pcos);
    const [, setGridApi] = useState<GridApi>();
    const theme = useTheme();
    const [rowData, setRowData] = useState<any[]>([]);
    const [editCommitmentDialogOpen, setEditCommitmentDialogOpen] = useState<boolean>(false);
    const [editialogOpen, setEditDialogOpen] = useState<boolean>(false);
    const [selectedInvestmentLocal, setSelectedInvestmentLocal] = useState<any>(null);

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
                setEditPageName('pcoFunds');
                setEditDialogOpen(!editChildDialogOpen);
                const investment: EditInvestment = {
                    pcoId: selectedPCO?.id,
                    fundId: props.data?.id,
                    amountInvested: props.data?.amountInvested
                }
                setSelectedInvestmentLocal(investment);                //handleOpenEditChildDialog('investments');
            }
        };

        return <span key={props.data.id} style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
            <EditRoundedIcon style={{ color: theme.palette.primary.main, width: '100%', alignSelf: 'center' }} onClick={() => handleEditClick()} />
        </span>;
    };

    const getColumnDefs = useMemo((): (ColDef | ColGroupDef)[] => {
        return [
            {
                headerName: 'Id',
                field: 'id',
                minWidth: 90,
                maxWidth: 100,
                enableRowGroup: true,
                valueGetter: (params) => {
                    return params.data?.id;
                },
                tooltipField: 'id',
                valueSetter: (params) => valueSetter(params, 'id'),
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
            },
            {
                headerName: 'Name',
                field: 'fundName',
                tooltipField: 'fundName',
                suppressFiltersToolPanel: true,
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
            },
            {
                headerName: 'Committed Amount',
                field: 'amountInvested',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'amountInvested',
                cellStyle: { fontFamily: 'Raleway', color: theme.palette.text.primary },
                valueFormatter: quantityValueFormatter,
            },
            {
                headerName: 'Currency',
                field: 'fundCurrency',
                minWidth: 90,
                maxWidth: 120,
                enableRowGroup: true,
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
        if (selectedPCO && funds) {
            const data = selectedPCO.funds?.map(fund => ({
                ...fund,
                fundCurrency: funds?.filter(x => x.id === fund.id)[0]?.currency
            }));
            setRowData(data ?? []);
        }
    }, [selectedPCO, funds])

    useEffect(() => {
        if (selectedInvestmentLocal && editialogOpen) {
            dispatch(setSelectedInvestment(selectedInvestmentLocal));
            dispatch(setEditChildDiaogOpen(!editChildDialogOpen));
        }
    }, [selectedInvestmentLocal, editialogOpen, dispatch])

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


export default PCOFundsStepContentTable;
