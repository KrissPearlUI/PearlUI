import {Typography} from '@mui/material';
import {useTheme} from "@mui/material/styles";
import { useEffect } from 'react';
import { setTopBarTitle } from '../../../redux/slices/appSlice';
import { useAppDispatch } from '../../../redux/store';

const FundsOverview = () => {
    const theme=useTheme();
    const dispatch = useAppDispatch();

    /**
     * Sets the title for the page in the topBar component
     */
    useEffect(() => {
        dispatch(setTopBarTitle("Funds Overview"));
    }, [dispatch])
    
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

export default FundsOverview;