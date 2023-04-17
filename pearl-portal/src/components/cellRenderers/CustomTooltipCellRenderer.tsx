import React, { useState } from 'react';
import { ITooltipParams } from 'ag-grid-community';
import { Grid, Theme, useTheme } from '@mui/material';
import { FundSummary } from '../../models/funds/fundModels';
import { Fund, LPFundsOverview, PCO } from '../../models/lps/lpModels';
import { amountValueFormatter } from '../../helpers/app';

/**
 * Tooltip for ag grids where type defines what message should the tooltip contain on the specific ag grid
 * @param props
 * @param type
 * @return tooltip
 */
const CustomTooltip = (props: ITooltipParams & { type: string, valueType: string }) => {
    const theme: Theme = useTheme();
    const [mouseOverTooltip, setMouseOverTooltip] = useState(false);

    const handleTooltipMouseEnter = () => {
        setMouseOverTooltip(true);
    };

    const handleTooltipMouseLeave = () => {
        setMouseOverTooltip(false);
    };

    const handleContentMouseEnter = () => {
        setMouseOverTooltip(true);
    };

    const handleContentMouseLeave = () => {
        setMouseOverTooltip(false);
    };

    if (props && props.value) {
        if (props.type === 'funds' && props.data) {
            return (
                <Grid container style={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'start',
                    flexDirection: 'column',
                    backgroundColor: theme.palette.background.default,
                }}>
                    {props.value.map((item: Fund) =>
                        <Grid container item style={{
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'start',
                            flexDirection: 'column',
                            margin: '0.5em'
                        }}>
                            <span style={{
                                fontWeight: 700,
                                color: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.text.primary,
                                fontSize: '14px',
                                marginBottom: '0.3em',
                                fontFamily: 'Raleway',
                            }}>{item.fundName}</span>
                            <span
                                style={{
                                    color: theme.palette.success.main,
                                    fontWeight: 400,
                                    fontSize: '12px',
                                    fontFamily: 'Raleway',
                                    marginLeft: '0.5em'
                                }}>{`${item.committedAmount ? amountValueFormatter(item.committedAmount, '') : amountValueFormatter(item.amountInvested ?? 0, '')} ${item.fundCurrency ? item.fundCurrency.toLocaleUpperCase() : ''}`}</span>
                        </Grid>)}
                </Grid>)
        } else if (props.type === 'pcos' && props.value) {
            return (
                <Grid container style={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'start',
                    flexDirection: 'column',
                    backgroundColor: theme.palette.background.default,
                }}
                    onMouseEnter={handleTooltipMouseEnter}
                    onMouseLeave={handleTooltipMouseLeave}>
                    {props.value.map((item: PCO) =>
                        <Grid container item style={{
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'start',
                            flexDirection: 'column',
                            margin: '0.5em'
                        }}
                            onMouseEnter={handleContentMouseEnter}
                            onMouseLeave={handleContentMouseLeave}>
                            <span style={{
                                fontWeight: 700,
                                color: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.text.primary,
                                fontSize: '14px',
                                marginBottom: '0.3em',
                                fontFamily: 'Raleway',
                            }}>{item.shortName}</span>
                            <span
                                style={{
                                    color: theme.palette.success.main,
                                    fontWeight: 400,
                                    fontSize: '12px',
                                    fontFamily: 'Raleway',
                                    marginLeft: '0.5em'
                                }}>{`${amountValueFormatter(item.amountInvested ?? 0, '')} ${item.localCurrency ? item.localCurrency.toUpperCase() : item.fundCurrency ? item.fundCurrency.toLocaleUpperCase() : ''}`}</span>
                        </Grid>)}
                </Grid>)
        } if (props.type === 'lps' && props.value) {
            return (
                <Grid container style={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'start',
                    flexDirection: 'column',
                    backgroundColor: theme.palette.background.default,
                }}>
                    {props.value.map((item: LPFundsOverview) =>
                        <Grid container item style={{
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'start',
                            flexDirection: 'column',
                            margin: '0.5em'
                        }}>
                            <span style={{
                                fontWeight: 700,
                                color: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.text.primary,
                                fontSize: '14px',
                                marginBottom: '0.3em',
                                fontFamily: 'Raleway',
                            }}>{item.shortName}</span>
                            <span
                                style={{
                                    color: theme.palette.success.main,
                                    fontWeight: 400,
                                    fontSize: '12px',
                                    fontFamily: 'Raleway',
                                    marginLeft: '0.5em'
                                }}>{`${item.committedAmount ? amountValueFormatter(item.committedAmount, '') : item.participationPercentage ? `${(item.participationPercentage * 100).toFixed(2)}%` : ''} ${item.committedAmount && item.fundCurrency ? item.fundCurrency.toUpperCase() : ''}`}</span>
                        </Grid>)}
                </Grid>)
        }
        else {
            return (
                <div
                    style={{
                        backgroundColor: theme.palette.grey[400],
                        color: '#454545',
                        padding: '0.3em'
                    }}>
                    <span
                        style={{
                            fontWeight: 400,
                            fontSize: '11px'
                        }}>{props.valueType && props.valueType === 'number' ? amountValueFormatter(props.value ?? 0, '') : props.value}</span>
                </div>
            )
        }

    } else {
        return null;
    }
};

export default CustomTooltip;
