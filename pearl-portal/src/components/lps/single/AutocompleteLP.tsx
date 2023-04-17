import { Autocomplete, AutocompleteRenderInputParams, TextField } from '@mui/material';
import { useState } from 'react';
import { useAppDispatch } from '../../../redux/store';
import { Theme } from "@mui/material";
import { createStyles, makeStyles } from '@mui/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { RootState } from '../../../redux/slices/rootSlice';
import { useSelector } from 'react-redux';
import { LP } from '../../../models/lps/lpModels';
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

interface AutocompleteLPProps {
    selectedLP: LP | null,
}

const AutocompleteLPComponent = ({ selectedLP }: AutocompleteLPProps) => {
    const classes = useStyles();
    const autocompleteInputClasses = autocompleteInputStyles();
    const dispatch = useAppDispatch();
    const { lps } = useSelector((state: RootState) => state.lps);
    const [selectedLPValue, setSelectedLPValue] = useState<LP | null>(selectedLP);

    const onLPChange = (event: React.SyntheticEvent, value: any) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.nativeEvent.type === 'focusout') return;
        setSelectedLPValue(value);
        if (value) {
            dispatch(setSelectedLP(value));
        }
    };


    return (
        <Autocomplete
            id={'lpdAutocomplete'}
            popupIcon={<ExpandMoreIcon />}
            size={'small'}
            autoHighlight={true}
            autoSelect={true}
            autoComplete={false}
            disableClearable
            classes={classes}
            sx={{ marginRight: '1em', width: '320px' }}
            isOptionEqualToValue={(option, value) => option === value}
            onChange={(e, value: LP | null) => onLPChange(e, value)}
            value={selectedLPValue ?? undefined}
            options={lps ?? []}
            getOptionLabel={(option: LP | null) => option ? option.shortName : ''}
            renderInput={(params: AutocompleteRenderInputParams) => {
                params.InputProps.className = autocompleteInputClasses.textInput;
                return <TextField {...params}
                    className={autocompleteInputClasses.autocomplete}
                    variant="standard"
                    autoComplete="off"
                    type={'text'}
                    label='Select a LP' />;
            }}
        />
    );
};

export default AutocompleteLPComponent;