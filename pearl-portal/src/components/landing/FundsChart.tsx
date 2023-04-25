import { Grid, Typography } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from 'react';
import Highcharts, { Chart } from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices/rootSlice';
import { useAppDispatch } from '../../redux/store';
import { fetchFunds } from '../../redux/thunks/fundThunk';
import { amountValueFormatter } from '../../helpers/app';
import { setSelectedFund } from '../../redux/slices/funds/fundsSlice';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('highcharts/modules/exporting')(Highcharts);

const FundsChartComponent = () => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const [chartDataValues, setChartDataValues] = useState<Array<any>>([]);
    const { funds } = useSelector((state: RootState) => state.funds);
    const [totalValue, setTotalValuee] = useState<number>(0);
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
    const navigate = useNavigate();

    interface DataPoint {
        name: string;
        y: number;
        showInLegend?: boolean;
        totalInvestment: number;
        totalCommitments: number;
        numberOfLPS: number;
        numberOfPCOs: number;
    }

    interface ExtendedSeries extends Highcharts.Series {
        center: number[];
    }

    interface FundChart extends Chart {
        customText: Highcharts.SVGElement;
    }

    const handleSelectFund = (event: any) => {
        if (event && event.point?.name) {
            const fundSelected = funds?.filter(x => x.id === event.point.name)[0];
            if (fundSelected) {
                dispatch(setSelectedFund(fundSelected));
                const otherPageUrl = `/fundsOverview/singleFund`;
                navigate(otherPageUrl);
            }
        }
    }

    const options = {
        chart: {
            backgroundColor: null,
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            marginBottom: 0, // Set bottom margin of chart to 50
            type: 'pie',
            events: {
                redraw: function () {
                    drawMarketValueText();
                },
            }
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
                    distance: -35,
                    style: {
                        fontWeight: "bold",
                        fontSize: "11px",
                        textOutline: "none",
                        fontFamily: "Raleway",
                        cursor:'pointer'
                    },
                },
            }
        ],
        tooltip: {
            useHTML: true,
            zIndex: 999,
            formatter: function (this: any) {
                const data: any = this.point.options;
                const title: any = `<div style="font-weight: bold; margin-bottom: 5px; color:#1B4357; font-size:14px; font-family:Raleway;">${data.name}</div>`;
                const table = `
                <table style="width: 100%;">
                  <tr>
                    <td style="text-align: left; padding-right: 10px; color:#1B4357; font-size:12px; font-weight: bold; font-family:Raleway;">Commited Capital:</td>
                    <td style="text-align: right; color:#1B4357; font-size:12px; font-weight: bold; font-family:Raleway;">Number of LPs:</td>
                  </tr>
                  <tr>
                    <td style="text-align: left; padding-right: 10px; color:rgba(0, 128, 0, 1); font-size:12px; font-family:Raleway;">${amountValueFormatter(data.totalCommitments, '')} EUR</td>
                    <td style="text-align: right; color:rgba(0, 128, 0, 1); font-size:12px; font-family:Raleway;">${data.numberOfLPS}</td>
                  </tr>
                  <tr>
                    <td style="text-align: left; padding-right: 10px; color:#1B4357; font-size:12px; font-weight: bold; font-family:Raleway;">Invested Capital:</td>
                    <td style="text-align: right; color:#1B4357; font-size:12px; font-weight: bold; font-family:Raleway;">Number of PCOs:</td>
                  </tr>
                  <tr>
                    <td style="text-align: left; padding-right: 10px; color:rgba(0, 128, 0, 1); font-size:12px; font-family:Raleway;">${amountValueFormatter(data.totalInvestment, '')} EUR</td>
                    <td style="text-align: right; color:rgba(0, 128, 0, 1); font-size:12px; font-family:Raleway;">${data.numberOfPCOs}</td>
                  </tr>
                </table>
              `;
                return title + table;
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor:'pointer',
                showInLegend: false,
                innerSize: '60%',
                depth: 45,
                point: {
                    cursor:'pointer',
                    events: {
                        click: function (event: any) {
                            handleSelectFund(event);
                        },
                    },
                },
            },
        },
        colors: ['#2E41A0', '#779DD6', '#25607E', '#2667FF', '#457FD7', '#62B6CB', '#00B4D8', '#1B4357', '#86C7E3', '#56CFE1', '#64DFDF', '#5E60CE'],
    };

    const drawMarketValueText = () => {
        if (chartComponentRef.current) {
            const chart = chartComponentRef.current.chart as FundChart;

            const series = chart.series as ExtendedSeries[];

            const centerX = series[0].center[0];
            const centerY = series[0].center[1];
            const textX = chart?.plotLeft + (centerX);
            const textY = chart?.plotTop + (centerY) - 5;

            const fontMetrics = chart.renderer.fontMetrics(18);

            if (chart.customText) {
                chart.customText.destroy();
            }

            chart.customText = chart.renderer.text(`<b>Total Commitments</b> <br><b>${totalValue ? amountValueFormatter(totalValue, '') : 0}</b> <b>EUR</b>`, textX, textY + fontMetrics.f / 2, true).css({
                transform: 'translate(-50%)',
                fontSize: `14px`,
                color: theme.palette.text.primary,
                textAlign: 'center',
                width: (chart.chartWidth * 0.7) / 2,
            }).add();

            chart.customText.attr({
                x: textX,
                y: textY + fontMetrics.f / 2,
            });
        }
    };

    /**
   * Handle resize
   */
    useEffect(() => {
        let active = true;

        function handleResize() {
            Highcharts.charts.forEach(function (chart) {
                chart?.reflow();
            });
        }

        if (active) {
            window.addEventListener('resize', handleResize);
        }

        return () => {
            active = false;
        };
    }, [chartComponentRef]);


    useEffect(() => {
        dispatch(fetchFunds());
    }, [dispatch])

    useEffect(() => {
        if (funds && funds.length > 0) {
            let total: number = 0;
            let chartData: any[] = [];
            const groupedByFund: { [key: string]: number } = funds.reduce(
                (acc: { [key: string]: number }, item) => {
                    const { id, sumCommittedAmountEUR } = item;
                    acc[id] = (acc[id] || 0) + (sumCommittedAmountEUR ? sumCommittedAmountEUR : 0);
                    return acc;
                },
                {}
            );
            total = funds.reduce((sum, dataPoint) => sum + (dataPoint.sumCommittedAmountEUR ? dataPoint.sumCommittedAmountEUR : 0), 0);
            chartData = Object.entries(groupedByFund).map(([name, y]) => ({
                name,
                y
            }));

            chartData = chartData.map((item) => ({
                ...item,
                totalInvestment: funds?.filter(x => x.id === item.name)[0]?.sumAmountInvestedEUR ?? 0,
                totalCommitments: funds?.filter(x => x.id === item.name)[0]?.sumCommittedAmountEUR ?? 0,
                numberOfLPS: funds?.filter(x => x.id === item.name)[0]?.numOfLPs ?? 0,
                numberOfPCOs: funds?.filter(x => x.id === item.name)[0]?.numOFPCOs ?? 0,
            }))
            setTotalValuee(total);
            setChartDataValues(chartData);
        }
    }, [funds])

    return (
        <Grid container spacing={2} sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '0.5em' }}>
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                Commitments per Fund
            </Typography>
            <HighchartsReact ref={chartComponentRef} highcharts={Highcharts} options={options} containerProps={{ style: { width: '100%' } }} />
        </Grid>
    );
};

export default FundsChartComponent;