import {Theme,Typography} from '@mui/material';
import {createStyles, useTheme} from "@mui/material/styles";
import { makeStyles } from '@mui/styles';
import { useEffect } from 'react';
import { setTopBarTitle } from '../..//redux/slices/appSlice';
import { useAppDispatch } from '../../redux/store';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        chart: {
            flex: 1,
            textAlign: 'center',
            display: 'flex',
            alignContent: 'center',
        },
    }),
);

const LPChartComponent = () => {
    const theme=useTheme();
    const dispatch = useAppDispatch();
    
    return (
        <div>
            <div>
                <Typography variant="h6" gutterBottom sx={{color: theme.palette.text.primary}}>
                FundsOverview ...
                </Typography>
            
            </div>
        </div>
    );
};

export default LPChartComponent;