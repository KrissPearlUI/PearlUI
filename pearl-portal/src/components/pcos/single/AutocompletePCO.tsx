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
import { FundSummary } from '../../../models/funds/fundModels';
import { setSelectedFund } from '../../../redux/slices/funds/fundsSlice';
import { PCOSummary } from '../../../models/pcos/pcoModels';
import { setSelectedPCO } from '../../../redux/slices/pcos/pcosSlice';

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

const AutocompletePCOComponent = () => {
    const classes=useStyles();
    const autocompleteInputClasses=autocompleteInputStyles();
    const theme=useTheme();
    const dispatch = useAppDispatch();
    const {pcos, selectedPCO} = useSelector((state: RootState) => state.pcos);
    const [selectedPCOValue, setSelectedPCOValue] = useState<PCOSummary | null>(selectedPCO);
    const minimumDate = new Date('2019-10-01');
    const maximumDate = new Date();
    const [date, setDate] = useState<any>(null);

    const onPCOChange = (event: any) => {
        setSelectedPCOValue(event);
        if(event){
            dispatch(setSelectedPCO(event));
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
                <Autocomplete
                    id={'fundsAutocomplete'}
                    popupIcon={<ExpandMoreIcon/>}
                    size={'small'}
                    autoHighlight={true}
                    autoSelect={true}
                    autoComplete={false}
                    disableClearable
                    classes={classes}
                    sx={{marginRight:'1em', width:'320px'}}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(e, value: PCOSummary|null) => onPCOChange(value)}
                    value={selectedPCOValue??undefined}
                    options={pcos ?? []}
                    getOptionLabel={(option: PCOSummary|null) => option ? option.shortName : ''}
                    renderInput={(params: AutocompleteRenderInputParams) => {
                        params.InputProps.className = autocompleteInputClasses.textInput;
                        return <TextField {...params} 
                        className={autocompleteInputClasses.autocomplete}
                                        variant="standard" 
                                        autoComplete="off"
                                        type={'text'}
                                        label='Select a PCO'/>;
                    }}
                    />           
    );
};

export default AutocompletePCOComponent;