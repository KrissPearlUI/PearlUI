import { CssBaseline, Theme, Typography } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { createStyles, makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            height: '100vh',
            overflow: 'auto',
            textAlign: 'center',
            backgroundColor: theme.palette.background.default
        },
        message: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        },
    })
);

const ErrorPage = ({message}: { message?: string }): JSX.Element => {
    const classes = useStyles();
    return (
        <div className={clsx(classes.root)}>
            <CssBaseline/>
            <div className={clsx(classes.message)}>
                <div className="logo logo-color" style={{height: '36px', marginBottom: '24px'}}/>
                <Typography variant="h5" gutterBottom>
                    {message ?? 'Oops, something is wrong at our end'}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Please contact us - <span style={{textDecoration: 'underline'}}>support&#64;emerald-ventures.com</span>
                </Typography>
            </div>
        </div>
    );
};

export default ErrorPage;
