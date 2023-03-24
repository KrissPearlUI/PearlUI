import React from 'react';
import {Fab, Tooltip} from '@mui/material';
import {Theme} from '@mui/material/styles';
import {makeStyles} from '@mui/styles';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

const useStyles = makeStyles((theme: Theme) =>
    ({
        fabIcon: {
            marginLeft: 10,
            alignSelf: 'center',
        },
    })
);

interface ExportButtonProps {
    pageName: string,
}

const ExportButton = ({pageName}: ExportButtonProps) => {
    const classes = useStyles();

    /**
     * Sets export window to true in order to create the window
     */
    const openDownloadDialog = async () => {
       console.log('open download');
    };

    return <Tooltip title="Download Report">
        <span>
            <Fab
            color={'primary'}
            size="small"
            aria-label="ExportBtn" 
            sx={{boxShadow:'none'}}
            onFocus={(e: any) => (e.target.blur())}                            
            onClick={() => openDownloadDialog()}
            className={classes.fabIcon}>
                <DownloadRoundedIcon />
            </Fab>
        </span>
    </Tooltip>;
};

export default ExportButton;

