import {FormControl, FormControlLabel, FormControlLabelProps, Grid, IconButton, Radio, RadioGroup, styled, Theme, Tooltip, Typography,useTheme} from '@mui/material';
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
import CountryPieChart from './CountryPieChart';

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

interface StyledFormControlLabelProps extends FormControlLabelProps {
    checked: boolean;
  }
  
  const StyledFormControlLabel = styled((props: StyledFormControlLabelProps) => (
    <FormControlLabel {...props} />
  ))(({ theme, checked }) => ({
    fontFamily:'Raleway',
    '.MuiFormControlLabel-label': checked && {
      color: theme.palette.primary.main,
      fontWeight:600
    },
  }));

const PortfolioByIndustry = () => {
    const theme=useTheme();
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
    const autocompleteClasses = autocompleteStyles();
    const classes = useStyles();
    const [localActiveLPId, setLocalActiveLPId] = useState<string>('');
    const [totalValue, setTotalValuee] = useState<number>(0);
    const [currency, setCurrency] = useState('');
    const {pcos} = useSelector((state: RootState) => state.pcos);
    const [chartDataValues, setChartDataValues] = useState<Array<any>>([]);
    const [amountsInvested, setAmountsInvested] = useState<Array<any>>([]);
    const dispatch = useAppDispatch();
    const {pcosExtended,selectedLP} = useSelector((state: RootState) => state.lps);
    const chartInnerWidth = 0.7;
    const [type, setType] = React.useState('byAmount');

    const handleChangeType = (event: React.ChangeEvent<HTMLInputElement>) => {
      setType((event.target as HTMLInputElement).value);
    };
    /**
     * Checks if the fund item from WS is present in current data/balances
     * @param item
     */
   /*  const isNewFundItem = (item: PositionItem): boolean => {
        if (!balances.length) return false;
        if (item.marketValue) return false;

        const {fundId} = balances[0];

        return fundId === item.fundId && !balances.some((x) => x.instrumentCode === item.instrumentCode &&
            x.instrumentType === item.instrumentType);
    };
 */
    /**
     * Checks if the fund item from WS is present in current data/balances
     * @param item
     */
   /*  const isNewAccountItem = (item: PositionItem): boolean => {
        if (!balances.length) return false;
        if (item.marketValue) return false;

        const {venue, accountId} = balances[0];

        return venue === item.venue &&
            accountId === item.accountId && !balances.some((x) => x.instrumentCode === item.instrumentCode &&
                x.instrumentType === item.instrumentType);
    }; */

    /**
     * Constructs the request for the REST call
     * @param id
     * @param currencyValue
     */
    const requestConstructor = (id: string, currencyValue: string): LPPCOInvestmentsRequest => {
        return {
            id,
            currency: currencyValue ?? 'EUR'
        };
    };

    /**
     * Group balances and handle negative values
     */
    const groupValues = (data: any[]) => {
        const {
            otherTokensName,
            topCategoriesCount,
            sliceBorderWidth,
            negativeValueBorderStyle,
            normalBorderStyle,
            negativeSliceColor
        } = customChartConfiguration;

        if (data.length >= topCategoriesCount) {

            let othersY = 0;
            let othersTotalQuantity = 0;

            const others = data.slice(topCategoriesCount);
            others.forEach((el: any) => {
                othersY += el.amountInvested;
                othersTotalQuantity += Number(el.amountInvested) || 0;
            });

            data = data.slice(0, topCategoriesCount).map((el: any) => el = {
                ...el,
                negative: el.amountInvested < 0,
                dashStyle: el.amountInvested < 0 ? negativeValueBorderStyle : normalBorderStyle,
                borderWidth: sliceBorderWidth,
            });

            data.push({
                name: otherTokensName,
                amountInvested: othersTotalQuantity,
                y: Math.abs(othersY),
                marketValue: othersY,
                negative: othersY < 0,
                dashStyle: othersY < 0 ? negativeValueBorderStyle : normalBorderStyle,
                borderWidth: sliceBorderWidth,
                color: othersY < 0 ? negativeSliceColor : '',
            });

            data.sort((a: any, b: any) => b.y - a.y);
        } else {
            data = data.map(el => {
                return {
                    ...el,
                    negative: el.amountInvested < 0,
                    dashStyle: el.amountInvested < 0 ? negativeValueBorderStyle : normalBorderStyle,
                    borderWidth: sliceBorderWidth,
                };
            });
        }

        return data;
    };

    /**
     * Print a number with commas as thousands separators
     */
    const numberWithCommas = useCallback((x: number): string => {
        return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }, []);

    /**
     * Calculates total market value
     */
    const calculateTotalAmountInvested = useCallback((values: ChartItem[]) => {
        let result = 0;

        values.forEach(v => {
            result += v.amountInvested??0;
        });

    }, [numberWithCommas]);


    /**
     * Gets the accounts
     */
    const getOptions = (localActiveLP: LP|null): Option[] => {
        let pcosList: any;
        const options: Option[] = [];

        if (localActiveLP && localActiveLP.pcos && localActiveLP.pcos.length>0) {
            /* if (!showAllBalances) {
                accounts = localActiveFund.accounts.slice();
            } else {
                //accounts = localActiveFund.accounts.filter((a: any) => Object.keys(a.balances.available).length > 0);
            } */
            let data = localActiveLP.pcos.map(pco=>({
                ...pco,
                pcoName: pcos.filter(x=>x.id===pco.id)[0]?.pcoName??'',
                country: pcos.filter(x=>x.id===pco.id)[0]?.country??'',
                dateFirstInvestment: pcos.filter(x=>x.id===pco.id)[0]?.dateInitalInvestment ??'',
                currentStage: pcos.filter(x=>x.id===pco.id)[0]?.currentStage??'',
                initalStage: pcos.filter(x=>x.id===pco.id)[0]?.initialStage??'',
                dateExit: pcos.filter(x=>x.id===pco.id)[0]?.dateExit ??'',
                emeraldIndustry1: pcos.filter(x=>x.id===pco.id)[0]?.emeraldIndustry1,
                emeraldIndustry2: pcos.filter(x=>x.id===pco.id)[0]?.emeraldIndustry2,
            }
            ));

            pcosList=data

            for (const item of pcosList) {
                if (item.type === 'funding') {
                    options.push({
                        label: 'Funding',
                        id: item.id
                    });
                }
                if (item.type === 'trading') {
                    options.push({
                        label: `Trading ${capitalizeLetters(item.venueCode)} ${capitalizeLetters(item.tradeType)} ${capitalizeLetters(item.tradingAccountType)}  ${item.tradeType === 'margin' && item.venueCode === 'binance' && item.subType ? `:: ${item.subType.toUpperCase()}` : ''}`,
                        id: item.id
                    });
                }
                if (item.type === 'deposit') {
                    options.push({
                        label: `Deposit ${capitalizeLetters(item.depositType)} ${capitalizeLetters(item.subType)}`,
                        id: item.id
                    });
                }
            }
            options.unshift({
                label: 'All',
                id: localActiveLP.id
            });
        }

        return options;
    };

    type Item = {
        id: number;
        country: string;
        amount: number;
      };

      

      interface DataPoint {
        name: string;
        y: number;
        showInLegend?: boolean;
      }
      

      useEffect(()=>{
        if(pcosExtended){
            let total:number=0;
            let chartData:any[]=[];
            if(type==='byAmount'){
                const groupedByStage: {[key: string]: number} = pcosExtended.reduce(
                    (acc: {[key: string]: number}, item) => {
                      const {emeraldIndustry2, amountInvested} = item;
                      acc[emeraldIndustry2??''] = (acc[emeraldIndustry2??''] || 0) + (amountInvested?amountInvested:0);
                      return acc;
                    },
                    {}
                  );
                 total = pcosExtended.reduce((sum, dataPoint) => sum + (dataPoint.amountInvested?dataPoint.amountInvested:0), 0);
                  chartData = Object.entries(groupedByStage).map(([name, y]) => ({
                    name,
                    y,
                  }));
            } else{
                const groupedByStage =  pcosExtended.reduce(
                    (acc: {[key: string]: number}, item) => {
                    const {emeraldIndustry2} = item;
                    if (!acc[emeraldIndustry2??'']) {
                        acc[emeraldIndustry2??''] = 1;
                      } else {
                        acc[emeraldIndustry2??'']++;
                      }
                      return acc;
                    }, {});
                 total = pcosExtended.reduce((sum, dataPoint) => sum + (dataPoint.amountInvested?dataPoint.amountInvested:0), 0);
                  chartData = Object.entries(groupedByStage).map(([name, y]) => ({
                    name,
                    y,
                  }));
            }
            setTotalValuee(total);
            setChartDataValues(chartData);
        }
      },[pcosExtended,type]);

      return (
        <Grid container sx={{display:'flex', flex:1}}>
             <Grid item xs={12} md={12} lg={12}>
                <FormControl>
                    <RadioGroup
                        aria-labelledby="type-country-radio-btn"
                        name="type-country-radio-btn"
                        value={type}
                        onChange={handleChangeType}
                    >
                        <StyledFormControlLabel checked={type==='byAmount'} value="byAmount" control={<Radio sx={{fontFamily:'Raleway'}} />} label="By amount invested" />
                        <StyledFormControlLabel checked={type==='byPCOs'} value="byPCOs" control={<Radio sx={{fontFamily:'Raleway'}}/>} label="By number of PCOs" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={12} lg={12} sx={{paddingTop:'0.5em', paddingBottom:'0.5em'}}>
                <span style={{fontFamily:'Raleway', fontWeight:600}}>Total amount: {amountValueFormatter(totalValue, '')}</span>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
                <CountryPieChart chartDataValues={chartDataValues}/>
            </Grid>
        </Grid>
      );
};

export default React.memo(PortfolioByIndustry);
