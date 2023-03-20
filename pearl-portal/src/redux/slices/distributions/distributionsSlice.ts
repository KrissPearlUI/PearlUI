import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { DistributionBasic } from '../../../models/distributions/distributionsModels';

export interface DistributionsState {
    distributions: DistributionBasic[]
    selectedDistribution:DistributionBasic|null
}

const initialState: DistributionsState = {
    distributions: [],
    selectedDistribution:null
};

const distributionsSlice = createSlice({
    name: 'distributions',
    initialState,
    reducers: {
        /**
         * Set's the list of cash calls
         * @param state
         * @param action
         */
        setDistributions(state, action: PayloadAction<DistributionBasic[]>) {
            state.distributions = action.payload;
        },
        /**
         * Set's the selected cash calls
         * @param state
         * @param action
         */
        setSelectedDistribution(state, action: PayloadAction<DistributionBasic>) {
            state.selectedDistribution = action.payload;
        },
    }
});

export const {
    setDistributions,
    setSelectedDistribution
} = distributionsSlice.actions;

export default distributionsSlice.reducer;