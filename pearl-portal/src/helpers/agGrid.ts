import {
    ICellRendererParams,
    IServerSideDatasource,
    SideBarDef,
    ValueFormatterParams,
    ValueGetterParams
} from 'ag-grid-community';
import moment from 'moment';
import {
    amountValueFormatter,
    capitalizeLetters,
    cryptoNumberFormatter,
    customPriceFormatter,
    fiatNumberFormatter,
    fiatNumberFormatterNoDecimals,
    formatMargin,
    formatPercentage,
    formatPrice
} from './app';
import {Theme} from '@mui/material/styles';
import CustomTooltip from '../components/cellRenderers/CustomTooltipCellRenderer';

/**
 * Sets the ag-grid theme based on the selected theme in the app
 * @param isDark
 */
export const getGridTheme = (isDark: boolean): string => {
    return isDark ? 'ag-theme-alpine-dark' : 'ag-theme-alpine';
};

/**
 * Cell formatter for formatting numbers
 * @param params
 */
export const numberCellFormatter = (params: any) => {
    const number = params.value && !isNaN(params.value) ? Number(params.value) : 0;
    return fiatNumberFormatter.format(number);
};

/**
 * Cell formatter for formatting strings to have a first capital letter
 * @param params
 */
export const stringCellFormatter = (params: any): string => capitalizeLetters(params?.value)?.toString() ?? '';

/**
 * Cell getter for getting date
 * @param params
 */
export const dateValueGetter = (params: ValueGetterParams) => {
    if (params.data) return moment(params.data.timestamp).startOf('day');
};

/**
 * Cell formatter for formatting date in the specific format "MMMM.DD.YYYY"
 * @param params
 */
export const dateValueFormatter = (params: ValueFormatterParams) => {
    if (params.value) return moment(new Date(params.value)).format('DD MMM YYYY');
    return params.value;
};

/**
 * Cell formatter for formatting time in the specific format "HH:mm:ss"
 * @param params
 */
export const timeValueFormatter = (params: ValueFormatterParams) => {
    if (params.value) return moment(params.value).format('HH:mm:ss');
    return params.value;
};

/**
 * Cell formatter for formatting date and time in the specific format "MMMM.DD.YYYY; HH:mm:ss"
 * @param params
 */
export const dateTimeValueFormatter = (params: ValueFormatterParams) => {
    if (params.value) return moment(params.value).format('MMMM.DD.YYYY, HH:mm:ss');
    return params.value;
};

/**
 * Cell formatter for formatting guid
 * @param params
 */
export const guidValueFormatter = (params: ValueFormatterParams) => {
    if (params.value) {
        const parts = params.value.split('-');
        return parts[0];
    }
    return params.value;
};

/**
 * Cell formatter for formatting quantity
 * @param params
 */
export const quantityValueFormatter = (params: ValueFormatterParams) => {
    if (params.value) {
        return fiatNumberFormatterNoDecimals.format(params.value);
    }
    return params.value;
};

/**
 * Cell formatter for formatting percentage
 * @param params
 */
export const percentageyValueFormatter = (params: ValueFormatterParams) => {
    if (params.value) {
        return `${(params.value*100).toFixed(2)} %`;
    }
    return params.value;
};

/**
 * Cell formatter for formatting string to convert it to upper casse
 * @param params
 */
export const capitalizeLetterCellFormatter = (params: ValueFormatterParams) => {
    if (params.value) {
        return params.value.toUpperCase();
    }
    return params.value;
};

/**
 * Cell formatter for formatting price
 * @param params
 */
export const priceValueFormatter = (params: ValueFormatterParams) => {
    if (params.value) return `${formatPrice(params.value)}`;
    return params.value;
};

export const assetCellStyle = (theme: Theme) => {
    return {
        color: theme.palette.primary.main,
        fontFamily: 'Raleway',
        paddingLeft: '0.5em',
        paddingRight: '2px',
        justifyContent: 'flex-end'
    };
};

export const staticCellStyle = (theme: Theme) => {
    return {
        color: theme.palette.text.primary,
        fontFamily: 'Raleway',
        paddingLeft: '2px',
        paddingRight: '2px'
    };
};

export const staticCellStyleNumbers = (theme: Theme) => {
    return {
        color: theme.palette.text.primary,
        fontFamily: 'Raleway',
        fontSize: '12px',
        paddingLeft: '2px',
        paddingRight: '2px'
    };
};

/**
 * Cell formatter for formatting percentage
 * @param params
 */
export const percentageValueFormatter = (params: ValueFormatterParams) => {
    if (params.value) return `${formatPercentage(params.value)}%`;
    return params.value;
};

/**
 * Cell formatter for formatting margin values to the 4th digit after decimal point
 * @param params
 */
export const marginFormatter = (params: ValueFormatterParams): string => {
    if (params.value) return formatMargin(params.value);
    return params.value;
};

/**
 * Cell formatter for formatting values to have 4 decimals
 * @param params
 */
export const priceNumberFormater = (params: ValueFormatterParams): string => {
    if (params.value) {
        return customPriceFormatter.format(+params.value);
    }
    return params.value;
};


export const displayPrecisionValueSizePrecision = (value: string, instruments: any, venueCode: string) => {
    if (value && instruments) {
        return instruments.filter((x:any) => x.extendedCode === value && x.venueCode === venueCode)[0]?.sizePrecision ?? 2;
    }
};

export const numberCellRenderer = (params: ICellRendererParams) => {
    if (params?.value && params?.colDef) {
        let sign = '';
        if (!(params.colDef.headerName === 'Balance' || params.colDef.headerName === 'Size' || params.colDef?.headerName?.includes('Market Price'))) {
            sign = params.value > 0 ? '+' : '';
        }
        const numberWithEightDec = parseFloat(params.value).toFixed(8);
        const numberAsString = numberWithEightDec.toString();
        const containsDot = numberAsString?.includes('.');
        let beforeDot = numberAsString;
        let afterDot = '';
        if (containsDot) {
            const number = numberAsString.split('.');
            beforeDot = number[0];
            afterDot = number[1];
        }
        const formattedBeforeDot = beforeDot === '0' ? beforeDot : params.colDef.headerName === 'Size' ? amountValueFormatter(parseFloat(beforeDot), params.data.instrumentCode) : amountValueFormatter(parseFloat(beforeDot), params.data.instrumentCode);

        return `${sign}${formattedBeforeDot}.${afterDot}`;
    }
};


/**
 * Setting ag-grid default status panel definitions
 */
export const DefaultStatusPanelDef = {
    statusPanels: [
        {
            statusPanel: 'agAggregationComponent',
            statusPanelParams: {
                // possible values are: 'count', 'sum', 'min', 'max', 'avg'
                aggFuncs: ['avg', 'sum', 'min', 'max']
            }
        }
    ]
};

/**
 * Setting ag-grid default side bar definitions
 */
export const DefaultSideBarDef: SideBarDef = {
    toolPanels: [
        {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
            toolPanelParams: {
                suppressPivotMode: true,
                suppressValues: true
            }
        },
        {
            id: 'filters',
            labelDefault: 'Filters',
            labelKey: 'filters',
            iconKey: 'filter',
            toolPanel: 'agFiltersToolPanel'
        }
    ],
    position: 'right'
};

/**
 * Setting ag-grid default column definitions
 */
export const DefaultColumnDef = {
    filter: true,
    resizable: true,
    sortable: true,
    display: 'flex',
    flex: 1,
    tooltipComponent: CustomTooltip
};
