import {Grid, IconButton, Theme, Tooltip, Typography,useTheme} from '@mui/material';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../redux/slices/rootSlice';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Autocomplete, {AutocompleteRenderInputParams} from '@mui/material/Autocomplete';
import ExpandMoreIcon from '@mui/icons-material/ArrowDropDown';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';
import {amountValueFormatter, capitalizeLetters} from '../../../../helpers/app';
import { LP, LPPCOInvestmentsRequest, PCOExtended } from '../../../../models/lps/lpModels';
import { useAppDispatch } from '../../../../redux/store';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('highcharts/modules/exporting')(Highcharts);

interface CountryPieChartComponentProps {
    localActiveLP: LP | null,
    setUseAmount: (val: boolean) => void,
    positionDataWsUpdate?: PCOExtended,
}


type Option = {
    label: string;
    id: any;
};

export interface ChartItem extends PCOExtended {
    y: number;
}

const useStyles = makeStyles((theme:Theme) => ({
    icon: {
        marginTop: '0.5em',
        height: '1em',
        width: '1em'
    },
    tooltip: {
        fontSize: 10.5,
        color: '#FF9826',
        backgroundColor: 'black'
    },
    inputRoot: {
        'borderRadius': 5,
        'backgroundColor': theme.palette.background.paper,
/*         '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black'
        },*/
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main
        },
      /*  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black'
        }, */
        '& .MuiChip-root': {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 5
        },
        '& .MuiChip-deleteIconSmall': {
            color: theme.palette.text.primary
        }
    },
    option: {
        'background': theme.palette.background.paper,
        '&:hover': {
            color: theme.palette.primary.main,
            fontWeight: 400,
            fontFamily: 'Raleway'
        },
        '&[aria-selected="true"]': {
            background: theme.palette.background.paper,
            color: theme.palette.primary.main,
            fontWeight: 700,
            fontFamily: 'Raleway'
        }
    },
    popupIndicator: {
        '&.MuiIconButton-root': {
            color: theme.palette.text.primary
        }
    },
    clearIndicator: {
        color: theme.palette.text.primary
    },
}));

const autocompleteStyles = makeStyles((theme:Theme) => ({
    autocomplete: {
        'borderRadius': 5,
        'backgroundColor': theme.palette.background.paper,
        '& input::placeholder': {
            color: theme.palette.text.primary
        },
        '& .Mui-disabled': {
            color: theme.palette.text.primary,
            opacity: 0.8
        }
    },
    textInput: {
        'color': theme.palette.text.primary,
        'fontWeight': 800,
        'fontFamily': 'Raleway',
        /* 'height': '2.5em', */
        'fontSize': 10,
        '& .MuiIconButton-label': {
            color: theme.palette.text.primary
        }
    },
    clearIndicator: {
        color: theme.palette.text.primary
    }
}));

type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
    [Property in Key]-?: Type[Property];
};

type AmountPCOExtendedItem = WithRequiredProperty<PCOExtended, 'id'>;

type PCOExtendedItem = WithRequiredProperty<PCOExtended, 'id'>;


const isAmountPCOExtendedItem = (item: PCOExtended): item is AmountPCOExtendedItem => {
    return 'id' in item;
};

const isPCOExtendedItem = (item: PCOExtended): item is PCOExtendedItem => {
    return 'id' in item;
};

/**
 * Configuration for group values and negative values in the Pie Chart
 */

const customChartConfiguration = {
    otherTokensName: 'Others',
    topCategoriesCount: 7,
    sliceBorderWidth: 2.5,
    negativeValueBorderStyle: 'dash',
    normalBorderStyle: 'solid',
    negativeSliceColor: '#696969'
};

const CountryPieChart = ({chartDataValues}:any) => {
    const theme=useTheme();

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
            showInLegend: true,
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
        plotOptions: {
            pie: {
                showInLegend: true,
            }},
        colors: ['#2E41A0', '##779DD6','#25607E', '#2667FF', '#457FD7','#62B6CB', '#00B4D8', '#1B4357', '#86C7E3', '#56CFE1', '#64DFDF', '#5E60CE'], 
        legend: {
            enabled: true, // show the legend
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal',
            labelFormatter: function(this: DataPoint) : string {
                return `${this.name}: ${Highcharts.numberFormat(this.y, 0, ',', ',')}`;
              },
            itemMarginBottom: 10,
            itemMarginRight:10,
            maxHeight: 100, // set
        },
    };
      

      return (
        <HighchartsReact highcharts={Highcharts} options={options}  containerProps={{style: {width: '100%', height: '30em'}}}/>
      );
};

export default React.memo(CountryPieChart);
