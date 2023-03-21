import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { useSelector} from 'react-redux';
import {Accordion, AccordionDetails, AccordionSummary, Alert,Autocomplete,AutocompleteRenderInputParams,capitalize, Grid, IconButton, InputAdornment, Paper, Snackbar, TextField, ToggleButton, ToggleButtonGroup, Toolbar, Typography, useTheme} from '@mui/material';
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fetchPCOs } from '../../../../redux/thunks/pcoThunk';
import moment from 'moment';

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
        },
        toolbar: {
            padding: 5
        },
    })
);

const SingleLPPortfolios = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const {lps,selectedLP} = useSelector((state: RootState) => state.lps);
    const {pcos} = useSelector((state: RootState) => state.pcos);
    const [gridApi, setGridApi] = useState<GridApi>();
    const [value, setValue] = useState<string>('');
    const [hasError, setHasError] = useState(false);
    const [searchText, setSearchText] = useState<string | null>(null);
    const theme = useTheme();
    const [rowData,setRowData]=useState<any[]>([]);
    const [selectedLPValue, setSelectedLPValue] = useState<LP | null>(null);
    const [selectedPCOValue, setSelectedPCOValue] = useState<PCOSummary | null>(null);
    const [searchTextValue, setSearchTextValue] = useState<string | null>(null);
    const [selectedView,setSelectedView]=useState<string>('Calls');

    const gridOptions: GridOptions = {
        defaultColDef: DefaultColumnDef,
        enableCellChangeFlash: true,
        enableRangeSelection: true,
        animateRows: true,
        pagination: true,
        enableCellTextSelection: true,
        groupDisplayType: 'multipleColumns',
        sideBar: DefaultSideBarDef,
        statusBar: DefaultStatusPanelDef,
    };

    const getColumnDefs = useMemo((): (ColDef | ColGroupDef)[] => {
        return [
            {
                headerName: 'Short',
                field: 'shortName',
                tooltipField: 'shortName',
                suppressFiltersToolPanel: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
                valueGetter: (params) => {
                    return params.data?.shortName ? capitalizeLetters(params.data?.shortName) : '';
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
                field:'dateFirstInvestment',
                enableRowGroup: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
                valueFormatter: dateValueFormatter,
            },
            {
                headerName: 'Investment EUR',
                field: 'amountInvested',
                enableRowGroup: true,
                type: 'numericColumn',
                tooltipField: 'amountInvested',
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
                headerName: 'Industry 1',
                field: 'industry1',
                enableRowGroup: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
            },
            {
                headerName: 'Industry 2',
                field: 'industry2',
                hide:true,
                enableRowGroup: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
            },
            {
                headerName: 'Industry 3',
                field: 'industry3',
                hide:true,
                enableRowGroup: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
            },
            {
                headerName: 'Industry 4',
                field: 'industry4',
                hide:true,
                enableRowGroup: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
            },
            {
                headerName: 'Current Stage',
                field: 'currentStage',
                enableRowGroup: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
            },
            {
                headerName: 'Initial Stage',
                field: 'initialtStage',
                hide:true,
                enableRowGroup: true,
                cellStyle: {fontFamily: 'Raleway', color: theme.palette.text.primary},
            },
            {
                headerName: 'Date Exit',
                field:'dateExit',
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
        dispatch(fetchPCOs());
    },[dispatch])

    useEffect(()=>{
        if(selectedLP && pcos &&selectedLP.pcos&& selectedLP.pcos?.length>0){
            let data = selectedLP.pcos.map(pco=>({
                ...pco,
                pcoName: pcos.filter(x=>x.id===pco.id)[0]?.pcoName??'',
                country: pcos.filter(x=>x.id===pco.id)[0]?.country??'',
                dateFirstInvestment: pcos.filter(x=>x.id===pco.id)[0]?.dateInitalInvestment ??'',
                currentStage: pcos.filter(x=>x.id===pco.id)[0]?.currentStage??'',
                initalStage: pcos.filter(x=>x.id===pco.id)[0]?.initialStage??'',
                dateExit: pcos.filter(x=>x.id===pco.id)[0]?.dateExit ??'',
                industry1: pcos.filter(x=>x.id===pco.id)[0]?.industry1,
                industry2: pcos.filter(x=>x.id===pco.id)[0]?.industry2,
                industry3: pcos.filter(x=>x.id===pco.id)[0]?.industry3,
                industry4: pcos.filter(x=>x.id===pco.id)[0]?.industry4
            }
            ));
            setRowData(data??[]);
        }
    },[selectedLP,pcos])

    return (
        <Grid container spacing={1} sx={{display:'flex', justifyContent:'flex-start',alignItems:'flex-start', flex:1,overflow:'hidden', height:'100%'}}>
            <Grid container item xs={12} md={12} lg={8} sx={{height:'100%',overflow:'hidden'}}>
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
            </Grid>
            <Grid item xs={12} md={12} lg={4} sx={{height:'100%',overflow:'hidden', display:'flex', flexDirection:'column', flex:1, paddingRight:'0.7em'}}>
                <Paper elevation={3} key={`card`} style={{marginBottom: '1em'}}>
                    <Accordion>
                        <AccordionSummary
                        sx={{'minHeight': '60px !important'}}
                        expandIcon={
                            <IconButton>
                                <ExpandMoreIcon
                                    sx={{pointerEvents: 'auto', cursor: 'pointer'}}/>
                            </IconButton>
                    }>
                            <Typography variant='body1' sx={{color:theme.palette.text.primary, fontWeight:600}}>Portfolio by Stage</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            
                        </AccordionDetails>
                    </Accordion>
                </Paper>
                <Paper elevation={3} key={`card`} style={{marginBottom: '1em'}}>
                    <Accordion>
                        <AccordionSummary 
                        sx={{'minHeight': '60px !important'}}
                        expandIcon={
                            <IconButton>
                                <ExpandMoreIcon
                                    sx={{pointerEvents: 'auto', cursor: 'pointer'}}/>
                            </IconButton>
                    }>
                            <Typography variant='body1' sx={{color:theme.palette.text.primary, fontWeight:600}}>Portfolio by Country</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            
                        </AccordionDetails>
                    </Accordion>
                </Paper>
                <Paper elevation={3} key={`card`} style={{marginBottom: '1em'}}>
                    <Accordion>
                        <AccordionSummary 
                        sx={{'minHeight': '60px !important'}}
                        expandIcon={
                            <IconButton>
                                <ExpandMoreIcon
                                    sx={{pointerEvents: 'auto', cursor: 'pointer'}}/>
                            </IconButton>
                    }>
                            <Typography variant='body1' sx={{color:theme.palette.text.primary, fontWeight:600}}>Portfolio by Industry</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            
                        </AccordionDetails>
                    </Accordion>
                </Paper>
                <Paper elevation={3} key={`card`} style={{marginBottom: '1em'}}>
                    <Accordion>
                        <AccordionSummary 
                        sx={{'minHeight': '60px !important'}}
                        expandIcon={
                            <IconButton>
                                <ExpandMoreIcon
                                    sx={{pointerEvents: 'auto', cursor: 'pointer'}}/>
                            </IconButton>
                    }>
                            <Typography variant='body1' sx={{color:theme.palette.text.primary, fontWeight:600}}>Investments Over Time</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            
                        </AccordionDetails>
                    </Accordion>
                </Paper>
            </Grid>
            </Grid>
    );
};


export default SingleLPPortfolios;
