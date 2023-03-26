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
import { fetchPCOs, fetchPCOsFinantials } from '../../../../redux/thunks/pcoThunk';
import moment from 'moment';
import { setPCOsExtended } from '../../../../redux/slices/lps/lpsSlice';
import { fetchTransactions } from '../../../../redux/thunks/transactionsThunk';
import PortfolioByStage from '../../../lps/single/portfolios/PortfolioByStage';
import PortfolioByCountry from '../../../lps/single/portfolios/PortfolioByCountry';
import PortfolioByIndustry from '../../../lps/single/portfolios/PortfolioByIndustry';
import InvestmentsOverTime from '../../../lps/single/portfolios/InvestmentsOverTime';

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

const SingleFundPortfolios = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const {selectedFund} = useSelector((state: RootState) => state.funds);
    const {pcos, pcosFinancials} = useSelector((state: RootState) => state.pcos);
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
    const [isPortfolioByCountryExpand, setIsPortfolioByCountryExpand]=useState<boolean>(false);
    const [isPortfolioByStageExpand, setIsPortfolioByStageExpand]=useState<boolean>(false);
    const [isPortfolioByIndustryExpand, setIsPortfolioByIndustryExpand]=useState<boolean>(false);
     const [isPortfolioByInvestmentsExpand, setIsPortfolioByInvestmentExpand]=useState<boolean>(false);

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
                headerName: '1st Investment',
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


    const handleAccordionExp=(expanded: boolean, accordionId: string)=> {
        if(accordionId==='card-countries'){
            setIsPortfolioByCountryExpand(!isPortfolioByCountryExpand);
        } else if(accordionId==='card-stage'){
            setIsPortfolioByStageExpand(!isPortfolioByStageExpand);
        } else if(accordionId==='card-industry'){
            setIsPortfolioByIndustryExpand(!isPortfolioByIndustryExpand);
        } else{
            setIsPortfolioByInvestmentExpand(!isPortfolioByInvestmentsExpand);
        }
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
        dispatch(fetchPCOsFinantials());
        dispatch(fetchTransactions());
    },[dispatch])

    useEffect(()=>{
        if(selectedFund && pcos &&selectedFund.pcos&& selectedFund.pcos?.length>0 && pcosFinancials?.length>0){
            let data = selectedFund.pcos.map(pco=>({
                ...pco,
                pcoName: pcos.filter(x=>x.id===pco.id)[0]?.pcoName??'',
                country: pcos.filter(x=>x.id===pco.id)[0]?.country??'',
                dateFirstInvestment: pcos.filter(x=>x.id===pco.id)[0]?.dateInitalInvestment ??'',
                currentStage: pcos.filter(x=>x.id===pco.id)[0]?.currentStage??'',
                initalStage: pcos.filter(x=>x.id===pco.id)[0]?.initialStage??'',
                dateExit: pcos.filter(x=>x.id===pco.id)[0]?.dateExit ??'',
                emeraldIndustry1: pcos.filter(x=>x.id===pco.id)[0]?.emeraldIndustry1,
                emeraldIndustry2: pcos.filter(x=>x.id===pco.id)[0]?.emeraldIndustry2,
                navEUR: pcosFinancials.filter(x=>x.pcoId===pco.id)[0]?.sumNavFundCcy??0
            }
            ));
            setRowData(data??[]);
            dispatch(setPCOsExtended(data))
        }
    },[selectedFund,pcos,pcosFinancials])

    return (
        <Grid container spacing={1} sx={{display:'flex', justifyContent:'flex-start',alignItems:'flex-start', flex:1,overflow:'auto', height:'100%'}}>
            <Grid container item xs={12} md={12} lg={8} sx={{height:'100%',overflow:'auto'}}>
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
            <Grid item xs={12} md={12} lg={4} sx={{height:'100%',overflow:'auto', display:'flex', flexDirection:'column', flex:1, paddingRight:'0.7em'}}>
                <Paper elevation={3} key={`card`} style={{marginBottom: '1em'}}>
                    <Accordion key={`card-stage`}
                                expanded={isPortfolioByStageExpand}
                                onChange={(event, expanded: boolean) => handleAccordionExp(expanded, 'card-stage')}
                                sx={{
                                    display:'flex',
                                    flex:1,
                                    width: '100%',
                                    height:'100%',
                                    flexDirection: 'column'}}>
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
                        <AccordionDetails style={{
                        width: '100%', display: 'flex', flex: 1, height: '100%', minHeight:'200px'
                    }}>
                            {isPortfolioByStageExpand && <PortfolioByStage/>}
                        </AccordionDetails>
                    </Accordion>
                </Paper>
                <Paper elevation={3} key={`card`} style={{marginBottom: '1em'}}>
                    <Accordion key={`card-countries`}
                                expanded={isPortfolioByCountryExpand}
                                onChange={(event, expanded: boolean) => handleAccordionExp(expanded, 'card-countries')}
                                sx={{
                                    display:'flex',
                                    flex:1,
                                    width: '100%',
                                    height:'100%',
                                    flexDirection: 'column'}}>
                        <AccordionSummary 
                        sx={{height: '60px'}}
                        expandIcon={
                            <IconButton>
                                <ExpandMoreIcon
                                    sx={{pointerEvents: 'auto', cursor: 'pointer'}}/>
                            </IconButton>
                    }>
                            <Typography variant='body1' sx={{color:theme.palette.text.primary, fontWeight:600}}>Portfolio by Country</Typography>
                        </AccordionSummary>
                        <AccordionDetails style={{
                        width: '100%', display: 'flex', flex: 1, height: '100%', minHeight:'200px'
                    }}>
                            {isPortfolioByCountryExpand && <PortfolioByCountry/>}
                        </AccordionDetails>
                    </Accordion>
                </Paper>
                <Paper elevation={3} key={`card`} style={{marginBottom: '1em'}}>
                    <Accordion key={`card-industry`}
                                expanded={isPortfolioByIndustryExpand}
                                onChange={(event, expanded: boolean) => handleAccordionExp(expanded, 'card-industry')}
                                sx={{
                                    display:'flex',
                                    flex:1,
                                    width: '100%',
                                    height:'100%',
                                    flexDirection: 'column'}}>
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
                        <AccordionDetails style={{
                        width: '100%', display: 'flex', flex: 1, height: '100%', minHeight:'200px'
                    }}>
                            {isPortfolioByIndustryExpand && <PortfolioByIndustry/>}
                        </AccordionDetails>
                    </Accordion>
                </Paper>
                <Paper elevation={3} key={`card`} style={{marginBottom: '1em'}}>
                    <Accordion key={`card-investments`}
                                expanded={isPortfolioByInvestmentsExpand}
                                onChange={(event, expanded: boolean) => handleAccordionExp(expanded, 'card-investments')}
                                sx={{
                                    display:'flex',
                                    flex:1,
                                    width: '100%',
                                    height:'100%',
                                    flexDirection: 'column'}}>
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
                        <AccordionDetails style={{
                        width: '100%', display: 'flex', flex: 1, height: '100%', minHeight:'200px'
                    }}>
                            {isPortfolioByInvestmentsExpand && <InvestmentsOverTime/>}
                        </AccordionDetails>
                    </Accordion>
                </Paper>
            </Grid>
            </Grid>
    );
};


export default SingleFundPortfolios;
