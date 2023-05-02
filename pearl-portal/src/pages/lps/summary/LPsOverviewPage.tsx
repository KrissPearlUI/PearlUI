import { Theme } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { useEffect } from 'react';
import { setActivePath, setTopBarTitle } from '../../../redux/slices/appSlice';
import { useAppDispatch } from '../../../redux/store';
import LPOverviewTable from '../../../components/lps/summary/LPOverviewTableComponents';
import { AddDialogComponent } from "../../../components/shared/addPopup/AddPopupDialog";
import { DownloadDialogComponent } from "../../../components/shared/downloadPopUp/DownloadPopupDialog";

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


const LPsOverview = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();

    /**
     * Sets the title for the page in the topBar component
     */
    useEffect(() => {
        dispatch(setTopBarTitle("Limited Partners Overview"));
        dispatch(setActivePath('/lpsOverview'));
    }, [dispatch])

    return (
        <div className={classes.root}>
            <LPOverviewTable />
            <AddDialogComponent pageName="lpsOverview" pageTitle="Add New Limited Partner"/>
            <DownloadDialogComponent pageName="lpsOverview" pageTitle="Download LPs Overview"/>
            {/* <AddDialog pageName={'LPs'}/>
            <ExportDialog pageName={'LPs'}/> */}
        </div>
    );
};

export default LPsOverview;
