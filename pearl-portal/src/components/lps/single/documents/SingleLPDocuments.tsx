import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { useSelector} from 'react-redux';
import {Alert,Autocomplete,AutocompleteRenderInputParams,capitalize, Grid, IconButton, InputAdornment, Paper, Snackbar, TextField, Theme, ToggleButton, ToggleButtonGroup, Toolbar, Typography, useTheme,darken} from '@mui/material';
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


const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flex: 1,
            height: '100%',
            overflow:'hidden',
            marginRight:'1em'
        },
        fill: {
            flex: 1,
            width: '100%',
            height: '100%',
            paddingLeft:'0.4em',
            paddingBottom:'0.5em',
            marginLeft:'-0.1em'
        },
        toolbar: {
            padding: 5
        },
    })
);

const togglrBtnStyles = makeStyles((theme:Theme) =>
    createStyles({
    root: {
        border: 'none',
        boxShadow: 'none',
    },
    grouped: {
        '&:not(:first-child)': {
        borderRadius: theme.shape.borderRadius,
        },
        '&:first-child': {
        borderRadius: theme.shape.borderRadius,
        },
    }
}));

const SingleLPDocuments = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const btnStyles=togglrBtnStyles();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const {lps,selectedLP} = useSelector((state: RootState) => state.lps);
    const {funds} = useSelector((state: RootState) => state.funds);
    const [gridApi, setGridApi] = useState<GridApi>();
    const [value, setValue] = useState<string>('');
    const [hasError, setHasError] = useState(false);
    const [searchText, setSearchText] = useState<string | null>(null);
    const theme = useTheme();
    const [rowData,setRowData]=useState<Fund[]>([]);
    const [selectedLPValue, setSelectedLPValue] = useState<LP | null>(null);
    const [selectedPCOValue, setSelectedPCOValue] = useState<PCOSummary | null>(null);
    const [searchTextValue, setSearchTextValue] = useState<string | null>(null);
    const [selectedView,setSelectedView]=useState<string>('Contracts');

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
                headerName: 'Short',
                field: 'shortPCOName',
                tooltipField: 'shortPCOName',
                suppressFiltersToolPanel: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
                valueGetter: (params) => {
                    return params.data?.shortPCOName ? capitalizeLetters(params.data?.shortPCOName) : '';
                }
            },
            {
                headerName: 'PCO Name',
                field: 'pcoName',
                enableRowGroup: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
                valueGetter: (params) => {
                    return params.data?.pcoName ? capitalizeLetters(params.data?.pcoName) : '';
                }
            },
            {
                headerName: '1st Co-Investment',
                field:'firstCoinvestment',
                enableRowGroup: true,
                valueGetter: (params) => {
                    return params.data?.firstCoinvestment ? params.data?.firstCoinvestment.toUpperCase() : '';
                },
                valueSetter: (params) => valueSetter(params, 'firstCoinvestment'),
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
            },
            {
                headerName: 'Investment EUR',
                field: 'investmentEUR',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'investmentEUR',
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
                valueFormatter: quantityValueFormatter,
            },
            {
                headerName: 'NAV EUR',
                field: 'navEUR',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'navEUR',
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
                valueFormatter: quantityValueFormatter,
            },
            {
                headerName: 'Country',
                field: 'country',
                enableRowGroup: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
            },
            {
                headerName: 'Industry',
                field: 'industry',
                enableRowGroup: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
            },
            {
                headerName: 'Stage',
                field: 'stage',
                enableRowGroup: true,
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


    const handleChangeVaue=(value:any)=>{
        setSelectedView(value);
    };

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
        setRowData(selectedLP?.funds??[]);
    },[selectedLP])

    return (
            <Grid container
                  style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      flexDirection: 'column',
                      flex: 1,
                      height: '100%',
                      overflow:'hidden',
                      marginRight:'1em',
                      marginTop:'-1em'
                  }}>
                    <Toolbar variant="dense" disableGutters className={classes.toolbar}>
                        <Grid container
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                width: '100%'
                            }}>
                            <Grid item style={{flex: 1}}>
                                <ToggleButtonGroup
                                    size="small"
                                    exclusive
                                    style={{cursor: 'pointer'}}
                                    classes={{
                                        root: btnStyles.root,
                                        grouped: btnStyles.grouped,
                                      }}
                                    value={selectedView}
                                    onChange={(e, value) => {
                                        if (value) {
                                            handleChangeVaue(value);
                                        }
                                    }}>
                                    <ToggleButton value="Contracts" sx={{
                                        textTransform: 'none',
                                        fontSize: 14,
                                        height: 32,
                                        width: 154,
                                        cursor: 'pointer',
                                        backgroundColor: 'transparent',
                                        borderLeft:'none',
                                        borderTop:'none',
                                        borderRight:'none',
                                        borderRadius:0,
                                        borderBottom: selectedView === 'Contracts' ? `1px solid ${theme.palette.primary.main}`: 'none',
                                       '&:hover':{
                                        backgroundColor: selectedView === 'Contracts' ? theme.palette.grey[500]: 'none',
                                       }
                                    }}>
                                        <Typography style={{
                                            padding: '0.1em', fontWeight: 800, fontSize: '12px',
                                            color: theme.palette.primary.main 
                                        }}
                                                    variant={'body2'}> {'Contracts'}</Typography>

                                    </ToggleButton>
                                    <ToggleButton value="Companies"
                                                sx={{
                                                    textTransform: 'none',
                                                    fontSize: 14,
                                                    height: 32,
                                                    width: 154,
                                                    backgroundColor: 'transparent',
                                                    borderLeft:'none',
                                                    borderTop:'none',
                                                    borderRight:'none',
                                                    borderRadius:0,
                                                    borderBottom: selectedView === 'Companies' ? `1px solid ${theme.palette.primary.main}`: 'none',
                                                    '&:hover':{
                                                        backgroundColor: selectedView === 'Companies' ? theme.palette.grey[500]: 'none',
                                                       }
                                                }}>
                                        <Typography style={{
                                            padding: '0.1em', fontWeight: 800, fontSize: '12px',
                                            color: theme.palette.primary.main 
                                        }}
                                                    variant={'body2'}> {'Companies'}</Typography>
                                    </ToggleButton>
                                    <ToggleButton value="Reports"
                                                sx={{
                                                    textTransform: 'none',
                                                    fontSize: 14,
                                                    height: 32,
                                                    width: 154,
                                                    backgroundColor: 'transparent',
                                                    borderLeft:'none',
                                                    borderTop:'none',
                                                    borderRight:'none',
                                                    borderRadius:0,
                                                    borderBottom: selectedView === 'Reports' ? `1px solid ${theme.palette.primary.main}`: 'none',
                                                    '&:hover':{
                                                        backgroundColor: selectedView === 'Reports' ? theme.palette.grey[500]: 'none',
                                                       }
                                                }}>
                                        <Typography style={{
                                            padding: '0.1em', fontWeight: 800, fontSize: '12px',
                                            color: theme.palette.primary.main 
                                        }}
                                                    variant={'body2'}> {'Reports'}</Typography>
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                        </Grid>
                    </Toolbar>
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
            </Grid>
            
    );
};


export default SingleLPDocuments;
