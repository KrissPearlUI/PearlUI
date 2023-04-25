import { Grid, Typography } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HC_more from "highcharts/highcharts-more"; //module
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PCOSummary } from '../../models/pcos/pcoModels';
import { setSelectedPCO } from '../../redux/slices/pcos/pcosSlice';
import { RootState } from '../../redux/slices/rootSlice';
import { useAppDispatch } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { fetchPCOs } from '../../redux/thunks/pcoThunk';
HC_more(Highcharts);

const PCOChartComponent = () => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const [chartDataValues, setChartDataValues] = useState<Array<any>>([]);
    const { pcos } = useSelector((state: RootState) => state.pcos);
    const navigate = useNavigate();

    const transformDataToBubbleChartFormat = useCallback((pcos: PCOSummary[]) => {
        const transformedData = pcos?.map((item) => {
            const { revenueAndEbitda, amountInvestedLocalCcy } = item;
            const amountInvested = item.amountInvestedLocalCcy;
            /*  const seriesData = revenueAndEbitda?.map((value, index) => {
                 return {
                     x: value.ebitda,
                     y: value.revenue,
                     z: amountInvested,
                     month: index + 1,
                 };
             }); */

            const chartData = [];
            const [revenue, ebitda] = item.revenueAndEbitda || [];
            if (revenue && ebitda) {
                chartData.push({
                    x: ebitda.ebitda,
                    y: revenue.revenue,
                    z: item.amountInvestedLocalCcy || 0,
                    name: item.shortName,
                    pcoId: item.id
                });
            }
            return {
                name: item.shortName,
                data: chartData,
                marker: {
                    symbol: 'circle',
                },
            };
        });
        return transformedData;
    }, [pcos]);


    const handleSelectPCO = (event: any) => {
        if (event && event.point?.name) {
            const PCOSelected = pcos?.filter(x => x.id === event.point.pcoId)[0];
            if (PCOSelected) {
                dispatch(setSelectedPCO(PCOSelected));
                const otherPageUrl = `/pcosOverview/singlePCO`;
                navigate(otherPageUrl);
            }
        }
    }


    const options = {
        chart: {
            type: 'bubble',
            backgroundColor: null,
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
        },
        title: 'none',
        xAxis: {
            title: {
                text: 'EBITDA Amount',
            },
        },
        yAxis: {
            title: {
                text: 'Revenue Amount',
            },
        },
        tooltip: {
            pointFormat: 'Revenue: {point.y} EUR<br>EBITDA: {point.x} EUR<br>Investment: {point.z} EUR',
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                },
                point: {
                    cursor: 'pointer',
                    events: {
                        click: function (event: any) {
                            handleSelectPCO(event);
                        },
                    },
                },
                marker: {
                    symbol: 'circle',
                    states: {
                        hover: {
                            enabled: false,
                        }
                    }
                }
            }
        },
        series: transformDataToBubbleChartFormat(pcos),
        legend: {
            enabled: false
        }
    };


    useEffect(() => {
        dispatch(fetchPCOs());
    }, [dispatch])



    return (
        <Grid container spacing={2} sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '0.5em' }}>
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                Forecast Revenue & EBITDA Growth
            </Typography>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </Grid>
    );
};

export default PCOChartComponent;