import React, { ReactElement, Ref, useState } from 'react';
import { TransitionProps } from "@mui/material/transitions";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Slide, Typography, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from "react-redux";
import { useAppDispatch } from '../../../redux/store';
import { RootState } from '../../../redux/slices/rootSlice';
import { setAddDiaogOpen } from '../../../redux/slices/appSlice';
import AddIcon from '@mui/icons-material/Add';
import AddNewLPContentComponent from './lpsAddDialoContents/AddNewLPContent';
import AddNewFundContentComponent from './fundsAddDialogsContents/AddNewFundContent';
import AddNewPCOContentComponent from './pcosAddDialogContents/AddNewPCOContent';

const transitionMethod = (props: TransitionProps & { children: ReactElement<any, any> }, ref: Ref<unknown>) => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Slide direction="up" ref={ref} {...props} />;
};

const Transition = React.forwardRef(transitionMethod);

interface AddDialogComponentProps {
    pageName: string,
    pageTitle: string
}

export const AddDialogComponent = ({ pageName, pageTitle }: AddDialogComponentProps) => {
    const dispatch = useAppDispatch();
    const { addDialogOpen } = useSelector((state: RootState) => state.app);
    const [disabled, setDisabled] = useState<boolean>(true);
    const theme = useTheme()

    /**
     * Handles the closing of the dialog
     */
    const handleClose = () => {
        dispatch(setAddDiaogOpen(false));
    };

    return (
        <Dialog open={addDialogOpen} TransitionComponent={Transition}
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
                        }}>{pageTitle}</Typography>
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
                {pageName === 'lpsOverview' ?
                    <AddNewLPContentComponent setDisabled={setDisabled} />
                    : pageName === 'fundsOverview'
                        ? <AddNewFundContentComponent setDisabled={setDisabled} />
                        : <AddNewPCOContentComponent setDisabled={setDisabled} />}
            </DialogContent>
            <DialogActions sx={{ backgroundColor: theme.palette.mode === 'light' ? '#F5F5F5' : '#06050A' }}>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: 'none' }}
                    startIcon={<AddIcon />}
                    disabled={disabled}
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};
