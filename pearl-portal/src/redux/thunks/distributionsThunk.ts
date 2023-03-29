import { DistributionsDataService } from "../../services/distributions/DistributionsService";
import { setErrorMessage } from "../slices/appSlice";
import { setDistributions } from "../slices/distributions/distributionsSlice";

/**
 * Fetch all distributions
 */
export const fetchAllDistributions: any = () => async (dispatch: any) => {
    try {
        const distributionsService = new DistributionsDataService();
        const data = await distributionsService.getAllDistributions();
        dispatch(setDistributions(data));
    } catch (error: any) {
        dispatch(setErrorMessage(error));
    }
};