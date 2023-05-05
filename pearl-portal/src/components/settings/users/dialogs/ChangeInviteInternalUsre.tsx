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
import { setEditAddInternalUserDialogOpen } from '../../../../redux/slices/settings/settingsSlice';

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
        height: '2.4em',
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

interface ChangeInviteUserDialogComponentProps {
    type: string,
}

export const ChangeInviteUserDialogComponent = ({ type }: ChangeInviteUserDialogComponentProps) => {
    const dispatch = useAppDispatch();
    const classes = useStyles();
    const theme = useTheme();
    const autocompleteInputClasses = autocompleteInputStyles();
    const { editAddInternalUserDialogOpen } = useSelector((state: RootState) => state.settings);
    const { selectedUser } = useSelector((state: RootState) => state.settings);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    /**
     * Handles the closing of the dialog
     */
    const handleClose = () => {
        dispatch(setEditAddInternalUserDialogOpen(false));
    };

    const handleAddSaveChanges = () => {
        if (type === 'Change') {
            return;
        } else {
            return;
        }
    };

    const onRoleChange = (event: React.SyntheticEvent, value: string) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.nativeEvent.type === 'focusout') return;
        setSelectedRole(value);
    };

    useEffect(() => {
        if (selectedUser) {
            setSelectedRole(selectedUser.role);
        }
    }, [selectedUser]);

    return (
        <Dialog open={editAddInternalUserDialogOpen} TransitionComponent={Transition}
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
                        }}>{type === 'Change' ? 'Edit User' : 'Invite User'}</Typography>
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
                    <Grid item xs={12} md={2}>
                        <Avatar alt='selected user' src={`${process.env.PUBLIC_URL}/${selectedUser ? selectedUser.picURL : ''}`} style={{ height: '60px', width: '60px' }} />
                    </Grid>
                    <Grid container item xs={12} md={10} sx={{ marginTop: '0.5em' }}>
                        <Grid item xs={12}>
                            <span style={{ color: theme.palette.text.primary, fontSize: 14, fontFamily: 'Raleway' }}>{selectedUser?.name}</span>
                        </Grid>
                        <Grid item xs={12}>
                            <span style={{ color: 'rgba(69, 69, 69, 0.7)', fontSize: 14, fontFamily: 'Raleway' }}>{selectedUser?.email}</span>
                        </Grid>
                        <Grid item xs={12} sx={{ marginTop: '1em' }}>
                            <Typography variant='body2'>Role</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                id={'fundsAutocomplete'}
                                popupIcon={<ExpandMoreIcon />}
                                size={'small'}
                                autoHighlight={true}
                                autoSelect={true}
                                autoComplete={false}
                                classes={classes}
                                disableClearable
                                sx={{ marginRight: '1em' }}
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
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ backgroundColor: theme.palette.mode === 'light' ? '#F5F5F5' : '#06050A', display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    color="secondary"
                    sx={{ textTransform: 'none' }}
                    onClick={handleAddSaveChanges}
                >
                    {type === 'Change' ? 'Save changes' : 'Invite user'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
