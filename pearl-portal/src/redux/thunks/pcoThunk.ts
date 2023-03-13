import { PCODataService } from "../../services/pcos/PCOService";
import { setErrorMessage } from "../slices/appSlice";
import { setPCOs } from "../slices/pcos/pcosSlice";

/**
 * Fetch all pcos
 */
export const fetchPCOs: any = () => async (dispatch: any) => {
    try {
        const pcosService = new PCODataService();
        const data = await pcosService.getAllPCOs();
        dispatch(setPCOs(data));
    } catch (error:any) {
        dispatch(setErrorMessage(error));
    }
};