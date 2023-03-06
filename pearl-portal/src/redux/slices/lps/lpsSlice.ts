import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { LP } from '../../../models/lps/lpModels';

export interface LPsState {
    lps: LP[]
}

const initialState: LPsState = {
    lps: [],
};

const lpsSlice = createSlice({
    name: 'lps',
    initialState,
    reducers: {
        /**
         * Set's the list of LPs
         * @param state
         * @param action
         */
        setLPs(state, action: PayloadAction<LP[]>) {
            state.lps = action.payload;
        },
    }
});

export const {
    setLPs,
} = lpsSlice.actions;

export default lpsSlice.reducer;