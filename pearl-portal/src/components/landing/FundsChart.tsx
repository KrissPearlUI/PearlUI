import { Grid, Typography } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices/rootSlice';
import { useAppDispatch } from '../../redux/store';
import { fetchFunds } from '../../redux/thunks/fundThunk';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('highcharts/modules/exporting')(Highcharts);

const FundsChartComponent = () => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const [chartDataValues, setChartDataValues] = useState<Array<any>>([]);
    const { funds } = useSelector((state: RootState) => state.funds);
    const [totalValue, setTotalValuee] = useState<number>(0);

    interface DataPoint {
        name: string;
        y: number;
        showInLegend?: boolean;
    }


    const options = {
        chart: {
            backgroundColor: null,
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            marginBottom: 0, // Set bottom margin of chart to 50
            type: 'pie',
        },
        title: 'none',
        series: [
            {
                name: 'Commitments',
                data: chartDataValues,
                size: "100%",
                showInLegend: false,
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b> <br> {point.percentage:.1f} %',
                    distance: -30,
                    style: {
                        fontWeight: "bold",
                        fontSize: "11px",
                        color: "white",
                        textOutline: "none",
                    },
                },
            }
        ],
        plotOptions: {
            pie: {
                showInLegend: false,
                innerSize: '60%',
                depth: 45
            }
        },
        colors: ['#2E41A0', '##779DD6', '#25607E', '#2667FF', '#457FD7', '#62B6CB', '#00B4D8', '#1B4357', '#86C7E3', '#56CFE1', '#64DFDF', '#5E60CE'],
    };


    useEffect(() => {
        dispatch(fetchFunds());
    }, [dispatch])

    useEffect(() => {
        if (funds) {
            let total: number = 0;
            let chartData: any[] = [];
            const groupedByFund: { [key: string]: number } = funds.reduce(
                (acc: { [key: string]: number }, item) => {
                    const { id, sumCommittedAmountFundCcy } = item;
                    acc[id] = (acc[id] || 0) + (sumCommittedAmountFundCcy ? sumCommittedAmountFundCcy : 0);
                    return acc;
                },
                {}
            );
            total = funds.reduce((sum, dataPoint) => sum + (dataPoint.sumCommittedAmountFundCcy ? dataPoint.sumCommittedAmountFundCcy : 0), 0);
            chartData = Object.entries(groupedByFund).map(([name, y]) => ({
                name,
                y,
            }));

            setTotalValuee(total);
            setChartDataValues(chartData);
        }
    }, [funds])

    return (
        <Grid container spacing={2} sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '0.5em' }}>
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                Commitments per Fund
            </Typography>
            <HighchartsReact highcharts={Highcharts} options={options} containerProps={{ style: { width: '100%' } }} />
        </Grid>
    );
};

export default FundsChartComponent;