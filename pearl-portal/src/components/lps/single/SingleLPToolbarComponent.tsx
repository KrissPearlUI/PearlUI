import {Autocomplete, AutocompleteRenderInputParams, Grid,Paper,TextField,Typography} from '@mui/material';
import {darken, useTheme} from "@mui/material/styles";
import { useEffect, useState } from 'react';
import { setTopBarTitle } from '../../../redux/slices/appSlice';
import { useAppDispatch } from '../../../redux/store';
import {Theme} from "@mui/material";
import {createStyles,makeStyles} from '@mui/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LP } from '../../../models/lps/lpModels';
import { RootState } from '../../../redux/slices/rootSlice';
import { useSelector } from 'react-redux';
import DatePicker from '../../shared/DatePicker';
import { setSelectedLP } from '../../../redux/slices/lps/lpsSlice';

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

const SingleLPToolbar = () => {
    const classes=useStyles();
    const autocompleteInputClasses=autocompleteInputStyles();
    const theme=useTheme();
    const dispatch = useAppDispatch();
    const {lps, selectedLP} = useSelector((state: RootState) => state.lps);
    const [selectedLPValue, setSelectedLPValue] = useState<LP | null>(selectedLP);
    const minimumDate = new Date('2019-10-01');
    const maximumDate = new Date();
    const [date, setDate] = useState<any>(null);

    const onLPChange = (event: any) => {
        setSelectedLPValue(event);
        if(event){
            dispatch(setSelectedLP(event));
        }
    };

     /**
     * Sets the start date
     * @param date
     */
     const handleTimestampStartChange = (date: any) => {
        setDate(date);
    };

/*     useEffect(()=>{
        setSelectedLPValue(selectedLP??null);
    }, [selectedLP]); */
    
    return (
        <Grid container spacing={1} sx={{display:'flex',flex:1, justifyContent:'space-betweeen', alignItems:'flex-start', flexDirection:'row'}}>
            <Grid item xs={6} md={6} lg={6}>
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
                    onChange={(e, value: LP|null) => onLPChange(value)}
                    value={selectedLPValue??undefined}
                    options={lps ?? []}
                    getOptionLabel={(option: LP|null) => option ? option.shortName : ''}
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
            <Grid item xs={6} md={6} lg={6} sx={{display:'flex', justifyContent:'end',alignItems:'center', marginTop:'0.2em', paddingRight:'0.5em'}}>
                <DatePicker disabled={false}
                            onChange={handleTimestampStartChange}
                            minDate={minimumDate}
                            maxDate={maximumDate}
                            isStartDate={false}
                            label={'Date'}/>
            </Grid>
        </Grid>
    );
};

export default SingleLPToolbar;