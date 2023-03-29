import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FundSummary } from '../../../models/funds/fundModels';

export interface FundsState {
    funds: FundSummary[],
    selectedFund: FundSummary | null
}

const initialState: FundsState = {
    funds: [],
    selectedFund: null
};

const fundsSlice = createSlice({
    name: 'funds',
    initialState,
    reducers: {
        /**
         * Set's the list of Funds
         * @param state
         * @param action
         */
        setFunds(state, action: PayloadAction<FundSummary[]>) {
            state.funds = action.payload;
        },
        /**
         * Set's the list of Funds
         * @param state
         * @param action
         */
        setSelectedFund(state, action: PayloadAction<FundSummary | null>) {
            state.selectedFund = action.payload;
        },
    }
});

export const {
    setFunds,
    setSelectedFund
} = fundsSlice.actions;

export default fundsSlice.reducer;