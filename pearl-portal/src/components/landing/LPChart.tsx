import { Autocomplete, AutocompleteRenderInputParams, Grid, TextField, Typography, Theme, Popper, Paper } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import Highcharts, { Chart } from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FundSummary } from '../../models/funds/fundModels';
import makeStyles from '@mui/styles/makeStyles';
import { setSelectedFund } from '../../redux/slices/funds/fundsSlice';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices/rootSlice';
import { amountValueFormatter } from '../../helpers/app';
import { setSelectedLP } from '../../redux/slices/lps/lpsSlice';
import { useAppDispatch } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

const autocompleteInputStyles = makeStyles((theme: Theme) => ({
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

const useStyles = makeStyles((theme: Theme) => ({
    searchBox: {
        width: '320px',
        marginRight: '1em',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        fontFamily: 'Raleway',
        borderRadius: 5,
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

interface AutocompletePopperProps {
    children: React.ReactNode;
    anchorEl: HTMLElement | null;
    // add any other props that your component needs
}

const AutocompletePopper = (props: any) => {
    const { children, ...popperProps } = props;
    const inputWidth = props.anchorEl?.clientWidth;

    return (
        <Popper {...popperProps} style={{ width: inputWidth }}>
            <Paper>{children}</Paper>
        </Popper>
    );
}

type SeriesSubData = {
    lpId: string
    lpName: string,
    value: number
};

type SeriesData = {
    investedAmount: SeriesSubData[] | null,
    reservedFeesAmount: SeriesSubData[] | null,
    followOnsAmount: SeriesSubData[] | null,
    unallocatedAmount: SeriesSubData[] | null,
    investedPerc: SeriesSubData[] | null,
    reservedFeesPerc: SeriesSubData[] | null,
    folloOnsPerc: SeriesSubData[] | null,
    unallocatedPerc: SeriesSubData[] | null
}

/* interface MyChart extends Highcharts.ChartObject { }
 */
const LPChartComponent = () => {
    const theme = useTheme();
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const autocompleteInputClasses = autocompleteInputStyles();
    const { funds, selectedFund } = useSelector((state: RootState) => state.funds);
    const { lps } = useSelector((state: RootState) => state.lps);
    const [selectedFundValue, setSelectedFundValue] = useState<FundSummary>(funds[0]);
    const [categories, setCategories] = useState<string[]>([]);
    const [chartDataValues, setChartDataValues] = useState<Array<any>>([]);
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    const onFundChange = (event: React.SyntheticEvent, value: FundSummary) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.nativeEvent.type === 'focusout') return;
        setSelectedFundValue(value);
        dispatch(setSelectedFund(value));
    }

    const handleSelectLP = (event: any) => {
        if (event && event.point?.category) {
            const lpId = chartDataValues?.filter(x => x.name === 'Invested')[0]?.dataAmount?.filter((y: SeriesSubData) => y.lpName === event.point?.category)[0]?.lpId ?? '';
            const LPSelected = lps?.filter(x => x.id === lpId)[0];
            if (LPSelected) {
                dispatch(setSelectedLP(LPSelected));
                const otherPageUrl = `/lpsOverview/singleLP`;
                navigate(otherPageUrl);
            }
        }
    }

    // function to generate the chart options
    const options = {
        chart: {
            type: 'column',
            backgroundColor: null,
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            stickyTracking: false,
            zoomType: 'xy',
            zoomButton: true,
            panning: true,
            panKey: 'ctrl',
        },
        title: 'none',
        xAxis: {
            categories: categories,
            title: {
                text: "LPs",
                margin: 0
            },
            labels: {
                padding: 0 // Set the padding to 0
            },
        },
        yAxis: {
            min: 0,
            max: 100,
            tickInterval: 10,
            endOnTick: true,
            title: {
                text: "Percentage"
            },
            reversed: false,
            labels: {
                format: "{value}%"
            },
        },
        tooltip: {
            useHTML: true,
            zIndex: 999,
            formatter: function (this: any) {
                const data: any = this.point;
                const title: any = `<div style="font-weight: bold; margin-bottom: 5px; color:#1B4357; font-size:14px; font-family:Raleway;">${data.category}</div>`;
                const table = `
                <table style="width: 100%;">
                  <tr>
                    <td style="text-align: left; padding-right: 10px; color:#1B4357; font-size:12px; font-weight: bold; font-family:Raleway;">Invested Capital:</td>
                    <td style="text-align: right; color:#1B4357; font-size:12px; font-weight: bold; font-family:Raleway;">Reserves for Fees:</td>
                  </tr>
                  <tr>
                    <td style="text-align: left; padding-right: 10px; color:rgba(0, 128, 0, 1); font-size:12px; font-family:Raleway;">${amountValueFormatter(chartDataValues.filter(x => x.name === 'Invested')[0]?.dataAmount?.filter((y: SeriesSubData) => y.lpName === data.category)[0]?.value, '')} EUR</td>
                    <td style="text-align: right; color:rgba(0, 128, 0, 1); font-size:12px; font-family:Raleway;">${amountValueFormatter(chartDataValues.filter(x => x.name === 'Reserved Fees')[0]?.dataAmount?.filter((y: SeriesSubData) => y.lpName === data.category)[0]?.value, '')} EUR</td>
                  </tr>
                  <tr>
                    <td style="text-align: left; padding-right: 10px; color:#1B4357; font-size:12px; font-weight: bold; font-family:Raleway;">Reserves for Follow-on:</td>
                    <td style="text-align: right; color:#1B4357; font-size:12px; font-weight: bold; font-family:Raleway;">Unallocated Reserves:</td>
                  </tr>
                  <tr>
                    <td style="text-align: left; padding-right: 10px; color:rgba(0, 128, 0, 1); font-size:12px; font-family:Raleway;">${amountValueFormatter(chartDataValues.filter(x => x.name === 'Follow Ons')[0]?.dataAmount?.filter((y: SeriesSubData) => y.lpName === data.category)[0]?.value, '')} EUR</td>
                    <td style="text-align: right; color:rgba(0, 128, 0, 1); font-size:12px; font-family:Raleway;">${amountValueFormatter(chartDataValues.filter(x => x.name === 'Unallocated')[0]?.dataAmount?.filter((y: SeriesSubData) => y.lpName === data.category)[0]?.value, '')} EUR</td>
                  </tr>
                </table>
              `;
                return title + table;
            }
        },
        plotOptions: {
            series: {
                states: {
                    hover: {
                        brightness: 0.1, // Reduce the brightness of the entire series on hover
                        enabled: true,
                        cursor: 'pointer',
                        halo: {
                            size: 0 // Remove the halo around the hovered stack
                        }
                    }
                },
                point: {
                    cursor: 'pointer',
                    events: {
                        click: function (event: any) {
                            handleSelectLP(event);
                        },
                    },
                },
            },
            column: {
                allowPointSelect: true,
                cursor: 'pointer',
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    format: '{point.y:,.2f}  %',
                    style: {
                        fontFamily: "Raleway",
                        cursor: 'pointer'
                    },
                },
                stickyTracking: false,
                states: {
                    hover: {
                        opacity: 1,
                        brightness: 0.2,
                        enabled: true,
                        cursor: 'pointer',
                        halo: {
                            size: 0
                        }
                    }

                }
            }
        },
        legend: {
            reversed: true,
            margin: 0
        },
        series: [
            {
                name: "Unallocated Reserves (Dry Powder)",
                data: chartDataValues.filter(x => x.name === 'Unallocated')[0]?.data?.flatMap((x: SeriesSubData) => x.value),
            },
            {
                name: "Reserves for follow-on investments",
                data: chartDataValues.filter(x => x.name === 'Follow Ons')[0]?.data?.flatMap((x: SeriesSubData) => x.value),
            },
            {
                name: "Reserves for Fees (5 Years)",
                data: chartDataValues.filter(x => x.name === 'Reserved Fees')[0]?.data?.flatMap((x: SeriesSubData) => x.value),
            },
            {
                name: "Invested Capital",
                data: chartDataValues.filter(x => x.name === 'Invested')[0]?.data?.flatMap((x: SeriesSubData) => x.value),
            },
        ],
        colors: ['#008000', '#80C080', '#FBE498', '#25607E'],
        scrollbar: {
            enabled: true,
            margin: 0,
            liveRedraw: false // increase performance by redrawing scrollbar only when released
        },
    };

    useEffect(() => {
        if (funds && funds.length > 0 && !selectedFund) {
            dispatch(setSelectedFund(funds[0]))
        }
    }, [funds, selectedFund]);

    useEffect(() => {
        if (selectedFund && (!selectedFundValue || (selectedFundValue && selectedFundValue.id !== selectedFund.id))) {
            setSelectedFundValue(selectedFund);
        }
    }, [selectedFund]);

    useEffect(() => {
        let active = true;
        if (!lps || !selectedFundValue) return;
        if (lps && lps.length > 0 && selectedFundValue && active && chartDataValues.length <= 0) {

            let seriesData: SeriesData = {
                investedAmount: [],
                reservedFeesAmount: [],
                followOnsAmount: [],
                unallocatedAmount: [],
                investedPerc: [],
                reservedFeesPerc: [],
                folloOnsPerc: [],
                unallocatedPerc: []
            };

            const result = lps.filter(item1 =>
                item1?.funds?.some(item2 => item2.id === selectedFundValue.id)
            )?.slice()?.sort(function (a, b) {
                if (a.shortName?.toLowerCase() < b.shortName?.toLowerCase()) return -1;
                if (a.shortName?.toLowerCase() > b.shortName?.toLowerCase()) return 1;
                return 0;
            })

            setCategories(result?.map((x) => x.shortName));

            result.forEach(lp => {
                const commitment = lp.commitmentsOverview.find(commitment => commitment.fundId === selectedFundValue.id);

                if (commitment) {
                    const totalComitments = lp.funds?.filter(y => y.id === selectedFundValue.id)[0]?.committedAmount ?? 0;
                    seriesData.investedAmount?.push(commitment?.invested ? { lpId: lp.id, lpName: lp.shortName, value: commitment.invested } : { lpId: lp.id, lpName: lp.shortName, value: 0 });
                    seriesData.reservedFeesAmount?.push(commitment?.reservedForFees ? { lpId: lp.id, lpName: lp.shortName, value: commitment.reservedForFees } : { lpId: lp.id, lpName: lp.shortName, value: 0 });
                    seriesData.followOnsAmount?.push(commitment?.followOns ? { lpId: lp.id, lpName: lp.shortName, value: commitment.followOns } : { lpId: lp.id, lpName: lp.shortName, value: 0 });
                    seriesData.unallocatedAmount?.push(commitment?.unlocated ? { lpId: lp.id, lpName: lp.shortName, value: commitment.unlocated } : { lpId: lp.id, lpName: lp.shortName, value: 0 });
                    seriesData.investedPerc?.push(commitment?.invested && totalComitments > 0 ? { lpId: lp.id, lpName: lp.shortName, value: (commitment.invested / totalComitments) * 100 } : { lpId: lp.id, lpName: lp.shortName, value: 0 });
                    seriesData.reservedFeesPerc?.push(commitment?.reservedForFees && totalComitments > 0 ? { lpId: lp.id, lpName: lp.shortName, value: (commitment.reservedForFees / totalComitments) * 100 } : { lpId: lp.id, lpName: lp.shortName, value: 0 });
                    seriesData.folloOnsPerc?.push(commitment?.followOns && totalComitments > 0 ? { lpId: lp.id, lpName: lp.shortName, value: (commitment.followOns / totalComitments) * 100 } : { lpId: lp.id, lpName: lp.shortName, value: 0 });
                    seriesData.unallocatedPerc?.push(commitment?.unlocated && totalComitments > 0 ? { lpId: lp.id, lpName: lp.shortName, value: (commitment.unlocated / totalComitments) * 100 } : { lpId: lp.id, lpName: lp.shortName, value: 0 });
                } else {
                    return;
                }
            });

            const series = [
                { name: 'Unallocated', data: seriesData.unallocatedPerc, dataAmount: seriesData.unallocatedAmount },
                { name: 'Follow Ons', data: seriesData.folloOnsPerc, dataAmount: seriesData.followOnsAmount },
                { name: 'Reserved Fees', data: seriesData.reservedFeesPerc, dataAmount: seriesData.reservedFeesAmount },
                { name: 'Invested', data: seriesData.investedPerc, dataAmount: seriesData.investedAmount }
            ];

            setChartDataValues(series);

        }
        return () => {
            active = false;
        };
    }, [lps, selectedFundValue])

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

    return (
        <Grid container spacing={1} sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: '0.3em', width: { xs: '450px', md: '100%', lg: '100%' } }}>
            <Grid item xs={12} md={7} lg={7}>
                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary, marginRight: '1.5em', textAlign: { xs: 'center', md: 'right' } }} >
                    Allocation per LP
                </Typography>
            </Grid>
            <Grid item xs={12} md={5} lg={5} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center' }}>
                <Autocomplete
                    id={'fundAutocomplete'}
                    popupIcon={<ExpandMoreIcon />}
                    size={'small'}
                    autoHighlight={true}
                    autoSelect={true}
                    autoComplete={false}
                    classes={classes}
                    disableClearable
                    sx={{ marginRight: '1em', width: '320px' }}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(e, value: FundSummary) => onFundChange(e, value)}
                    value={selectedFundValue ?? null}
                    options={funds ?? []}
                    getOptionLabel={(option: FundSummary) => option ? option.id : ''}
                    renderInput={(params: AutocompleteRenderInputParams) => {
                        params.InputProps.className = autocompleteInputClasses.textInput;
                        return <TextField {...params}
                            className={autocompleteInputClasses.autocomplete}
                            variant="outlined"
                            autoComplete="off"
                            type={'text'}
                            style={{ width: '320px' }}
                            label='Select a fund' />;
                    }}
                    PopperComponent={AutocompletePopper}
                />
            </Grid>
            <Grid item xs={12} sx={{ height: { xs: '420px', md: '100%', lg: '100%' }, overflowX: 'auto', width: { xs: '200px', md: '800px', lg: '800px' } }}>
                <HighchartsReact ref={chartComponentRef} highcharts={Highcharts} options={options} containerProps={{ style: { width: '100%', height: '460px' } }} />
            </Grid>
        </Grid>
    );
};

export default LPChartComponent;