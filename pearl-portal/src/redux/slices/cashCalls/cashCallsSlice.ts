import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CashCall } from '../../../models/cashCalls/cashCallsModels';

export interface CashCallState {
    cashCalls: CashCall[]
    selectedCashCall: CashCall | null
}

const initialState: CashCallState = {
    cashCalls: [],
    selectedCashCall: null
};

const cashCallsSlice = createSlice({
    name: 'cashCalls',
    initialState,
    reducers: {
        /**
         * Set's the list of cash calls
         * @param state
         * @param action
         */
        setCashCalls(state, action: PayloadAction<CashCall[]>) {
            state.cashCalls = action.payload;
        },
        /**
         * Set's the selected cash calls
         * @param state
         * @param action
         */
        setSelectedCashCall(state, action: PayloadAction<CashCall>) {
            state.selectedCashCall = action.payload;
        },
    }
});

export const {
    setCashCalls,
    setSelectedCashCall
} = cashCallsSlice.actions;

export default cashCallsSlice.reducer;