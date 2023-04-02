import { Theme } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { useEffect } from 'react';
import { setTopBarTitle } from '../../../redux/slices/appSlice';
import { useAppDispatch } from '../../../redux/store';
import PCOsOverviewTable from '../../../components/pcos/summary/PCOsOverviewTableComponent';
import { AddDialogComponent } from "../../../components/shared/addPopup/AddPopupDialog";

const useStyles = makeStyles((theme: Theme) =>
({
    root: {
        display: 'flex',
        flex: 1,
        paddingLeft: '0.2em',
        paddingRight: '0.2em',
    },
}),
);


const PCOsOverview = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();

    /**
     * Sets the title for the page in the topBar component
     */
    useEffect(() => {
        dispatch(setTopBarTitle("Portfolio Companies Overview"));
    }, [dispatch])

    return (
        <div className={classes.root}>
            <PCOsOverviewTable />
            <AddDialogComponent pageName="pcosOverview" pageTitle="Add New Portfolio Company"/>
            {/* <AddDialog pageName={'LPs'}/>
            <ExportDialog pageName={'LPs'}/> */}
        </div>
    );
};

export default PCOsOverview;
