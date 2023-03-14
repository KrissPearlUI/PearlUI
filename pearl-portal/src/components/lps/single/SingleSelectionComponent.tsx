import {Box, Button, ButtonGroup, Fab, Grid,IconButton,Paper,Typography} from '@mui/material';
import {darken, useTheme} from "@mui/material/styles";
import { useEffect } from 'react';
import { setTopBarTitle } from '../../../redux/slices/appSlice';
import { useAppDispatch } from '../../../redux/store';
import {Theme} from "@mui/material";
import {createStyles,makeStyles} from '@mui/styles';
import LPChartComponent from '../../landing/LPChart';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

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
    }),
);

interface SingleSelectionProps {
    selectedItem:string
    handleButtonClick:any
}

const SingleSelection = ({selectedItem,handleButtonClick}:SingleSelectionProps) => {
    const classes=useStyles();
    const theme=useTheme();
    const dispatch = useAppDispatch();

    
    return (
        <Grid container sx={{display:'flex',flex:1, justifyContent:'space-betweeen', alignItems:'flex-start', flexDirection:'row'}}>
        <Grid item xs={8} md={8} lg={8}>
            <ButtonGroup variant="outlined"  aria-label="outlined primary button group" sx={{height:36}}>
                <Button sx={{fontSize:12,
                backgroundColor:selectedItem==='basic'?theme.palette.primary.main:theme.palette.background.paper,
                color: selectedItem==='basic'?'white':theme.palette.primary.main}}
                onClick={() => handleButtonClick('basic')}>
                    Basic Information</Button>
                <Button sx={{fontSize:12,backgroundColor:selectedItem==='commitments'?theme.palette.primary.main:theme.palette.background.paper,
                color: selectedItem==='commitments'?'white':theme.palette.primary.main}} onClick={() => handleButtonClick('commitments')}>
                    Commitments</Button>
                <Button sx={{fontSize:12,backgroundColor:selectedItem==='coinvestments'?theme.palette.primary.main:theme.palette.background.paper,
                color: selectedItem==='coinvestments'?'white':theme.palette.primary.main}} onClick={() => handleButtonClick('coinvestments')}>
                    Co-Investments</Button>
                <Button sx={{fontSize:12,backgroundColor:selectedItem==='portfolio'?theme.palette.primary.main:theme.palette.background.paper,
                color: selectedItem==='portfolio'?'white':theme.palette.primary.main}} onClick={() => handleButtonClick('portfolio')}>
                    Portfolio</Button>
                <Button sx={{fontSize:12,backgroundColor:selectedItem==='callsDist'?theme.palette.primary.main:theme.palette.background.paper,
                color: selectedItem==='callsDist'?'white':theme.palette.primary.main}} onClick={() => handleButtonClick('callsDist')}>
                    Calls & Distributions</Button>
                <Button sx={{fontSize:12,backgroundColor:selectedItem==='transactions'?theme.palette.primary.main:theme.palette.background.paper,
                color: selectedItem==='transactions'?'white':theme.palette.primary.main}} onClick={() => handleButtonClick('transactions')}>
                    Transactions</Button>
                <Button sx={{fontSize:12,backgroundColor:selectedItem==='documents'?theme.palette.primary.main:theme.palette.background.paper,
                color: selectedItem==='documents'?'white':theme.palette.primary.main}} onClick={() => handleButtonClick('documents')}>
                    Documents</Button>
            </ButtonGroup>
        </Grid>
        <Grid item xs={4} md={4} lg={4} sx={{display:'flex', justifyContent:'end',alignItems:'center',paddingRight:'1em'}}>
            {selectedItem==='basic'&&<Fab
                    color={'primary'}
                    size="small"
                    sx={{boxShadow:'none', alignSelf:'end'}}
                    aria-label="editBtn" 
                    onFocus={(e: any) => (e.target.blur())}                            
                    className={classes.fabIcon}>
                <EditRoundedIcon />
                </Fab>}
        </Grid>
    </Grid>
    );
};

export default SingleSelection;