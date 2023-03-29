import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LP, PCOExtended } from '../../../models/lps/lpModels';

export interface LPsState {
    lps: LP[]
    selectedLP: LP | null,
    pcosExtended: PCOExtended[]
}

const initialState: LPsState = {
    lps: [],
    selectedLP: null,
    pcosExtended: []
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
        /**
         * Set's the list of pcos that the selected lp has
         * @param state
         * @param action
         */
        setPCOsExtended(state, action: PayloadAction<PCOExtended[]>) {
            state.pcosExtended = action.payload;
        },
    }
});

export const {
    setLPs,
    setSelectedLP,
    setPCOsExtended
} = lpsSlice.actions;

export default lpsSlice.reducer;