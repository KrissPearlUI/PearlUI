import { PCOFinancialsDataService } from "../../services/pcoFinancials/PCOFinancialService";
import { PCODataService } from "../../services/pcos/PCOService";
import { setErrorMessage } from "../slices/appSlice";
import { setPCOs, setPCOsFinantials } from "../slices/pcos/pcosSlice";

/**
 * Fetch all pcos
 */
export const fetchPCOs: any = () => async (dispatch: any) => {
    try {
        const pcosService = new PCODataService();
        const data = await pcosService.getAllPCOs();
        dispatch(setPCOs(data));
    } catch (error: any) {
        dispatch(setErrorMessage(error));
    }
};

/**
 * Fetch all pcos Financials
 */
export const fetchPCOsFinantials: any = () => async (dispatch: any) => {
    try {
        const pcosFinantialService = new PCOFinancialsDataService();
        const data = await pcosFinantialService.getAllPCOsFinancials();
        dispatch(setPCOsFinantials(data));
    } catch (error: any) {
        dispatch(setErrorMessage(error));
    }
};
