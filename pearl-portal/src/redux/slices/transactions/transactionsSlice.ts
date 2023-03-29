import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../../../models/transactions/transactionsModels';

export interface TransactionState {
    transactions: Transaction[]
    selectedTransaction: Transaction | null
}

const initialState: TransactionState = {
    transactions: [],
    selectedTransaction: null
};

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        /**
         * Set's the list of transactions
         * @param state
         * @param action
         */
        setTransactions(state, action: PayloadAction<Transaction[]>) {
            state.transactions = action.payload;
        },
        /**
         * Set's the selected transaction
         * @param state
         * @param action
         */
        setSelectedTransaction(state, action: PayloadAction<Transaction>) {
            state.selectedTransaction = action.payload;
        },
    }
});

export const {
    setTransactions,
    setSelectedTransaction
} = transactionsSlice.actions;

export default transactionsSlice.reducer;