import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { PCOSummary } from '../../../models/pcos/pcoModels';

export interface PCOsState {
    pcos: PCOSummary[]
}

const initialState: PCOsState = {
    pcos: [],
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
    }
});

export const {
    setPCOs,
} = pcosSlice.actions;

export default pcosSlice.reducer;