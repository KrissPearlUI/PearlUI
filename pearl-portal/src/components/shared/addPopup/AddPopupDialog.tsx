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
import { FundSummary, NewFund } from '../../../models/funds/fundModels';
import { NewPCO, PCOSummary } from '../../../models/pcos/pcoModels';
import { LP, NewLP } from '../../../models/lps/lpModels';

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
    const [newFund, setNewFund] = useState<NewFund | null>(null);
    const [newLP,setNewLP]=useState<NewLP|null>(null);
    const [newPCO,setNewPCO]=useState<NewPCO|null>(null);

    /**
     * Handles the closing of the dialog
     */
    const handleClose = () => {
        dispatch(setAddDiaogOpen(false));
    };

    const handleAddBtnClick=()=>{
        let valid=false;
        if(pageName==='fundsOverview'){
            valid=newFund!==null && newFund.fundName!=='' && newFund.shortName!=='' && newFund.country!=='' && newFund.type!=='' && newFund.currency!=='';
        } else if(pageName==='lpsOverview'){
            valid=newLP!==null && newLP.name!=='' && newLP.shortName!=='' &&  newLP.city!=='' && newLP.country!=='' && newLP.type!=='';
        } else if (pageName==='pcosOverview'){
            valid=newPCO!==null && newPCO.pcoName!=='' && newPCO.shortName!=='' &&  newPCO.country!=='' && newPCO.sector!=='' && newPCO.currency!=='';
        }
        console.log(valid);
    }

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
                    <AddNewLPContentComponent disabled={disabled} setDisabled={setDisabled} newLP={newLP} setNewLP={setNewLP}  />
                    : pageName === 'fundsOverview'
                        ? <AddNewFundContentComponent disabled={disabled} setDisabled={setDisabled} newFund={newFund} setNewFund={setNewFund} />
                        : <AddNewPCOContentComponent disabled={disabled} setDisabled={setDisabled} newPCO={newPCO} setNewPCO={setNewPCO}  />}
            </DialogContent>
            <DialogActions sx={{ backgroundColor: theme.palette.mode === 'light' ? '#F5F5F5' : '#06050A' }}>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: 'none' }}
                    startIcon={<AddIcon />}
                    disabled={disabled}
                    onClick={handleAddBtnClick}
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};
