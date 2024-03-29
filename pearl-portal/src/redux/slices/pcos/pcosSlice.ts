import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PCOFinancial, PCOSummary } from '../../../models/pcos/pcoModels';

export interface PCOsState {
    pcos: PCOSummary[],
    pcosFinancials: PCOFinancial[],
    selectedPCO: PCOSummary | null,
    selectedInvestment:any
}

const initialState: PCOsState = {
    pcos: [],
    pcosFinancials: [],
    selectedPCO: null,
    selectedInvestment:null
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
        /**
         * Set's the list of PCOs
         * @param state
         * @param action
         */
        setSelectedPCO(state, action: PayloadAction<PCOSummary | null>) {
            state.selectedPCO = action.payload;
        },
        setSelectedInvestment(state, action: PayloadAction<any>) {
            state.selectedInvestment = action.payload;
        },
    }
});

export const {
    setPCOs,
    setPCOsFinantials,
    setSelectedPCO,
    setSelectedInvestment
} = pcosSlice.actions;

export default pcosSlice.reducer;