import { CashCall } from '../../models/cashCalls/cashCallsModels';
import {RestService} from '../RestService';

export class CashCallDataService extends RestService {
    private _baseUrl = './cashCallsData.json';

    /**
     * Gets the lp data that is in a json file in the public folder for now later will be a service
     * @return LP[]
     */
    public async getAllCashCalls(): Promise<CashCall[]> {
        return this.fetchData(this._baseUrl).then((res:any) => {
            return res.data;
        }).catch((err:any) => {
            console.log(err);
            return err;
        });
    }

}


