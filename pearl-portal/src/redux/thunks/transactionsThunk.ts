import { TransactionDataService } from "../../services/transactions/TransactionService";
import { setErrorMessage } from "../slices/appSlice";
import { setTransactions } from "../slices/transactions/transactionsSlice";

/**
 * Fetch all transactions
 */
export const fetchTransactions: any = () => async (dispatch: any) => {
    try {
        const transactionService = new TransactionDataService();
        const data = await transactionService.getAllTransactions();
        dispatch(setTransactions(data));
    } catch (error: any) {
        dispatch(setErrorMessage(error));
    }
};