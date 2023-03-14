import {Autocomplete, AutocompleteRenderInputParams, Grid,Paper,TextField,Typography} from '@mui/material';
import {darken, useTheme} from "@mui/material/styles";
import { useEffect, useState } from 'react';
import { setTopBarTitle } from '../../../redux/slices/appSlice';
import { useAppDispatch } from '../../../redux/store';
import {Theme} from "@mui/material";
import {createStyles,makeStyles} from '@mui/styles';
import LPChartComponent from '../../../components/landing/LPChart';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices/rootSlice';
import { Fund, LP, PCO } from '../../../models/lps/lpModels';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const autocompleteInputStyles = makeStyles((theme: Theme) => ({
    autocomplete: {
        'borderRadius': 5,
        'backgroundColor': 'transparent',
        '& input::placeholder': {
            color: theme.palette.text.primary
        },
        '& .Mui-disabled': {
            color: theme.palette.text.primary,
            opacity: 0.8
        }
    },
    textInput: {
        'color': theme.palette.text.primary,
        'fontWeight': 800,
        'fontFamily': 'Raleway',
        /* 'height': '2.5em', */
        'fontSize': 10,
        '& .MuiIconButton-label': {
            color: theme.palette.text.primary
        }
    },
    clearIndicator: {
        color: theme.palette.text.primary
    }
}));

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        chart: {
            flex: 1,
            textAlign: 'center',
            display: 'flex',
            alignContent: 'center',
        },
        summary: {
            flex:1
        },
        inputRoot: {
            'borderRadius': 5,
            'backgroundColor': 'transparent',
    /*         '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'black'
            },*/
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main
            },
          /*  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'black'
            }, */
            '& .MuiChip-root': {
                color: theme.palette.text.primary,
                backgroundColor: 'transparent',
                borderRadius: 5
            },
            '& .MuiChip-deleteIconSmall': {
                color: theme.palette.text.primary
            }
        },
        option: {
            'background': theme.palette.background.paper,
            '&:hover': {
                color: theme.palette.primary.main,
                fontWeight: 400,
                fontFamily: 'Raleway'
            },
            '&[aria-selected="true"]': {
                background: theme.palette.background.paper,
                color: theme.palette.primary.main,
                fontWeight: 700,
                fontFamily: 'Raleway'
            }
        },
        popupIndicator: {
            '&.MuiIconButton-root': {
                color: theme.palette.text.primary
            }
        },
        clearIndicator: {
            color: theme.palette.text.primary
        },
    }),
);

