import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { PCOFinancial, PCOSummary } from '../../../models/pcos/pcoModels';

export interface PCOsState {
    pcos: PCOSummary[],
    pcosFinancials:PCOFinancial[]
}

const initialState: PCOsState = {
    pcos: [],
    pcosFinancials:[]
};

const pcosSlice = createSlice({
    name: 'pcos',
    initialState,
    reducers: {
        /**
         * Set's the list of PCOs
         * @param state
         * @param action
         */
        setPCOs(state, action: PayloadAction<PCOSummary[]>) {
            state.pcos = action.payload;
        },
        /**
         * Set's the pcos Financials
         * @param state
         * @param action
         */
        setPCOsFinantials(state, action: PayloadAction<PCOFinancial[]>) {
            state.pcosFinancials = action.payload;
        },
    }
});

export const {
    setPCOs,
    setPCOsFinantials
} = pcosSlice.actions;

export default pcosSlice.reducer;