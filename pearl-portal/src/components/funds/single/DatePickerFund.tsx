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

const DatePickerFundComponent = () => {
    const classes=useStyles();
    const autocompleteInputClasses=autocompleteInputStyles();
    const theme=useTheme();
    const dispatch = useAppDispatch();
    const minimumDate = new Date('2019-10-01');
    const maximumDate = new Date();
    const [date, setDate] = useState<any>(null);


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
                <DatePicker disabled={false}
                            onChange={handleTimestampStartChange}
                            minDate={minimumDate}
                            maxDate={maximumDate}
                            isStartDate={false}
                            label={'Date'}/>
    );
};

export default DatePickerFundComponent;