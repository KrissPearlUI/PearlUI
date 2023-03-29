import { PCOFinancial } from '../../models/pcos/pcoModels';
import { RestService } from '../RestService';

export class PCOFinancialsDataService extends RestService {
    private _baseUrl = './pcoNavLatests.json';

    /**
     * Gets the pco data that is in a json file in the public folder for now later will be a service
     * @return PCOFinancial[]
     */
    public async getAllPCOsFinancials(): Promise<PCOFinancial[]> {
        return this.fetchData(this._baseUrl).then((res: any) => {
            return res.data;
        }).catch((err: any) => {
            console.log(err);
            return err;
        });
    }

}

