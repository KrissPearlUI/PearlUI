import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useAppDispatch } from '../../redux/store';
import { setAddDiaogOpen } from '../../redux/slices/appSlice';

const useStyles = makeStyles((theme: Theme) =>
({
    fabIcon: {
        marginLeft: 10,
        alignSelf: 'center',
    },
})
);

interface AddButtonProps {
    pageName: string,
}

const AddButton = ({ pageName }: AddButtonProps) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();

    const openAddDialog = async () => {
        dispatch(setAddDiaogOpen(true));
    };

    return <Tooltip title={pageName}>
        <span>
            <Fab
                color={'primary'}
                size="small"
                sx={{ boxShadow: 'none' }}
                aria-label="AddBtn"
                onFocus={(e: any) => (e.target.blur())}
                onClick={() => openAddDialog()}
                className={classes.fabIcon}>
                <AddRoundedIcon />
            </Fab>
        </span>
    </Tooltip>;
};

export default AddButton;

