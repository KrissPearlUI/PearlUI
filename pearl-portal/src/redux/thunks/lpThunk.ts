import { LPDataService } from "../../services/lps/LPService";
import { setErrorMessage } from "../slices/appSlice";
import { setLPs } from "../slices/lps/lpsSlice";

/**
 * Fetch all client data
 */
export const fetchLPs: any = () => async (dispatch: any) => {
    try {
        const lpsService = new LPDataService();
        const data = await lpsService.getAllLPs();
        dispatch(setLPs(data));
    } catch (error: any) {
        dispatch(setErrorMessage(error));
    }
};