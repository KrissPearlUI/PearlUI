import React from 'react';
import {Button, Fab, IconButton, Tooltip} from '@mui/material';
import {Theme} from '@mui/material/styles';
import {makeStyles} from '@mui/styles';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

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

const AddButton = ({pageName}: AddButtonProps) => {
    const classes = useStyles();

    /**
     * Sets export window to true in order to create the window
     */
    const openDownloadDialog = async () => {
       console.log('open download');
    };

    return <Tooltip title="Add LP">
        <span>
            <Fab
            color={'primary'}
            size="small"
            sx={{boxShadow:'none'}}
            aria-label="AddBtn" 
            onFocus={(e: any) => (e.target.blur())}                            
            onClick={() => openDownloadDialog()}
            className={classes.fabIcon}>
                <AddRoundedIcon  />
            </Fab>
        </span>
    </Tooltip>;
};

export default AddButton;

