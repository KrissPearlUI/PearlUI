import { FormControl, FormControlLabel, FormControlLabelProps, Grid, Radio, RadioGroup, styled } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/slices/rootSlice';
import Highcharts from 'highcharts/highstock';
import { amountValueFormatter } from '../../../../helpers/app';
import { PCOExtended } from '../../../../models/lps/lpModels';
import CountryPieChart from './CountryPieChart';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('highcharts/modules/exporting')(Highcharts);

export interface ChartItem extends PCOExtended {
    y: number;
}

interface StyledFormControlLabelProps extends FormControlLabelProps {
    checked: boolean;
}

const StyledFormControlLabel = styled((props: StyledFormControlLabelProps) => (
    <FormControlLabel {...props} />
))(({ theme, checked }) => ({
    fontFamily: 'Raleway',
    '.MuiFormControlLabel-label': checked && {
        color: theme.palette.primary.main,
        fontWeight: 600
    },
}));

const PortfolioByStage = () => {
    const [totalValue, setTotalValuee] = useState<number>(0);
    const [chartDataValues, setChartDataValues] = useState<Array<any>>([]);
    const { pcosExtended } = useSelector((state: RootState) => state.lps);
    const [type, setType] = React.useState('byAmount');

    const handleChangeType = (event: React.ChangeEvent<HTMLInputElement>) => {
        setType((event.target as HTMLInputElement).value);
    };

    useEffect(() => {
        if (pcosExtended) {
            let total: number = 0;
            let chartData: any[] = [];
            if (type === 'byAmount') {
                const groupedByStage: { [key: string]: number } = pcosExtended.reduce(
                    (acc: { [key: string]: number }, item) => {
                        const { currentStage, amountInvested } = item;
                        acc[currentStage ?? ''] = (acc[currentStage ?? ''] || 0) + (amountInvested ? amountInvested : 0);
                        return acc;
                    },
                    {}
                );
                total = pcosExtended.reduce((sum, dataPoint) => sum + (dataPoint.amountInvested ? dataPoint.amountInvested : 0), 0);
                chartData = Object.entries(groupedByStage).map(([name, y]) => ({
                    name,
                    y,
                }));
            } else {
                const groupedByStage = pcosExtended.reduce(
                    (acc: { [key: string]: number }, item) => {
                        const { currentStage } = item;
                        if (!acc[currentStage ?? '']) {
                            acc[currentStage ?? ''] = 1;
                        } else {
                            acc[currentStage ?? '']++;
                        }
                        return acc;
                    }, {});
                total = pcosExtended.reduce((sum, dataPoint) => sum + (dataPoint.amountInvested ? dataPoint.amountInvested : 0), 0);
                chartData = Object.entries(groupedByStage).map(([name, y]) => ({
                    name,
                    y,
                }));
            }
            setTotalValuee(total);
            setChartDataValues(chartData);
        }
    }, [pcosExtended, type]);

    return (
        <Grid container sx={{ display: 'flex', flex: 1 }}>
            <Grid item xs={12} md={12} lg={12}>
                <FormControl>
                    <RadioGroup
                        aria-labelledby="type-country-radio-btn"
                        name="type-country-radio-btn"
                        value={type}
                        onChange={handleChangeType}
                    >
                        <StyledFormControlLabel checked={type === 'byAmount'} value="byAmount" control={<Radio sx={{ fontFamily: 'Raleway' }} />} label="By amount invested" />
                        <StyledFormControlLabel checked={type === 'byPCOs'} value="byPCOs" control={<Radio sx={{ fontFamily: 'Raleway' }} />} label="By number of PCOs" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={12} lg={12} sx={{ paddingTop: '0.5em', paddingBottom: '0.5em' }}>
                <span style={{ fontFamily: 'Raleway', fontWeight: 600 }}>Total amount: {amountValueFormatter(totalValue, '')}</span>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
                <CountryPieChart chartDataValues={chartDataValues} />
            </Grid>
        </Grid>
    );
};

export default React.memo(PortfolioByStage);
