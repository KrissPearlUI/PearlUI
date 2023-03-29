import { CashCallDataService } from "../../services/cashCalls/CashCallService";
import { setErrorMessage } from "../slices/appSlice";
import { setCashCalls } from "../slices/cashCalls/cashCallsSlice";

/**
 * Fetch all cash calls
 */
export const fetchCashCalls: any = () => async (dispatch: any) => {
    try {
        const cashCallService = new CashCallDataService();
        const data = await cashCallService.getAllCashCalls();
        dispatch(setCashCalls(data));
    } catch (error: any) {
        dispatch(setErrorMessage(error));
    }
};