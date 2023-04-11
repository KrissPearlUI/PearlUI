import { Theme } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { useEffect } from 'react';
import { setActivePath, setTopBarTitle } from '../../../redux/slices/appSlice';
import { useAppDispatch } from '../../../redux/store';
import FundsOverviewTable from '../../../components/funds/summary/FundsOverviewTableComponent';
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


const FundsOverview = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();

    /**
     * Sets the title for the page in the topBar component
     */
    useEffect(() => {
        dispatch(setTopBarTitle("Funds Overview"));
        dispatch(setActivePath('/fundsOverview'));
    }, [dispatch])

    return (
        <div className={classes.root}>
            <FundsOverviewTable />
            <AddDialogComponent pageName="fundsOverview" pageTitle="Add New Fund"/>
            {/* <AddDialog pageName={'LPs'}/>
            <ExportDialog pageName={'LPs'}/> */}
        </div>
    );
};

export default FundsOverview;
