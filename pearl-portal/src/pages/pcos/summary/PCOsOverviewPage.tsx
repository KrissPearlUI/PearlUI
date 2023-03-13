import {Typography} from '@mui/material';
import {Theme} from "@mui/material";
import {makeStyles} from '@mui/styles';
import {useTheme} from "@mui/material/styles";
import { useEffect } from 'react';
import { setTopBarTitle } from '../../../redux/slices/appSlice';
import { useAppDispatch } from '../../../redux/store';
import ExportDialog from '../../../components/shared/ExportDialogComponent';
import AddDialog from '../../../components/shared/AddDialogComponent';
import PCOsOverviewTable from '../../../components/pcos/summary/PCOsOverviewTableComponent';

const useStyles = makeStyles((theme: Theme) =>
    ({
        root: {
            display: 'flex',
            flex: 1,
            paddingLeft:'0.2em',
            paddingRight:'0.2em',
        },
    }),
);


const PCOsOverview = () => {
    const classes = useStyles();
    const theme=useTheme();
    const dispatch = useAppDispatch();

    /**
     * Sets the title for the page in the topBar component
     */
    useEffect(() => {
        dispatch(setTopBarTitle("Portfolio Companies Overview"));
    }, [dispatch])

    return (
        <div className={classes.root}>
            <PCOsOverviewTable/>
            {/* <AddDialog pageName={'LPs'}/>
            <ExportDialog pageName={'LPs'}/> */}
        </div>
    );
};

export default PCOsOverview;
