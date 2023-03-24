import React, {useEffect, useState} from 'react';
import {Moment} from 'moment';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import {TextField} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        datePickers: {
            width: '100%',
            flex: 1,
        },
        textField: {
            width: '222px',
            backgroundColor:theme.palette.background.paper,
            borderColor: theme.palette.text.primary,
            color:theme.palette.text.primary,
            borderRadius:5,
            '& .MuiSvgIcon-root':
                {
                    color: theme.palette.text.primary
                },

            '& label': {
                '&.Mui-focused': {
                    color: theme.palette.text.primary
                }
            },
        }
    }),
);

interface Props {
    disabled?: boolean,
    isStartDate?: boolean,
    minDate?: Date | Moment,
    maxDate?: Date | Moment | number,
    onChange: (date?: Moment) => void
    mask?: string
    helperText?: string
    error?: boolean
    label?: string
    defaultValue?: Date | Moment,
}

const DatePickerComponent = ({
                                 label,
                                 error,
                                 helperText,
                                 mask,
                                 disabled,
                                 minDate,
                                 maxDate,
                                 isStartDate,
                                 onChange,
                                 defaultValue,
                             }: Props): JSX.Element => {
    const classes = useStyles();
    const [value, setValue] = useState(null);

    /**
     * Sets the new selected value
     * @param date
     */
    const onValueChange = (date: any) => {
        setValue(date);
    };

    /**
     * Calls the method in the parent component when value is changed
     */
    useEffect(() => {
        if (value) {
            onChange(value);
        }
    }, [value]);

    /**
     * Sets the styles of the date picker from mui
     
    const popperSx: SxProps = {
        '& .MuiPaper-root': {
            border: `1px solid ${theme.palette.text.primary}`,
            // backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            '& .Mui-selected:hover': {
                color: 'white',
                backgroundColor: theme.palette.warning.main
            },
            '& .Mui-selected': {
                color: 'white',
                backgroundColor: theme.palette.warning.main
            },
        },
        '& .MuiTypography-root': {
            color: theme.palette.text.primary,
        },
        '& .MuiPickersDay-root': {
            //backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
        },
        '& .MuiButtonBase-root': {
            color: theme.palette.text.primary,
            '&:disabled': {
                color: theme.palette.mode === 'dark' ? darken(theme.palette.text.primary, 0.5) : lighten(theme.palette.text.primary, 0.5)
            },
        },
        '& .MuiDatePickerToolbar-root': {
            color: 'white',
            backgroundColor: theme.palette.primary.main,
            '& .MuiTypography-root': {
                color: 'white'
            },
            '& .MuiPickersToolbar-penIconButton': {
                display: 'none'
            }
        }
    }; */

    return (
        <DatePicker
            className={classes.datePickers}
            inputFormat={'dd/MM/yyyy'}
            value={value ? value : defaultValue ?? null}
            onChange={onValueChange}
            disableFuture
            disableHighlightToday
            minDate={minDate}
            disabled={disabled}
            maxDate={maxDate}
            renderInput={(props: any) =>
                <TextField {...props}
                           mask={mask}
                           label={label ? label : isStartDate ? 'From' : 'To'}
                           variant={'outlined'}
                           size={'small'}
                           error={error}
                           helperText={helperText}
                           className={classes.textField}
                />}
        />
    );
};

export default DatePickerComponent;

