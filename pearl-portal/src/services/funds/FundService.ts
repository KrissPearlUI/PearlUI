import { FundSummary } from '../../models/funds/fundModels';
import {RestService} from '../RestService';

export class FundDataService extends RestService {
    private _baseUrl = './fundsShort.json';

    /**
     * Gets the lp data that is in a json file in the public folder for now later will be a service
     * @return LP[]
     */
    public async getAllFunds(): Promise<FundSummary[]> {
        return this.fetchData(this._baseUrl).then((res:any) => {
            return res.data;
        }).catch((err:any) => {
            console.log(err);
            return err;
        });
    }

}

