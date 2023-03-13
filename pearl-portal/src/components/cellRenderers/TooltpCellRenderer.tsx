import { Popover, Theme, Typography } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import clsx from 'clsx';
import React from 'react';
import { PopoverPanelProps, PopoverTableProps } from '../../models/shared/sharedModels';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        popover: {
            pointerEvents: 'none',
        },
        paper: {
            padding: theme.spacing(1),
            boxShadow: '0px 0px 1px 1px #aca7a7',
            marginTop: theme.spacing(1),
        },
        wrapper: {
            minWidth: 150,
        },
        content: {
            padding: '.5em .5em 0 .5em',
        },
        icon: {
            display: 'inline-block',
            height: '1.5em',
            width: '1.5em',
        },
        assetCode: {
            fontWeight: 'bold',
            fontSize: '120%',
        },
    }),
);

const useContentStyles = makeStyles(() =>
    createStyles({
        root: {
            borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
            marginBottom: 5,
            padding: 2,
        },
        title: {
            padding: '2px 0 5px 0',
            fontWeight: 'bolder',
        },
        value: {
            textAlign: 'right',
            marginBottom: 5,
            fontFamily: 'IBM Plex Mono'
        },
    }),
);

const PopoverContent = (props: PopoverTableProps) => {
    const classes = useContentStyles();
    const {title, value} = props;
    return (
        <div className={classes.root}>
            <div className={classes.title}>&#9656; {title}</div>
            <div className={classes.value}>
                <Typography variant="subtitle2" style={{fontFamily: 'IBM Plex Mono'}}>{value}</Typography>
            </div>
        </div>
    );
};

export const PopoverPanel = (props: PopoverPanelProps): JSX.Element => {
    const classes = useStyles();
    const {anchorEl, popoverKey, currencies, showDetailQty, renderAmt, handlePopoverClose, balanceTableProps} = props;
    const {balance, fundingBalances, tradingBalances, depositBalances} = balanceTableProps;
    const open = Boolean(anchorEl);

    const getPercentage = (b: any, sub: any, asset: string): string => {
        const total = +b[asset];
        const subValue = +sub.available[popoverKey] ?? 0;
        const percent = Math.abs(total) < 0.0001 || Math.abs(subValue) < 0.0001 ? 0 : (subValue / total) * 100;
        return percent === 0 || percent === 100 ? '' : `: ${percent.toFixed(2)}%`;
    };

    const canPopover = (sub: any, asset: string): boolean => {
        if (sub?.available[asset]) {
            return Math.abs(+sub.available[asset]) > 0;
        }
        return false;
    };

    return (
        <Popover
            className={classes.popover}
            classes={{paper: classes.paper}}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
        >
            <div className={classes.wrapper}>
                <span className={clsx('currency', popoverKey.toLowerCase(), classes.icon)}>&nbsp;</span>
                <span className={classes.assetCode}>test</span>
            </div>
            <div className={classes.content}>
                {canPopover(fundingBalances, popoverKey) && (
                    <PopoverContent
                        title={`Funding${getPercentage(balance, fundingBalances, popoverKey)}`}
                        value={renderAmt(+fundingBalances.available[popoverKey], showDetailQty)}
                    />
                )}
                {canPopover(depositBalances, popoverKey) && (
                    <PopoverContent
                        title={`Flexible Deposit${getPercentage(balance, depositBalances, popoverKey)}`}
                        value={renderAmt(+depositBalances.available[popoverKey], showDetailQty)}
                    />
                )}
                {canPopover(tradingBalances, popoverKey) && (
                    <PopoverContent
                        title={`OTC Trading${getPercentage(balance, tradingBalances, popoverKey)}`}
                        value={renderAmt(+tradingBalances.available[popoverKey], showDetailQty)}
                    />
                )}
            </div>
        </Popover>
    );
};
