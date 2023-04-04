import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { useAppDispatch } from '../../redux/store';
import { setEditDiaogOpen } from '../../redux/slices/appSlice';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

const useStyles = makeStyles((theme: Theme) =>
({
    fabIcon: {
        marginLeft: 10,
        alignSelf: 'center',
    },
})
);

interface EditButtonProps {
    pageName: string,
}

const EditButton = ({ pageName }: EditButtonProps) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();

    const openEditDialog = async () => {
        dispatch(setEditDiaogOpen(true));
    };

    return <Tooltip title={pageName}>
        <span>
            <Fab
                color={'primary'}
                size="small"
                sx={{ boxShadow: 'none', alignSelf: 'end' }}
                aria-label="editBtn"
                onFocus={(e: any) => (e.target.blur())}
                onClick={() => openEditDialog()}
                className={classes.fabIcon}>
                <EditRoundedIcon />
            </Fab>
        </span>
    </Tooltip>
};

export default EditButton;

