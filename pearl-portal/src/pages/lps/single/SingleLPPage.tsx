import {Grid,Paper,Typography} from '@mui/material';
import {useTheme} from "@mui/material/styles";
import { useEffect, useState } from 'react';
import { setTopBarTitle } from '../../../redux/slices/appSlice';
import { useAppDispatch } from '../../../redux/store';
import {Theme} from "@mui/material";
import {createStyles,makeStyles} from '@mui/styles';
import LPChartComponent from '../../../components/landing/LPChart';
import SingleLPToolbar from '../../../components/lps/single/SingleLPToolbarComponent';
import SingleSelection from '../../../components/lps/single/SingleSelectionComponent';
import SingleLPBasic from '../../../components/lps/single/basic/SingleLPBasicComponent';
import LPFundsTable from '../../../components/lps/single/basic/LPFundsTable';
import SingleLPCommitments from '../../../components/lps/single/commitments/SingleLPCommitmentsComponent';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flex: 1,
            paddingLeft:'0.2em',
            paddingRight:'0.2em',
        },
    }),
);

const SingleLP = () => {
    const classes=useStyles();
    const theme=useTheme();
    const dispatch = useAppDispatch();
    const [selectedView,setSelectedView]=useState<string>('basic');

    const handleButtonClick = (buttonId:string) => {
        setSelectedView(buttonId);
        // Do something else on button click event
      };

    return (
        <Grid spacing={1} container sx={{display:'flex',flex:1, height:'100%', width:'100%', paddingLeft:'1em', marginRight:'0.2em', flexDirection:'row', justifyContent:'flex-start', alignItems:'flex-start', overflow:'auto' }}>
            <Grid item sx={{display:'flex', justifyContent:'start', alignItems:'start', width:'100%', height:'8vh'}}>
                <SingleLPToolbar/>
            </Grid>
            <Grid item sx={{display:'flex', justifyContent:'start', alignItems:'start',width:'100%',height:'8vh'}}>
                <SingleSelection selectedItem={selectedView} handleButtonClick={handleButtonClick}/>
            </Grid>
            <Grid item sx={{display:'flex', justifyContent:'start', alignItems:'start',width:'100%', height:'82%' }}>
                {selectedView==='basic' ? <SingleLPBasic/>
                : <SingleLPCommitments/>}
            </Grid>
        </Grid>   
    );
};

export default SingleLP;