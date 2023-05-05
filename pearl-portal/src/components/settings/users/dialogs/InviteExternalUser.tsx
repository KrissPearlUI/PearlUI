import React, { ReactElement, Ref, useEffect, useState } from 'react';
import { TransitionProps } from "@mui/material/transitions";
import { Autocomplete, AutocompleteRenderInputParams, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Slide, TextField, Typography, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from "react-redux";
import { useAppDispatch } from '../../../../redux/store';
import { RootState } from '../../../../redux/slices/rootSlice';
import AddIcon from '@mui/icons-material/Add';
import { FundSummary, NewFund } from '../../../../models/funds/fundModels';
import { NewPCO, PCOSummary } from '../../../../models/pcos/pcoModels';
import { LP, NewLP } from '../../../../models/lps/lpModels';
import { NewCommitment } from '../../../../models/shared/sharedModels';
import { NewTransaction } from '../../../../models/transactions/transactionsModels';
import { NewCashCall } from '../../../../models/cashCalls/cashCallsModels';
import { NewDistribution } from '../../../../models/distributions/distributionsModels';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Theme } from "@mui/material";
import { createStyles, makeStyles } from '@mui/styles';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import { setinviteExternalDialogOpen } from '../../../../redux/slices/settings/settingsSlice';

const autocompleteInputStyles = makeStyles((theme: Theme) => ({
    autocomplete: {
        'borderRadius': 5,
        'backgroundColor': theme.palette.background.paper,
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
        height: '2.2em',
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
        fabIcon: {
            marginLeft: 10,
            alignSelf: 'center',
        },
        datePickers: {
            width: '100%',
            flex: 1,
        },
        textField: {
            width: '400px',
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.text.primary,
            color: theme.palette.text.primary,
            borderRadius: 5,
            '& .MuiSvgIcon-root':
            {
                color: theme.palette.text.primary
            },

            '& label': {
                '&.Mui-focused': {
                    color: theme.palette.text.primary
                }
            },
        },
        searchBox: {
            width: '400px',
            marginRight: '1em',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontFamily: 'Raleway',
            borderRadius: 5,
        },
        textFildsSmall: {
            marginRight: '1em',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontFamily: 'Raleway',
            borderRadius: 5,
        },
        inputRoot: {
            height: '1em',
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

const transitionMethod = (props: TransitionProps & { children: ReactElement<any, any> }, ref: Ref<unknown>) => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Slide direction="up" ref={ref} {...props} />;
};

const Transition = React.forwardRef(transitionMethod);

const Roles = [
    "Admin",
    "Viewer",
];

export const InviteExternalUserDialogComponent = () => {
    const dispatch = useAppDispatch();
    const classes = useStyles();
    const theme = useTheme();
    const autocompleteInputClasses = autocompleteInputStyles();
    const { inviteExternalDialogOpen } = useSelector((state: RootState) => state.settings);
    const [disabled, setDisabled] = useState<boolean>(true);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [newUser,setNewUser]=useState<any>(null);

    /**
     * Handles the closing of the dialog
     */
    const handleClose = () => {
        dispatch(setinviteExternalDialogOpen(false));
    };

    const handleInvite = () => {
        return;
    };

    const onRoleChange = (event: React.SyntheticEvent, value: string) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.nativeEvent.type === 'focusout') return;
        setSelectedRole(value);
        setNewUser({
            ...newUser,
            role: value
        });
    };

    const onValueChange = (value: string, field: string) => {
        switch (field) {
            case 'fullName':
                setFullName(value);
                setNewUser({
                    ...newUser,
                    fullName: value
                });
                setDisabled(value === '' || email==='' || !selectedRole);
                break;
            case 'email':
                setEmail(value);
                setNewUser({
                    ...newUser,
                    email: value
                });
                setDisabled(value === '' || fullName==='' || !selectedRole);                
                break;
            default:
                break;
        }
    };

    return (
        <Dialog open={inviteExternalDialogOpen} TransitionComponent={Transition}
            maxWidth={'xs'}
            fullWidth
            aria-label={'dialog extra data client'}>
            <DialogTitle sx={{
                cursor: 'move',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: theme.palette.mode === 'light' ? '#F5F5F5' : '#06050A'
            }} id="form-dialog-client-data">
                <Grid container sx={{ display: 'flex', flex: 1, justifyContent: 'flex-start', height: '100%', flexDirection: 'column' }}>
                    <Grid item xs={12} sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Typography style={{
                            fontSize: 18,
                            fontWeight: 600
                        }}>{'Invite External User'}</Typography>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ width: '100%' }} />
                    </Grid>

                </Grid>
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flex: 1, justifyContent: 'flex-start', height: '100%', backgroundColor: theme.palette.mode === 'light' ? '#F5F5F5' : '#06050A' }}>
                <Grid container spacing={2}>
                    <Grid item>
                        <Typography variant='body2'>Full Name*</Typography>
                        <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                            <TextField
                                className={classes.searchBox}
                                variant="outlined"
                                size="small"
                                aria-label="fullName"
                                value={fullName}
                                onChange={(e) => onValueChange(e.target.value, 'fullName')}
                                inputProps={{
                                    style: { height: '1em' },
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item>
                        <Typography variant='body2'>Email*</Typography>
                        <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                            <TextField
                                className={classes.searchBox}
                                variant="outlined"
                                size="small"
                                aria-label="email"
                                onChange={(e) => onValueChange(e.target.value, 'email')}
                                value={email}
                                inputProps={{
                                    style: { height: '1em' },
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='body2'>Role*</Typography>
                        <Box sx={{ boxShadow: `0px 4px 4px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)'}`, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                            <Autocomplete
                                id={'fundsAutocomplete'}
                                popupIcon={<ExpandMoreIcon />}
                                size={'small'}
                                autoHighlight={true}
                                autoSelect={true}
                                autoComplete={false}
                                classes={classes}
                                disableClearable
                                sx={{ marginRight: '1em', width: '400px' }}
                                isOptionEqualToValue={(option, value) => option === value}
                                onChange={(e, value: any) => onRoleChange(e, value)}
                                value={selectedRole ?? ''}
                                options={Roles.slice()}
                                renderInput={(params: AutocompleteRenderInputParams) => {
                                    params.InputProps.className = autocompleteInputClasses.textInput;
                                    return <TextField {...params}
                                        className={autocompleteInputClasses.autocomplete}
                                        variant="outlined"
                                        autoComplete="off"
                                        type={'text'}
                                    />;
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ backgroundColor: theme.palette.mode === 'light' ? '#F5F5F5' : '#06050A', display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    color="secondary"
                    disabled={disabled}
                    sx={{ textTransform: 'none' }}
                    onClick={handleInvite}
                >
                    {'Invite user'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
