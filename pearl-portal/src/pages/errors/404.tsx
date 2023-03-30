import { Typography } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { createStyles, makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => {
        return createStyles({
            root: {
                flex: 1,
                overflow: 'auto',
                textAlign: 'center'
            },
        });
    }
);

const NotFoundPage = (): JSX.Element => {
    const classes = useStyles();
    return (
        <div className={clsx(classes.root)}>
            <Typography variant="h5" gutterBottom>
                [Oops]
            </Typography>
            <Typography variant="h6" gutterBottom>
                We cannot find the page you wanted.
            </Typography>
        </div>
    );
};

export default NotFoundPage;
