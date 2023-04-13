import { useTheme } from '@mui/material';
import React from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { PCOExtended } from '../../../../models/lps/lpModels';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('highcharts/modules/exporting')(Highcharts);

export interface ChartItem extends PCOExtended {
    y: number;
}

const CountryPieChart = ({ chartDataValues }: any) => {
    const theme = useTheme();

    interface DataPoint {
        name: string;
        y: number;
        showInLegend?: boolean;
    }


    const options = {
        chart: {
            backgroundColor: theme.palette.background.paper,
            plotBackgroundColor: theme.palette.background.paper,
            type: 'pie',
            height: 500, // set the height of the chart
        },
        title: 'none',
        series: [
            {
                name: 'Investment',
                data: chartDataValues,
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
        /* plotOptions: {
            pie: {
                showInLegend: true,
            }
        }, */
        colors: ['#2E41A0', '##779DD6', '#25607E', '#2667FF', '#457FD7', '#62B6CB', '#00B4D8', '#1B4357', '#86C7E3', '#56CFE1', '#64DFDF', '#5E60CE'],
        /* legend: {
            enabled: true, // show the legend
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal',
            labelFormatter: function (this: DataPoint): string {
                return `${this.name ? this.name : 'No Data'}: ${Highcharts.numberFormat(this.y, 0, ',', ',')}`;
            },
            itemMarginBottom: 10,
            itemMarginRight: 10,
            maxHeight: 100, // set
        }, */
    };


    return (
        <HighchartsReact highcharts={Highcharts} options={options} containerProps={{ style: { width: '100%', height: '30em' } }} />
    );
};

export default React.memo(CountryPieChart);
