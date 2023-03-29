import { FundDataService } from "../../services/funds/FundService";
import { setErrorMessage } from "../slices/appSlice";
import { setFunds } from "../slices/funds/fundsSlice";

/**
 * Fetch all fnds
 */
export const fetchFunds: any = () => async (dispatch: any) => {
    try {
        const fundsService = new FundDataService();
        const data = await fundsService.getAllFunds();
        dispatch(setFunds(data));
    } catch (error: any) {
        dispatch(setErrorMessage(error));
    }
};                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       