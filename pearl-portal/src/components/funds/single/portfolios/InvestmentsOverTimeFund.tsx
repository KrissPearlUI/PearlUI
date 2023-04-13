import { Grid, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/slices/rootSlice';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { amountValueFormatter } from '../../../../helpers/app';
import { PCOExtended } from '../../../../models/lps/lpModels';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('highcharts/modules/exporting')(Highcharts);

export interface ChartItem extends PCOExtended {
    y: number;
}

const InvestmentsOverTimeFund = () => {
    const theme = useTheme();
    const [totalValue, setTotalValuee] = useState<number>(0);
    const [chartDataValues, setChartDataValues] = useState<Array<any>>([]);
    const { transactions } = useSelector((state: RootState) => state.transactions);
    const { selectedFund } = useSelector((state: RootState) => state.funds);
    const {  pcosExtended } = useSelector((state: RootState) => state.lps);
    const [type,] = React.useState('byAmount');

    useEffect(() => {
        if (transactions && selectedFund && pcosExtended) {
            let total: number = 0;
            total = pcosExtended.reduce((sum, dataPoint) => sum + (dataPoint.amountInvested ? dataPoint.amountInvested : 0), 0);
            let dataByYear = transactions.filter(x => x.fundId === selectedFund.id).sort((a, b) => new Date(a.date).getFullYear() - new Date(b.date).getFullYear()).slice()
            dataByYear = dataByYear.reduce((acc: any, item: any) => {
                const year = new Date(item.date).getFullYear().toString();
                if (!acc[year]) {
                    acc[year] = [];
                }
                acc[year].push(item);
                return acc;
            }, {});

            setTotalValuee(total);
            setChartDataValues(dataByYear);
        }
    }, [transactions, type, pcosExtended, selectedFund]);

    const options = {
        chart: {
            backgroundColor: theme.palette.background.paper,
            plotBackgroundColor: theme.palette.background.paper,
            type: 'column',
            height: 500, // set the height of the chart
        },
        title: 'none',
        xAxis: {
            categories: Object.keys(chartDataValues),
            title: {
                text: "Year",
            },
        },
        yAxis: {
            title: {
                text: "Amount in Euros",
            },
        },
        series: [
            {
                name: "",
                data: Object.values(chartDataValues).map((yearData: any) =>
                    yearData.reduce((acc: any, item: any) => acc + item.amountEUR, 0)
                ),
                size: "100%",
                dataLabels: {
                    enabled: true,
                    format: '{point.percentage:.1f}%',
                    distance: -50,
                    style: {
                        fontWeight: "bold",
                        fontSize: "12px",
                        color: "white",
                        textOutline: "none",
                    },
                },
            }
        ],
        colors: ['#2E41A0', '##779DD6', '#25607E', '#2667FF', '#457FD7', '#62B6CB', '#00B4D8', '#1B4357', '#86C7E3', '#56CFE1', '#64DFDF', '#5E60CE'],
    };



    return (
        <Grid container sx={{ display: 'flex', flex: 1 }}>
            <Grid item xs={12} md={12} lg={12} sx={{ paddingTop: '0.5em', paddingBottom: '0.5em' }}>
                <span style={{ fontFamily: 'Raleway', fontWeight: 600 }}>Total amount: {amountValueFormatter(totalValue, '')}</span>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </Grid>
        </Grid>
    );
};

export default React.memo(InvestmentsOverTimeFund);