const SingleLPBasic = () => {
    const classes=useStyles();
    const theme=useTheme();
    const autocompleteInputClasses=autocompleteInputStyles();
    const dispatch = useAppDispatch();
    const {selectedLP} = useSelector((state: RootState) => state.lps);
    const [selectedLPValue, setSelectedLPValue] = useState<any>(null);

    const onLPChange = (event: any) => {
        setSelectedLPValue(event);
    };
    return (
        <Grid container spacing={2} sx={{display:'flex',flex:1, justifyContent:'flex-start', alignItems:'flex-start', flexDirection:'row',paddingRight:'1em'}}>
            <Grid item xs={12}>
                <Paper elevation={3} sx={{backgroundColor:theme.palette.background.paper, padding:'1em'}}>
                    <Grid container spacing={1} sx={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexDirection:'row'}}>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Domicile:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em',fontWeight:400}}>Address:</Typography>
                            <Typography sx={{color:theme.palette.text.primary,fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Website:</Typography>
                            <Typography sx={{color:theme.palette.text.primary,fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                        <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>First Investment:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Type:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.type}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                        <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Main Contact:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Relationship Partner:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Relationship SS:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper elevation={3} sx={{backgroundColor:theme.palette.background.paper, padding:'1em'}}>
                <Grid container spacing={1} sx={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexDirection:'row'}}>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                            <Grid item sx={{display:'flex'}}>
                            <Autocomplete
                                id={'lpdAutocomplete'}
                                popupIcon={<ExpandMoreIcon/>}
                                size={'small'}
                                autoHighlight={true}
                                autoSelect={true}
                                autoComplete={false}
                                disableClearable
                                classes={classes}
                                sx={{marginRight:'1em', width:'320px'}}
                                isOptionEqualToValue={(option, value) => option === value}
                                onChange={(e, value: Fund) => onLPChange(value)}
                                value={selectedLPValue??undefined}
                                options={selectedLP?.funds ?? []}
                                getOptionLabel={(option: Fund) => option ? option.fundName : ''}
                                renderInput={(params: AutocompleteRenderInputParams) => {
                                    params.InputProps.className = autocompleteInputClasses.textInput;
                                    return <TextField {...params} 
                                    className={autocompleteInputClasses.autocomplete}
                                                    variant="standard" 
                                                    autoComplete="off"
                                                    type={'text'}
                                                    label='Select a LP'/>;
                                }}
                                />
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Autocomplete
                                id={'lpdAutocomplete'}
                                popupIcon={<ExpandMoreIcon/>}
                                size={'small'}
                                autoHighlight={true}
                                autoSelect={true}
                                autoComplete={false}
                                disableClearable
                                classes={classes}
                                sx={{marginRight:'1em', width:'320px'}}
                                isOptionEqualToValue={(option, value) => option === value}
                                onChange={(e, value: Fund) => onLPChange(value)}
                                value={selectedLPValue??undefined}
                                options={selectedLP?.funds ?? []}
                                getOptionLabel={(option: Fund) => option ? option.fundName : ''}
                                renderInput={(params: AutocompleteRenderInputParams) => {
                                    params.InputProps.className = autocompleteInputClasses.textInput;
                                    return <TextField {...params} 
                                    className={autocompleteInputClasses.autocomplete}
                                                    variant="standard" 
                                                    autoComplete="off"
                                                    type={'text'}
                                                    label='Select a LP'/>;
                                }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                        <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Of which terminated:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                        <Grid item sx={{display:'flex'}}>
                        <Autocomplete
                                id={'lpdAutocomplete'}
                                popupIcon={<ExpandMoreIcon/>}
                                size={'small'}
                                autoHighlight={true}
                                autoSelect={true}
                                autoComplete={false}
                                disableClearable
                                classes={classes}
                                sx={{marginRight:'1em', width:'320px'}}
                                isOptionEqualToValue={(option, value) => option === value}
                                onChange={(e, value: PCO) => onLPChange(value)}
                                value={selectedLPValue??undefined}
                                options={selectedLP?.pcos ?? []}
                                getOptionLabel={(option: PCO) => option ? option.shortName : ''}
                                renderInput={(params: AutocompleteRenderInputParams) => {
                                    params.InputProps.className = autocompleteInputClasses.textInput;
                                    return <TextField {...params} 
                                    className={autocompleteInputClasses.autocomplete}
                                                    variant="standard" 
                                                    autoComplete="off"
                                                    type={'text'}
                                                    label='Select a LP'/>;
                                }}
                                />
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Autocomplete
                                id={'lpdAutocomplete'}
                                popupIcon={<ExpandMoreIcon/>}
                                size={'small'}
                                autoHighlight={true}
                                autoSelect={true}
                                autoComplete={false}
                                disableClearable
                                classes={classes}
                                sx={{marginRight:'1em', width:'320px'}}
                                isOptionEqualToValue={(option, value) => option === value}
                                onChange={(e, value: PCO) => onLPChange(value)}
                                value={selectedLPValue??undefined}
                                options={selectedLP?.pcos ?? []}
                                getOptionLabel={(option: PCO) => option ? option.shortName : ''}
                                renderInput={(params: AutocompleteRenderInputParams) => {
                                    params.InputProps.className = autocompleteInputClasses.textInput;
                                    return <TextField {...params} 
                                    className={autocompleteInputClasses.autocomplete}
                                                    variant="standard" 
                                                    autoComplete="off"
                                                    type={'text'}
                                                    label='Select a LP'/>;
                                }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper elevation={3} sx={{backgroundColor:theme.palette.background.paper,padding:'1em'}}>
                <Grid container spacing={1} sx={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexDirection:'row'}}>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Management Fee:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em',fontWeight:400}}>Capital Paid In:</Typography>
                            <Typography sx={{color:theme.palette.text.primary,fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Capital Distributed:</Typography>
                            <Typography sx={{color:theme.palette.text.primary,fontWeight:500}}>{selectedLP?.totalDistributions}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em',fontWeight:400}}>Capital Invested:</Typography>
                            <Typography sx={{color:theme.palette.text.primary,fontWeight:500}}>{selectedLP?.totalInvestments}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                        <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Recycling Reserves:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Capital Available:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.totalInvestments}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em',fontWeight:400}}>Dry Powder:</Typography>
                            <Typography sx={{color:theme.palette.text.primary,fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em',fontWeight:400}}>Reserved:</Typography>
                            <Typography sx={{color:theme.palette.text.primary,fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                        <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Avg. Deals Available:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Tapped Out:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.tappedOot ? 'Yes':'No'}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Estimated Until Tapped Out:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper elevation={3} sx={{backgroundColor:theme.palette.background.paper,padding:'1em'}}>
                <Grid container spacing={1} sx={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexDirection:'row'}}>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Net DPI:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em',fontWeight:400}}>Gross DPI:</Typography>
                            <Typography sx={{color:theme.palette.text.primary,fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                        <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Net TVPI:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Gross TVPI:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.type}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} item xs={4} sx={{display:'flex',  flexDirection:'column'}}>
                        <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Net IRR:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                            <Grid item sx={{display:'flex'}}>
                            <Typography sx={{color:theme.palette.secondary.main, marginRight:'0.5em', fontWeight:400}}>Gross IRR:</Typography>
                            <Typography sx={{color:theme.palette.text.primary, fontWeight:500}}>{selectedLP?.country}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default SingleLPBasic;