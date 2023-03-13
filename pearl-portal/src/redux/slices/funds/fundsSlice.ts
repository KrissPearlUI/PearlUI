import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { FundSummary } from '../../../models/funds/fundModels';

export interface FundsState {
    funds: FundSummary[]
}

const initialState: FundsState = {
    funds: [],
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
    }
});

export const {
    setFunds,
} = fundsSlice.actions;

export default fundsSlice.reducer;