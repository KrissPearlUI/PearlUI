import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { LP } from '../../../models/lps/lpModels';

export interface LPsState {
    lps: LP[]
    selectedLP:LP|null
}

const initialState: LPsState = {
    lps: [],
    selectedLP:null
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
        /**
         * Set's the selected LP
         * @param state
         * @param action
         */
        setSelectedLP(state, action: PayloadAction<LP>) {
            state.selectedLP = action.payload;
        },
    }
});

export const {
    setLPs,
    setSelectedLP
} = lpsSlice.actions;

export default lpsSlice.reducer;