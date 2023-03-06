import { ValueGetterParams } from 'ag-grid-community';
import {Md5} from 'ts-md5';

/**
 * Getting avatar url
 * @param email
 * @param size
 */
export const getUserAvatarUrl = (email: string, size = 32): string => {
    const hash = Md5.hashStr(email);
    return `//0.gravatar.com/avatar/${hash}?s=${size}`;
};

export const getBrowserLocale = (): string => {
    const locales = getBrowserLocales();
    return locales[0];
};

/**
 * Rounding the number
 * @param value
 */
export const roundValue = (value: number | string): number => {
    return Math.floor(+value * 100000000) / 100000000;
};

export const getBrowserLocales = (options = {}): string[] => {
    const defaultOptions = {
        languageCodeOnly: false
    };

    const opt = {
        ...defaultOptions,
        ...options
    };

    const browserLocales = navigator.languages === undefined ? [navigator.language] : navigator.languages;

    if (!browserLocales) {
        return [];
    }

    return browserLocales.map((locale) => {
        const trimmedLocale = locale?.trim();

        return opt.languageCodeOnly ? trimmedLocale.split(/[-_]/)[0] : trimmedLocale;
    });
};

/**
 * Number formatter with maximum fraction digits of 6
 */
export const numberFormatter = new Intl.NumberFormat(getBrowserLocale(), {maximumFractionDigits: 6});

/**
 * Crypto number formatter with maximum fraction digits of 8
 */
export const cryptoNumberFormatter = new Intl.NumberFormat(getBrowserLocale(), {maximumFractionDigits: 8});

/**
 * Fiat number formatter with maximum fraction digits of 2
 */
export const fiatNumberFormatter = new Intl.NumberFormat(getBrowserLocale(), {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
});

/**
 * Fiat number formatter for valuation
 */
export const fiatNumberFormatterValuation = new Intl.NumberFormat(getBrowserLocale());

/**
 * Number formatter with maximum fraction digits of 4
 */
export const customPriceFormatter = new Intl.NumberFormat(getBrowserLocale(), {
    maximumFractionDigits: 4,
    minimumFractionDigits: 4
});

/**
 * Check if values is empty
 * @param value
 */
export const isValueEmpty = (value: any): boolean => {
    return value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value?.trim().length === 0);
};

/**
 * Number formatter with maximum fraction digits of 1
 */
const formatter1 = new Intl.NumberFormat(getBrowserLocale(), {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1
});

/**
 * Number formatter with maximum fraction digits of 2
 */
const formatter2 = new Intl.NumberFormat(getBrowserLocale(), {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
});

/**
 * Number formatter with maximum fraction digits of 3
 */
const formatter3 = new Intl.NumberFormat(getBrowserLocale(), {
    maximumFractionDigits: 3,
    minimumFractionDigits: 3
});

/**
 * Number formatter with maximum fraction digits of 4
 */
const formatter4 = new Intl.NumberFormat(getBrowserLocale(), {
    maximumFractionDigits: 4,
    minimumFractionDigits: 4
});

/**
 * Number formatter with maximum fraction digits of 5
 */
const formatter5 = new Intl.NumberFormat(getBrowserLocale(), {
    maximumFractionDigits: 5,
    minimumFractionDigits: 5
});


/**
 * Format margin
 * @param value
 */
export const formatMargin = (value: number | string): string => {
    const v = roundValue(+value);
    return formatter4.format(v);
};

/**
 * Format price
 * @param value
 */
export const formatPrice = (value: number) => {
    value = +value;

    if (value === 0) {
        return '0';
    }

    if (value >= 1000) {
        return formatter1.format(value);
    }

    if (value >= 100) {
        return formatter2.format(value);
    }

    if (value >= 10) {
        return formatter3.format(value);
    }

    if (value >= 1) {
        return formatter4.format(value);
    }

    return formatter5.format(value);
};

export const formatPercentage = (value: number) => {
    return formatter2.format(value);
};

/**
 * Format value
 * @param value
 */
export const formatValue = (value: string) => {
    if (value.length > 1) {
        // eslint-disable-next-line
        value = value.replace(/[^0-9.]/g, '');
        if (!value.includes('.') && value[0] === '0' && value[1] === '0') {
            value = '0';
        } else if (!value.includes('.') && value[0] === '0' && value[1] !== '0') {
            value = value[1];
        } else if (value.split('.').length >= 2) {
            value = value.replace(/\.+$/, '');
        }
    }
    return value;
};


/**
 * Capitalize first letter
 * @param value
 */
export const capitalizeLetters = (value: string): string | undefined => {
    let newString = '';
    if (value?.match(/[A-Z][a-z]+/g)) {
        const arr = value.split(/(?=[A-Z])/);

        arr.forEach((a) => {
            newString = newString + `${a?.charAt(0).toUpperCase() + a?.slice(1)} `;
        });

        return newString;
    } else {
        return value?.charAt(0).toUpperCase() + value?.slice(1);
    }
};

/**
 * Removes scientific notation
 * @param quantityValue
 * @return string
 */
export const avoidScientificNotation = (quantityValue: any) => {
    if (Math.abs(quantityValue) < 1.0) {
        const e = parseInt(quantityValue.toString().split('e-')[1]);
        if (e) {
            quantityValue *= Math.pow(10, e - 1);
            quantityValue = '0.' + (new Array(e)).join('0') + quantityValue.toString().substring(2);
        }
    } else {
        let e = parseInt(quantityValue.toString().split('+')[1]);
        if (e > 20) {
            e -= 20;
            quantityValue /= Math.pow(10, e);
            quantityValue += (new Array(e + 1)).join('0');
        }
    }
    return quantityValue;
};


export const priceWithMax8FractionDigits = (quantity: number | string) => {
    const numberWithFormatting = cryptoNumberFormatter.format(+quantity);

    return numberWithFormatting;
};

/**
 * Amount formatter
 */
export const amountValueFormatter = (amount: number | string, currency: string): string => {
    return numberFormatter.format(+amount);
};

export const amountValueGetter = (params: ValueGetterParams): number => {
    if (params.data) {
        return params.data.quantity * params.data.price;
    } else
    return 0;
};
